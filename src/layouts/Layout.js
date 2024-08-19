import React from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {ClimbingBoxLoader } from 'react-spinners'
import { useSelector } from 'react-redux'

const override = {
    position: "absolute",
    top: "0",
    left: "0",
    textAlign : "center",
    right: "0",
    bottom: "0",
    backgroundColor: "rgb(0 0 0 / 20%)",
    width: "100%",
    height: "100%",
    zIndex: "99",

}

const Layout = () => {
    const status = useSelector(state => state.globalLoading.status)
  return (
    <div>
        <ClimbingBoxLoader  loading= {status} cssOverride={override} color='#ffffff' />
        <Outlet/>
        <ToastContainer/>
    </div>
  )
}

export default Layout