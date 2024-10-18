import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import requestApi from '../helpers/api';
import { Slide, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import * as actions from '../redux/actions'

export const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [registerData, setRegisterData] = useState({});
    const [formErrors, setFormErrors] = useState({})
    const [isSubmitted, setIsSubmitted] =  useState(false)
    const [regions, setRegions]= useState([])

    const onChange = (event) => {
        let target = event.target;
        setRegisterData({
            ...registerData, [target.name]:target.value
        })
    }
    useEffect(()=> {
        if(isSubmitted) validateForm();
    }, [registerData])

    useEffect(()=> {
       
        dispatch(actions.controlLoading(true))
        try {
           const getRegion = async()=> {
                const res = await requestApi('/regions','GET')
                console.log("res Regions => ", res)
                dispatch(actions.controlLoading(false))
                setRegions(res.data)
           }
           getRegion()
        } catch (error) {
            dispatch(actions.controlLoading(false))
            console.log(actions)
        }
    }, [])

    const validateForm = () => {
        let isValid = true;
        const errors = {};
        if(registerData.email === '' || registerData.email === undefined){
            errors.email = 'Please enter email'
        }else{
            let valid = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}/.test(registerData.email)
            if(!valid) errors.email = "Email is not valid"
        }

        if(registerData.firstName === '' || registerData.firstName === undefined){
            errors.firstName = 'Please enter Fisrt Name'
        } 

        if(registerData.lastName === '' || registerData.lastName === undefined){
            errors.lastName = 'Please enter Last Name'
        } 
        if(registerData.regionId === '' || registerData.regionId === undefined){
            errors.regionId = 'Please Select Register'
        } 

        if(registerData.password === '' || registerData.password === undefined){
            errors.password = 'Please enter Pass word'
        } else{

            if(registerData.password.length <6) errors.password = "Password must be greater than or equal 6 characters"
        }

        if(Object.keys(errors).length > 0) {
            setFormErrors(errors);
            isValid = false
        }else{
            setFormErrors({})
        }
        return isValid;

    }
    const onSubmit = ()=> {
        console.log(registerData)
        let valid = validateForm();
        if(valid){
            dispatch(actions.controlLoading(true))
            requestApi('/auth/register','POST',registerData).then((res)=> {
                console.log("Đã vào login.js react")
                console.log(res)
                localStorage.setItem('access_token', res.data.access_token);
                localStorage.setItem('refresh_token', res.data.refresh_token);
                dispatch(actions.controlLoading(false))
                navigate('/')
            }).catch(err=> {
                console.log(err)
                dispatch(actions.controlLoading(false))
                if(typeof err.response !== "undefined"){
                    if(err.response.status !== 201){
                        toast.error(err.response.data.message, {
                            position: "top-right",
                            autoClose: 3000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            transition: Slide
                        })
                    }else{
                        toast.error("Server is down. Please try again!", {
                            position: "top-right",
                            autoClose: 3000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            transition: Slide
                        })
                    }
                }
            })
        }
        setIsSubmitted(true)
    }


  return (
    <div id="layoutAuthentication"  className="bg-primary">
            <div id='layoutAuthentication_header' >
                <div className="d-flex justify-content-center mt-5">
                <img src={'../assets/images/water-level.png'} width={150}/>
                </div>
            </div>
    <div id="layoutAuthentication_content">
        <main>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="card shadow-lg border-0 rounded-lg mt-5">
                            <div className="card-header">
                                <h3 className="text-center font-weight-light my-4">Create Account</h3>
                                
                                </div>
                            <div className="card-body">
                                <form>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <div className="form-floating mb-3 mb-md-0">
                                                <input className="form-control" id="inputFirstName" name='firstName' onChange={onChange} type="text" placeholder="Enter your first name" />
                                                <label for="inputFirstName">First name</label>
                                                {formErrors.firstName && <p style={{color:'red'}}>{formErrors.firstName}</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input className="form-control" id="inputLastName" name='lastName' onChange={onChange} type="text" placeholder="Enter your last name" />
                                                <label for="inputLastName">Last name</label>
                                                {formErrors.lastName && <p style={{color:'red'}}>{formErrors.lastName}</p>}
                                            </div>
                                        </div>
                                    </div>
    
                                    
                                    <div className="row mb-0">
                                        <div className='col-md-6'>
                                            <div className="form-floating mb-3">
                                                <input className="form-control" id="inputEmail" type="email" name='email' onChange={onChange} placeholder="name@example.com" />
                                                <label for="inputEmail">Email address</label>
                                                {formErrors.email && <p style={{color:'red'}}>{formErrors.email}</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating mb-3 mb-md-0">
                                                <input className="form-control" id="inputPassword" type="password" name='password' onChange={onChange} placeholder="Create a password" />
                                                <label for="inputPassword">Password</label>
                                                 {formErrors.password && <p style={{color:'red'}}>{formErrors.password}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row mb-3'>
                                        <div className="col-md-12">
                                            <label className="form-label">Region:</label> 
                                            <select className="form-select" name='regionId' onChange={onChange}>
                                                    <option value="">--Select a Region--</option>
                                                    {regions.map(region=> {
                                                        return <option key={region.id} value={region.id}>{region.ward} - {region.district}</option>
                                                    })}
                                            </select>
                                            {formErrors.regionId && <p style={{color: 'red'}}>{formErrors.regionId}</p>}
                                            </div>
                                    </div>

                                    <div className="mt-4 mb-4">
                                        <div className="d-grid">
                                            <button className="btn btn-primary btn-block" onClick={onSubmit} type="button">Create Account</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer text-center py-3">
                                <div className="small">
                                    <Link to="/login">Have an account? Go to login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <div id="layoutAuthentication_footer">
        <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
                <div className="d-flex align-items-center justify-content-between small">
                    <div className="text-muted">Copyright &copy; Bảo Lê - Nhóm 12 - 2024</div>
                    <div>
                        <a href="#">Privacy Policy</a>
                        &middot;
                        <a href="#">Terms &amp; Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</div>
  )
}
export default Register