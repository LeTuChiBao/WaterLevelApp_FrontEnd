import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import * as actions from '../../redux/actions'
import requestApi from "../../helpers/api"
import { toast } from "react-toastify"
const UserAdd = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register, handleSubmit, formState:{errors}} = useForm()
    const [roles, setRoles]= useState([])

    useEffect(()=> {
        dispatch(actions.controlLoading(true))
        try {
           const getRole = async()=> {
                const res = await requestApi('/roles','GET')
                console.log("res Role => ", res)
                dispatch(actions.controlLoading(false))
                setRoles(res.data)
           }
           getRole()
        } catch (error) {
            dispatch(actions.controlLoading(false))
            console.log(actions)
        }
    },[])

    const handleSubmitFormAdd= async (data) => {
        console.log('data form => ',data)
        dispatch(actions.controlLoading(true))
        try {
            const res = await requestApi('/users','POST', data)
            console.log("response =>", res)
            dispatch(actions.controlLoading(false))
            toast.success("User has beenn created successfully", {position: "top-center", autoClose: 2000})
            setTimeout(()=> navigate('/users'),3000)
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
                        <li className="breadcrumb-item"><Link to='/users'>Users</Link></li>
                        <li className="breadcrumb-item active">Add new</li>
                    </ol>
                    <div className="mb-4">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-plus me-1"></i>
                                Add
                            </div>
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
                                                <label className="form-label">Email:</label> 
                                                <input {...register('email',{
                                                    required:"Email is required",
                                                    pattern: {
                                                        value: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}/,
                                                        message: "Invalid email address"
                                                    }
                                                    
                                                    })}  type="email" className="form-control" placeholder="Enter email"/>
                                                {errors.email && <p style={{color: 'red'}}>{errors.email.message}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Password:</label> 
                                                <input {...register('password',{required:"Password is required"})} type="text" className="form-control" placeholder="Enter password"/>
                                                {errors.password && <p style={{color: 'red'}}>{errors.password.message}</p>}
                                            </div>
                                            <div className="mb-3 mt-3">
                                                <label className="form-label">Status:</label> 
                                                <select {...register('status')} className="form-select">
                                                        <option value="1">Active</option>
                                                        <option value="2">Inactive</option>
                                                </select>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Roles:</label> 
                                                <select {...register("role",{required: "Category is required."})} className="form-select" >
                                                        <option value="">--Select a Role--</option>
                                                        {roles.map(role=> {
                                                            return <option key={role.id} value={role.id}>{role.name}</option>
                                                        })}
                                                </select>
                                                {errors.role && <p style={{color: 'red'}}>{errors.role.message}</p>}
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

export default UserAdd