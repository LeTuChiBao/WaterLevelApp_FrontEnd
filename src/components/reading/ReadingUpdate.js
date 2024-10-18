import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import * as actions from '../../redux/actions'
import requestApi from "../../helpers/api"
import { toast } from "react-toastify"

const ReadingUpdate = () => {
    const param = useParams()
    console.log("Id user => " ,param)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register,setValue, handleSubmit, formState:{errors}} = useForm()
    const [sensors, setSensors]= useState([])

    useEffect(()=> {
        dispatch(actions.controlLoading(true))
        try {
            const fetchData = async () => {
                dispatch(actions.controlLoading(true)) // start loading
        
                // Chờ hàm getSensor() hoàn thành trước
                const resSensor = await getSensor();
        
                const resReading = await getDetailReading();
        
            }
  
            const getSensor = async()=> {
                const res = await requestApi('/sensors','GET')
                console.log("Reading update Sensor => ", res)
                dispatch(actions.controlLoading(false))
                setSensors(res.data.data)
                }
                
           const getDetailReading = async()=> {
                const res = await requestApi(`/readings/${param.id}`,'GET')
                console.log('getDetaiReading',res)
                const fields = ['sensor', 'water_level']
                fields.forEach((field) => {
                    if(field === 'sensor') {
                        console.log('res.data[field]?.id',res.data[field]?.id)
                        console.log(res.data[field])
                        setValue('sensorId',res.data[field]?.id)
                    }
                    else {
                        setValue(field,res.data[field])
                    }
                    
                })
            }
          
            fetchData()
        } catch (error) {
            console.log(actions)
        }finally{
            dispatch(actions.controlLoading(false))
        }
    },[])

    const handleSubmitFormUpdate= async (data) => {
        console.log('data form update => ',data)
        dispatch(actions.controlLoading(true))
        try {
            const res = await requestApi(`/readings/${param.id}`,'PUT', data)
            console.log("response =>", res)
            dispatch(actions.controlLoading(false))
            toast.success(` Readings ${param.id} has been updated successfully` , {position: "top-center", autoClose: 2000})
            setTimeout(()=> navigate('/readings'),3000)
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
                <h1 className="mt-4">Update User</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item"><Link to='/'>Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to='/readings'>Readings</Link></li>
                    <li className="breadcrumb-item active">Update Reading</li>
                </ol>
                <div className="mb-4">
                    <div className="card mb-4">
                        <div className="card-header">
                            <i className="fas fa-plus me-1"></i>
                            Update
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                            <form className="d-flex gap-3 justify-content-center">
                                        <div className="col-md-6"> 
                              
                                                <div className="mb-3 mt-3">
                                                    <label className="form-label">Water Level:</label> 
                                                    <input
                                                    {...register('water_level', {
                                                        required: "Water Level level is required",
                                                        validate: {
                                                            isFloat: (value) => {
                                                                const parsedValue = parseFloat(value);
                                                                return !isNaN(parsedValue) && parsedValue.toString() === value.trim() || "Water Level must be a valid float number";
                                                            }
                                                        }
                                                    })}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Water Level as float number"
                                                    />
                                                    
                                                    {/* Error message */}
                                                    {errors.water_level && <p style={{color: 'red'}}>{errors.water_level.message}</p>}
                                                </div>

                                                <div className="mb-3 mt-3">
                                                    <label className="form-label">Sensors:</label> 
                                                    <select {...register("sensorId",{required: "Sensor is required."})} className="form-select" >
                                                            <option value="">--Select a Sensor--</option>
                                                            {sensors.map(sensorId=> {
                                                                return <option key={sensorId.id} value={sensorId.id}>{sensorId.name}</option>
                                                            })}
                                                    </select>
                                                    {errors.sensorId && <p style={{color: 'red'}}>{errors.sensorId.message}</p>}
                                                </div>
                                        </div> 
       
                                    </form>
                                    
                            </div>
                            <div className="row mb-3">
                                     <div className="col-12 mt-3 text-center">
                                            <button type="button" onClick={handleSubmit(handleSubmitFormUpdate)} className="btn btn-success w-50">Submit</button>
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

export default ReadingUpdate