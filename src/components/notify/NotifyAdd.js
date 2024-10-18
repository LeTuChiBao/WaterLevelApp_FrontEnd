import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import * as actions from '../../redux/actions'
import requestApi from "../../helpers/api"
import { toast } from "react-toastify"
const NotifyAdd = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register, handleSubmit, formState:{errors}} = useForm()
    const [readings, setReadings]= useState([])
    const [users, setUser]= useState([])
    const [sendMode, setSendMode] = useState('multiple');

    useEffect(()=> {
        dispatch(actions.controlLoading(true))
        try {
           const getReading = async()=> {
                const res = await requestApi('/readings','GET')
                console.log("res Reading => ", res)
                dispatch(actions.controlLoading(false))
                setReadings(res.data)
            }
            const getUser = async()=> {
                const res = await requestApi('/users','GET')
                console.log("res getUser => ", res)
                dispatch(actions.controlLoading(false))
                setUser(res.data.data)
            }
            getReading()
            getUser()
        } catch (error) {
            dispatch(actions.controlLoading(false))
            console.log(actions)
        }
    },[])

    const handleSubmitFormAdd= async (data) => {
        console.log('data form => ',data, sendMode)
        if(sendMode === 'multiple') {
            try {
                const res = await requestApi('/notify/multiple-create','POST', data)
                console.log("multiple create notify =>", res)
                dispatch(actions.controlLoading(false))
                toast.success("Notifies has been created successfully", {position: "top-center", autoClose: 2000})
                setTimeout(()=> navigate('/notifies'),3000)
            } catch (error) {
                dispatch(actions.controlLoading(false))
                toast.error( error, {position: "top-center", autoClose: 2000})
                console.log('error=> ',error)
            }
        }else {
            try {
                const res = await requestApi('/notify','POST', data)
                console.log("Sigle create notify =>", res)
                dispatch(actions.controlLoading(false))
                toast.success("Notify has been created successfully", {position: "top-center", autoClose: 2000})
                setTimeout(()=> navigate('/notifies'),3000)
                window.location.reload();
            } catch (error) {
                dispatch(actions.controlLoading(false))
                toast.error( error, {position: "top-center", autoClose: 2000})
                console.log('error=> ',error)
            }
        }
       
    }
  return (
        <div id="layoutSidenav_content">
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">New Notify</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to='/'>Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to='/notifies'>Notify</Link></li>
                        <li className="breadcrumb-item active">Add new</li>
                    </ol>
                    <div className="mb-4">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-plus me-1"></i>
                                Add
                            </div>
                            <div className="card-body">
                                <div className="row mb-3 " >
                                    <form className="d-flex gap-3 justify-content-center">
                                        <div className="col-md-6"> 
                              
                                            <div className="mb-3 mt-3">
                                                <label className="form-label">Message:</label> 
                                                <input {...register("message")} type="text" className="form-control" placeholder="Enter message. If dont't input send default message"/>
                                            </div>

                                                <div className="mb-3 mt-3">
                                                    <label className="form-label">Reading:</label> 
                                                    <select {...register("readingId",{required: "Reading is required."})} className="form-select" >
                                                            <option value="">--Select a Reading--</option>
                                                            {readings.map(readingId=> {
                                                                return <option key={readingId.id} value={readingId.id}>{readingId.updated_at} - {readingId.water_level} - {readingId.sensor?.name}</option>
                                                            })}
                                                    </select>
                                                    {errors.readingId && <p style={{color: 'red'}}>{errors.readingId.message}</p>}
                                                </div>

                                                    <div>
                                                        {/* Chọn chế độ gửi */}
                                                        <div className="mb-3 mt-3">
                                                            <label className="form-label">Send Mode:</label>
                                                            <select onChange={(e) => setSendMode(e.target.value)} className="form-select">
                                                            <option value="multiple">Multiple Send</option>
                                                            <option value="single">Single Send</option>
                                                            </select>
                                                        </div>

                                                        {/* Trường User chỉ hiển thị khi chế độ gửi là 'single' hoặc 'multiple' */}
                                                        {(sendMode === 'single') && (
                                                            <div className="mb-3 mt-3">
                                                            <label className="form-label">User:</label>
                                                            <select {...register("userId", {
                                                                required: sendMode !== '' ? "User is required." : false
                                                            })} className="form-select">
                                                                <option value="">--Select a User--</option>
                                                                {users.map(user => (
                                                                <option key={user.id} value={user.id}>{user.email}</option>
                                                                ))}
                                                            </select>
                                                            {errors.userId && <p style={{ color: 'red' }}>{errors.userId.message}</p>}
                                                            </div>
                                                        )}
                                                        </div>
                                        </div> 
       
                                    </form>
                                    
                                    
                                </div>
                                <div className="row mb-3">
                                     <div className="col-12 mt-3 text-center">
                                            <button type="button" onClick={handleSubmit(handleSubmitFormAdd)} className="btn btn-success w-50">Submit</button>
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

export default NotifyAdd