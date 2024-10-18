import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import requestApi from '../helpers/api';

const Sidebar = () => {
    const [notifies, setNotifies] = useState('0');
    const currentUserId = localStorage.getItem('curentUser');
    useEffect(()=> {

        try {

            const getUser = async()=> {
            const res = await requestApi(`/notify/user/${currentUserId}?search=false`,'GET')
            console.log("res Notify by => ", res)
            setNotifies(res.data.total)
            }
            getUser()
        } catch (error) {
            console.log(error)
        }
    },[])
    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">Core</div>
                        <Link to='/' className='nav-link'> 
                        <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                        Dashboard</Link>

                        <Link to='user/notify' className='nav-link'> 
                        <div className="sb-nav-link-icon"><i className="fas fa-comments"></i></div>
                        My Notifies
                        <span className="badge rounded-pill bg-danger ms-2">
                                {notifies}
                             </span>
                        </Link>

                        <div className="sb-sidenav-menu-heading">Interface</div>
                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-user"></i></div>
                            Users
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link to='/user/add' className='nav-link'>Add User</Link>
                                <Link to='/users' className='nav-link'>List Users</Link>
                            </nav>
                        </div>
                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseRegion" aria-expanded="false" aria-controls="collapseRegion">
                            <div className="sb-nav-link-icon"><i className="fas fa-globe"></i></div>
                            Regions
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapseRegion" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link to='/region/add' className='nav-link'>Add Region</Link>
                                <Link to='/regions' className='nav-link'>List Regions</Link>
                            </nav>
                        </div>
                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseSensor" aria-expanded="false" aria-controls="collapseSensor">
                            <div className="sb-nav-link-icon"><i className="fas fa-cog"></i></div>
                            Sensors
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapseSensor" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link to='/sensor/add' className='nav-link'>Add Sensor</Link>
                                <Link to='/sensors' className='nav-link'>List Sensors</Link>
                            </nav>
                        </div>

                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseReading" aria-expanded="false" aria-controls="collapseReading">
                            <div className="sb-nav-link-icon"><i className="fas fa-book"></i></div>
                            Readings
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapseReading" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link to='/reading/add' className='nav-link'>Add Reading</Link>
                                <Link to='/readings' className='nav-link'>List Readings</Link>
                            </nav>
                        </div>

                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseNotify" aria-expanded="false" aria-controls="collapseNotify">
                            <div className="sb-nav-link-icon"><i className="fas fa-comments"></i></div>
                            Notifies
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapseNotify" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link to='/notify/add' className='nav-link'>Add Notify</Link>
                                <Link to='/notifies' className='nav-link'>List Notifies</Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar