import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Header = () => {
    const navigate = useNavigate()
    const currentUserId = localStorage.getItem('role');
    const onHandleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        navigate("/login")
    }
  return (
    <nav className="sb-top nav navbar navbar-expand navbar-dark bg-dark">
    <a className="navbar-brand ps-3" href="/">Water Level</a>
    <img src={'../assets/images/water-level.png'} width={40}/>
    <span className='navbar-brand ps-5'> Role : {currentUserId}</span>

    <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div className="input-group">
            <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
            <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
        </div>
    </form>
    <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="#!">Settings</a></li>
                <li><Link className="dropdown-item"  to='/profile' >Profile</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" onClick={onHandleLogout}>Logout</a></li>
            </ul>
        </li>
    </ul>
</nav>
  )
}
export default Header