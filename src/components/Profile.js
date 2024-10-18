import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import * as actions from '../redux/actions'
import requestApi from "../helpers/api"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"

const Profile = () => {
    const dispatch = useDispatch()
    const {register,setValue, handleSubmit, formState:{errors}} = useForm()
    const [profileData, setProfileData] = useState({})
    const [isSelectedFile, setIsSelectedFile] = useState(false)
    const [isId, setIsId] = useState('')

    useEffect(()=> {
        dispatch(actions.controlLoading(true))
        requestApi('/users/profile','GET').then(res=>{
            console.log(res);
            if(res.data.avatar){
             setProfileData({...res.data, avatar: process.env.REACT_APP_URL+'/'+res.data.avatar})
            }
            setIsId(res.data.id)

            const fields = ['firstName', 'lastName', 'status']
            fields.forEach((field) => setValue(field,res.data[field]))
            dispatch(actions.controlLoading(false))
        }).catch(error=> {
            dispatch(actions.controlLoading(false))
            console.log(error)
        })
    },[])

    const onImageChange = (event) => {
        if(event.target.files[0]){
            const file = event.target.files[0]
            let reader = new FileReader()
            reader.onload = (e) => {
                setProfileData({
                    ...profileData, avatar : reader.result,file : file
                })
                setIsSelectedFile(true)
            }
            reader.readAsDataURL(file)
        }
    }
    const handleUpdateAvatar = ()=> {
        let formData = new FormData()
        formData.append('avatar',profileData.file)
        dispatch(actions.controlLoading(true));
        requestApi('/users/upload-avatar','POST', formData,'json','multipart/form-data').then(res=> {
            console.log('Res avatar upload', res)
            dispatch(actions.controlLoading(false));
            toast.success('Avatar has been update successfully', {position: 'top-center', autoClose: 2000})
            setIsSelectedFile(false)
        }).catch(err=> {
            dispatch(actions.controlLoading(false));
            toast.error(`Update data failed with error ${err.message}`, {position: 'top-center', autoClose: 2000})
            console.log(err)
        })
    }

    const handleSubmitFormUpdate= async (data) => {
        console.log('data form update => ',data)
        dispatch(actions.controlLoading(true))
        try {
            const res = await requestApi(`/users/${isId}`,'PUT', data)
            console.log("response =>", res)
            dispatch(actions.controlLoading(false))
            toast.success("User has been updated successfully", {position: "top-center", autoClose: 2000})
        } catch (error) {
            dispatch(actions.controlLoading(false))
            toast.error( error.message, {position: "top-center", autoClose: 2000})
            console.log('error=> ',error.message)
        }
    }
  return (
    <div id="layoutSidenav_content">
        <main>
            <div className="container-fluid px-4">
                <h1 className="mt-4">Profile</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Profile</li>
                </ol>
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-md-8">
                                <img src={profileData.avatar ? profileData.avatar : "/assets/images/default_avatar.jpg"} className="img-thumbnail rounded mb-2 w-50 d-block" alt="avatar"></img>
                                <div className="input-file float-start">
                                    <label htmlFor="file" className="btn-file btn-sm btn btn-primary">Browse file</label>
                                    <input id="file" type="file" onChange={onImageChange} accept="image/*"></input>
                                </div>
                                {isSelectedFile && <button className="btn btn-sm btn-success float-end" onClick={handleUpdateAvatar}>Update</button>}
                            </div>
                            <div className="col-md-4">
                                <div className="card-body">
                                <div className="row mb-3">
                                    <form>
                                        <div className="col-md-6">
                                            <div className="mb-3 mt-3">
                                                <label className="form-label">First Name:</label> 
                                                <input {...register('firstName',{required:"First name is required"})} type="text" className="form-control" placeholder="Enter first name"/>
                                                {errors.firstName && <p style={{color: 'red'}}>{errors.firstName.message}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Last Name:</label> 
                                                <input {...register('lastName',{required:"Last name is required"})}  type="text" className="form-control" placeholder="Enter last name"/>
                                                {errors.lastName && <p style={{color: 'red'}}>{errors.lastName.message}</p>}
                                            </div>
                                            <div className="mb-3 mt-3">
                                                <label className="form-label">Status:</label> 
                                                <select className="form-select">
                                                        <option value="1">Active</option>
                                                        <option value="2">Inactive</option>
                                                </select>
                                            </div>
                                            <button type="button" onClick={handleSubmit(handleSubmitFormUpdate)} className="btn btn-success">Edit Your Info</button>
                                            
                                        </div>
                                    </form>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                    
            </div>
        </main>
    </div>
  )
}

export default Profile