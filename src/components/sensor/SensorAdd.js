import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import * as actions from '../../redux/actions'
import requestApi from "../../helpers/api"
import { toast } from "react-toastify"
const SensorAdd = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register, handleSubmit, formState:{errors}} = useForm()
    const [regions, setRegions]= useState([])

    useEffect(()=> {
        dispatch(actions.controlLoading(true))
        try {
           const getRegions = async()=> {
                const res = await requestApi('/regions','GET')
                console.log("res Regions => ", res)
                dispatch(actions.controlLoading(false))
                setRegions(res.data)
            }
           getRegions()
        } catch (error) {
            dispatch(actions.controlLoading(false))
            console.log(actions)
        }
    },[])

    const handleSubmitFormAdd= async (data) => {
        console.log('data form => ',data)
        dispatch(actions.controlLoading(true))
        try {
            const res = await requestApi('/sensors','POST', data)
            console.log("response =>", res)
            dispatch(actions.controlLoading(false))
            toast.success("Sensor has been created successfully", {position: "top-center", autoClose: 2000})
            setTimeout(()=> navigate('/sensors'),3000)
        } catch (error) {
            dispatch(actions.controlLoading(false))
            toast.error( error, {position: "top-center", autoClose: 2000})
            console.log('error=> ',error)
        }
    }
  return (
        <div id="layoutSidenav_content">
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">New User</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to='/'>Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to='/sensors'>Sensors</Link></li>
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
                                                <label className="form-label">Sensor Name:</label> 
                                                <input {...register('name',{required:"Sensor Name is required"})} type="text" className="form-control" placeholder="Enter Sensor name"/>
                                                {errors.name && <p style={{color: 'red'}}>{errors.name.message}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Description:</label> 
                                                <input {...register('description',{required:"Description is required"})} type="text" className="form-control" placeholder="Enter description about sensor"/>
                                                {errors.description && <p style={{color: 'red'}}>{errors.description.message}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Status:</label> 
                                                <select {...register('status')} className="form-select">
                                                        <option value="1">Active</option>
                                                        <option value="2">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6"> 
                                            <div className="mb-3 mt-3">
                                                    <label className="form-label">Latitude:</label> 
                                                    <input
                                                    {...register('latitude', {
                                                        required: "Latitude level is required",
                                                        validate: {
                                                            isFloat: (value) => {
                                                                const parsedValue = parseFloat(value);
                                                                return !isNaN(parsedValue) && parsedValue.toString() === value.trim() || "Water Level must be a valid float number";
                                                            },
                                                            isDot: (value) => !value.includes(',') || "Latitude must use '.' instead of ','"
                                                        }
                                                    })}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter latitude as float number"
                                                    />
                                                    
                                                    {/* Error message */}
                                                    {errors.latitude && <p style={{color: 'red'}}>{errors.latitude.message}</p>}
                                                </div>
                              
                                                <div className="mb-3 mt-3">
                                                    <label className="form-label">Longitude:</label> 
                                                    <input
                                                    {...register('longitude', {
                                                        required: "Longitude level is required",
                                                        validate: {
                                                            isFloat: (value) => {
                                                                const parsedValue = parseFloat(value);
                                                                return !isNaN(parsedValue) && parsedValue.toString() === value.trim() || "Water Level must be a valid float number";
                                                            },
                                                            isDot: (value) => !value.includes(',') || "Longitude must use '.' instead of ','"
                                                        }
                                                    })}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter longitude as float number"
                                                    />
                                                    
                                                    {/* Error message */}
                                                    {errors.longitude && <p style={{color: 'red'}}>{errors.longitude.message}</p>}
                                                </div>
                                            <div className="mb-3 mt-3">
                                                <label className="form-label">Regions:</label> 
                                                <select {...register("regionId",{required: "Region is required."})} className="form-select" >
                                                        <option value="">--Select a Region--</option>
                                                        {regions.map(regionId=> {
                                                            return <option key={regionId.id} value={regionId.id}>{regionId.ward} - {regionId.district}</option>
                                                        })}
                                                </select>
                                                {errors.regionId && <p style={{color: 'red'}}>{errors.regionId.message}</p>}
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

export default SensorAdd