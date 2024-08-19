import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import * as actions from '../../redux/actions'
import requestApi from "../../helpers/api"
import { toast } from "react-toastify"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { useParams } from "react-router-dom"
import CustomUploadAdapter from "../../helpers/customUploadAdapter"

const PostUpdate = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register,setValue, handleSubmit, trigger, formState:{errors}} = useForm()
    const [categories,setCategories] = useState([])
    const [postData,setPostData] = useState({})
    const params = useParams()

    const handleSubmitFormAdd= async (data) => {
        console.log('data form => ',data)
        let formData = new FormData()
        for(let key in data){
                if(key == 'thumbnail'){
                    if(data.thumbnail[0] instanceof File) formData.append(key, data[key][0])
                }else{
                    formData.append(key, data[key])
                }
        }
       
       dispatch(actions.controlLoading(true))
   
       try {
        const res = await requestApi(`/posts/${params.id}`,'PUT', formData, 'json','multipart/form-data');
        console.log("response =>", res)
        dispatch(actions.controlLoading(false))
        toast.success("Post has been updated successfully", {position: "top-center", autoClose: 2000})
        setTimeout(()=> navigate('/posts'),3000)
        } catch (error) {
        dispatch(actions.controlLoading(false))
        toast.error( error.message, {position: "top-center", autoClose: 2000})
        console.log('error=> ',error)
        }
    }
    useEffect(()=> {
        dispatch(actions.controlLoading(true))
        try {
            const renderData = async()=>{
                const res = await requestApi('/categories','GET')
                console.log('Categories => ',res)
                setCategories(res.data)

                const detailPost = await requestApi(`/posts/${params.id}`, 'GET')
                console.log('detailPost => ', detailPost)

                const fields = ['title', 'summary','description' ,'thumbnail','category', 'status']
                fields.forEach(field => {
                    if(field == 'category') {
                        setValue(field, detailPost.data[field].id)
                    }else{
                        setValue(field, detailPost.data[field])
                    }
                   
                })
                setPostData({...detailPost.data,thumbnail: process.env.REACT_APP_URL+'/'+detailPost.data.thumbnail})
                dispatch(actions.controlLoading(false)) 
            }  
            renderData()   
        } catch (error) {
            dispatch(actions.controlLoading(false))
            console.log(error)
        }
       
    },[])


    
    const onThumbnailChange = (event)=> {

        if(event.target.files && event.target.files[0]) {
            let reader = new FileReader()
            reader.onload = (e) => {
                setPostData({...postData, thumbnail: reader.result})
            }
            reader.readAsDataURL(event.target.files[0])
            console.log(event.target.files[0])
        }
    }

    function uploadPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader)=> {
            return new CustomUploadAdapter(loader)
        }
    }

  return (
        <div id="layoutSidenav_content">
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Update Post</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to='/'>Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to='/posts'>Posts</Link></li>
                        <li className="breadcrumb-item active">Update Post</li>
                    </ol>
                    <div className="mb-4">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-plus me-1"></i>
                                Update
                            </div>
                            <div className="card-body">
                                <div className="row mb-3">
                                    <form>
                                        <div className="col-md-6">
                                            <div className="mb-3 mt-3">
                                                <label className="form-label">Title:</label> 
                                                <input {...register('title',{required:"Title post is required"})} type="text" className="form-control" placeholder="Enter title name"/>
                                                {errors.title && <p style={{color: 'red'}}>{errors.title.message}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Summary:</label> 
                                                <textarea rows='4'{...register('summary',{required:"Description is required"})} className="form-control"  placeholder="Enter summary post"/>
                                                {errors.summary && <p style={{color: 'red'}}>{errors.summary.message}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Description:</label> 
                                                <CKEditor
                                                    editor={ ClassicEditor }
                                                    data={postData.description}
                                                    onReady={ editor => {
                                                       register('description', {required: 'Description is require.'})
                                                    }}
                                                    onChange={ (event, editor) => {
                                                        const data = editor.getData();
                                                        setValue('description',data)
                                                        trigger('description')
                                                    }}
                                                    config={{
                                                        extraPlugins : [uploadPlugin]
                                                    }}
                                               
                                                />
                                                {errors.description && <p style={{color: 'red'}}>{errors.description.message}</p>}
                                            </div>
                                            <div className="mb-3 mt-3">
                                            <label className="form-label">Thumbnail:</label><br/>
                                            {postData.thumbnail && <img style={{width: "300px"}} src={postData.thumbnail} className="mb-2" alt="..."/> }
                                                    <div className="input-file">
                                                        <label htmlFor="file" className="btn-file btn-sm btn btn-primary">Browse file</label>
                                                        <input id="file" type="file" name="thumbnail" {...register("thumbnail", {onChange: onThumbnailChange })}></input>
                                                    </div>
                                                {/* {errors.thumbnail && <p style={{color: 'red'}}>{errors.thumbnail.message}</p>} */}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Category:</label> 
                                                <select {...register("category",{required: "Category is required."})} className="form-select" >
                                                        <option value="">--Select a category--</option>
                                                        {categories.map(cat=> {
                                                            return <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        })}
                                                </select>
                                                {errors.category && <p style={{color: 'red'}}>{errors.category.message}</p>}
                                            </div>
                                            <div className="mb-3 mt-3">
                                                <label className="form-label">Status:</label> 
                                                <select className="form-select">
                                                        <option value="1">Active</option>
                                                        <option value="2">Inactive</option>
                                                </select>
                                            </div>
                                            <button type="button" onClick={handleSubmit(handleSubmitFormAdd)} className="btn btn-success">Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                        
                </div>
            </main>
        </div>
  )
}

export default PostUpdate