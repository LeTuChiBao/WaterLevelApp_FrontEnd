import React, { useEffect, useState } from 'react'
import requestApi from '../helpers/api'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ColumnChart from './ColumnChart'
import RegionChart from './RegionChart'
import ArcGISMap from './argis/ArcGISMap'

export const Dashboard = () => {
    const dispatch = useDispatch()
    const [dashboardData, setdashboardData] =useState({})

    const [loading, setLoading] = useState(true); 
    const [selectedDate, setSelectedDate] = useState(new Date()); // Trạng thái cho ngày đã chọn
    const [readings, setReadings] = useState([]);
    const [allSensor, setAllSensor] = useState([]);
    const [damage_level, setDamageLevel] = useState(0);

    const fetchReadings = async (date) => {
        setLoading(true); 
        try {
            const formattedDate = date.toLocaleDateString('en-CA'); 
            const response = await requestApi(`/readings/date/${formattedDate}`,'GET'); 
            console.log("Get by date",response)
            setReadings(response.data); 

            const getAllSensor = await requestApi('/sensors?limit=40','GET')
            setAllSensor(getAllSensor.data.data)
            console.log(getAllSensor)
        } catch (error) {
            console.error('Error fetching readings:', error); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        const dateToFetch = selectedDate ; 
        fetchReadings(dateToFetch);
    }, [selectedDate]); 

    const fetchDataCurentUser = async () => {
        try {
            const response = await requestApi('/users/profile', 'GET');
            console.log('User Profile:', response.data);
            localStorage.setItem('role',response.data?.role?.name );
            localStorage.setItem('curentUser',response.data?.id );
            setDamageLevel(response.data.region?.damage_level)
            console.log(damage_level)
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };
    useEffect(()=> {
        fetchDataCurentUser();
        const promiseUser = requestApi('/users','GET')
        const promiseRegion = requestApi('/regions/params','GET')
        const promiseSensor = requestApi('/sensors','GET')
        const promiseReading = requestApi('/readings/params','GET')
        const promiseNotify = requestApi('/notify','GET')
        dispatch(actions.controlLoading(true));
        
        Promise.all([promiseUser,promiseRegion,promiseSensor,promiseReading,promiseNotify]).then((res)=> {
            console.log("Dashboard Res=> ",res)
            setdashboardData({
                ...dashboardData, totalUser : res[0].data.total, 
                totalRegion : res[1].data.total, 
                RegionData : res[1].data.data,  
                totalSensor: res[2].data.total,
                totalReading: res[3].data.total,
                totalNotify: res[4].data.total,
            })
            dispatch(actions.controlLoading(false));
        }).catch(error =>{
            console.log(error)
            dispatch(actions.controlLoading(false));
        })

    },[])
  return (
    <div id="layoutSidenav_content">
    <main>
        <div className="container-fluid px-4">
            <h1 className="mt-4">Dashboard</h1>
            <div className="row d-flex justify-content-center">
                <div className="col-xl-2 col-md-6">
                    <div className="card bg-primary text-white mb-4">
                        <div className="card-body">Total User 
                            <div className='d-flex justify-content-center'>
                                    <h1>{dashboardData.totalUser}</h1>
                            </div>
                        </div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to='/users'>User Table</Link>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-2 col-md-6 ">
                    <div className="card bg-warning text-white mb-4 ">
                        <div className="card-body ">Total Region
                            <div className='d-flex justify-content-center'>
                                <h1>{dashboardData.totalRegion}</h1>
                            </div>
                            
                           
                        </div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to='/regions'>Region Table</Link>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-2 col-md-6">
                    <div className="card bg-success text-white mb-4">
                        <div className="card-body">Total Sensor
                            <div className='d-flex justify-content-center'>
                                <h1>{dashboardData.totalSensor}</h1>
                            </div>   
                        </div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <a className="small text-white stretched-link" href="/sensors">Sensor Table</a>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-2 col-md-6">
                    <div className="card bg-danger text-white mb-4">
                        <div className="card-body">Total Reading
                            <div className='d-flex justify-content-center'>
                                <h1>{dashboardData.totalReading}</h1>
                            </div>   
                        </div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <a className="small text-white stretched-link" href="/readings">Reading Table</a>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div> 
                <div className="col-xl-2 col-md-6">
                    <div className="card bg-danger text-white mb-4">
                        <div className="card-body">Notifies
                            <div className='d-flex justify-content-center'>
                                <h1>{dashboardData.totalNotify}</h1>
                            </div>   
                        </div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <a className="small text-white stretched-link" href="/notifies">Notify Table</a>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div> 
                
            </div>
            <div className="card mb-4">
                <div className='card-header d-flex align-items-center justify-content-between'>
                <div className="d-flex align-items-center">
                        <i className="fas fa-chart-bar me-2"></i>
                        <span className="form-label mb-0">Argis Map </span>
                    </div>
                </div>
                <div className='card-argis'>
                    <div className='card-body'>
                    <ArcGISMap sensors={allSensor} readings={readings} />
                    </div>
                </div>
            
            </div>
            <div className="card mb-4">
            <div className="card-header d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-chart-bar me-2"></i>
                        <span className="form-label mb-0">Reading Chart </span>
                    </div>
                    <div>
                        <label className="form-label mb-0">Select Date : </label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)} // Cập nhật ngày khi người dùng chọn
                            dateFormat="yyyy-MM-dd" // Định dạng ngày
                            className="form-control" // CSS class cho input
                            style={{ width: '200px' }} // Đặt chiều rộng cho DatePicker
                        />
                    </div>
                </div>
                <div className="card-body">
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            readings.length > 0 && damage_level ? (
                            <ColumnChart data={readings} damage_level={damage_level}/>
                            ) : (
                            <p>No readings available.</p> // Hiển thị nếu không có dữ liệu
                            )
                        )}
                        </div>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1"></i>
                    Region damage char
                </div>
                <div className="card-body">
                  <div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        dashboardData.totalRegion > 0 ? (
                        <RegionChart data={dashboardData.RegionData} />
                        ) : (
                        <p>No readings available.</p> // Hiển thị nếu không có dữ liệu
                        )
                    )}
                    </div>
                </div>
            </div>
        </div>
    </main>
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
  )
}
export default Dashboard