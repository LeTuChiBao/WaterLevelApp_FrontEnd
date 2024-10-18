import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import * as actions from '../../redux/actions'
import requestApi from "../../helpers/api"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

const RegionUpdate = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register,setValue, handleSubmit, formState:{errors}} = useForm()

    const params = useParams()

    useEffect(()=> {
        dispatch(actions.controlLoading(true))
        try {
            const renderData = async()=>{
                const detailRegion = await requestApi(`/regions/${params.id}`, 'GET')
                console.log('detail Region => ', detailRegion)

                const fields = ['ward', 'district','damage_level' ]
                fields.forEach(field => {
                    setValue(field, detailRegion.data[field])
                })
                dispatch(actions.controlLoading(false)) 
            }  
            renderData()   
        } catch (error) {
            dispatch(actions.controlLoading(false))
            console.log(error)
        }
       
    },[])

    const handleSubmitFormEdit= async (data) => {
        console.log('data form => ',data)
        dispatch(actions.controlLoading(true))
        try {
            const res = await requestApi(`/regions/${params.id}`,'PUT', data)
            console.log("response =>", res)
            dispatch(actions.controlLoading(false))
            toast.success("Region has been updated successfully", {position: "top-center", autoClose: 2000})
            setTimeout(()=> navigate('/regions'),3000)
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
                    <h1 className="mt-4">Update Region</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to='/'>Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to='/posts'>Regions</Link></li>
                        <li className="breadcrumb-item active">Update Region</li>
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
                                                <label className="form-label">Damage level:</label> 
                                                   <input
                                                    {...register('damage_level', {
                                                        required: "Damage level is required",
                                                        validate: (value) => !isNaN(parseFloat(value)) || "Damage level must be a float number"
                                                    })}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter damage level as float number"
                                                    />
                                                    
                                                    {/* Error message */}
                                                    {errors.damage_level && <p style={{color: 'red'}}>{errors.damage_level.message}</p>}
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Ward:</label> 
                                                <input {...register('ward',{required:"Ward is required"})} type="text" className="form-control" placeholder="Enter the Ward near Saigon River"/>
                                                {errors.ward && <p style={{color: 'red'}}>{errors.ward.message}</p>}
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">District:</label> 
                                                <input {...register('district',{required:"District is required"})} type="text" className="form-control" placeholder="Enter the district that contains this ward"/>
                                                {errors.district && <p style={{color: 'red'}}>{errors.district.message}</p>}
                                            </div>

                                            <button type="button" onClick={handleSubmit(handleSubmitFormEdit)} className="btn btn-success">Submit</button>
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

export default RegionUpdate