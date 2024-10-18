import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import * as actions from '../../redux/actions'
import requestApi from "../../helpers/api"
import { toast } from "react-toastify"
const NotifyAdd = () => {
    const dispatch = useDispatch()
    const [reloadData, setReloadData] = useState(false); // Thêm state để theo dõi reload
    const [myNotifies, setMyNotify] = useState([]);
    const [profile, setProfile] = useState({});
    const [showReadingTrue, setShowReadingTrue] = useState(false);
    useEffect(() => {
        const fetchUserProfile = async () => {
          dispatch(actions.controlLoading(true))
          const currentId = localStorage.getItem('curentUser');
          if (currentId) {
            try {
              const response = await requestApi(`/notify/user/${currentId}`, 'GET');
              setMyNotify(response.data.data);
              dispatch(actions.controlLoading(false))
              console.log('My notify', response)
            } catch (error) {
              console.error('Error fetching My notify:', error);
              dispatch(actions.controlLoading(false))
            }
          }
        };

        const getProfile = async () => {
            dispatch(actions.controlLoading(true))
            try {
                const response = await requestApi(`/users/profile`, 'GET');
                setProfile(response.data);
                dispatch(actions.controlLoading(false))
                console.log('My Profile', profile)
              } catch (error) {
                console.error('Error fetching user profile:', error);
                dispatch(actions.controlLoading(false))
              }
          };
    
        fetchUserProfile();
        getProfile();
      }, [reloadData]);

    const toggleReading = (isReading) => {
        setShowReadingTrue(isReading);
    };
    const handleRead = async (id) => {
        console.log('handleRead', id)
        try {
            const res = await requestApi(`/notify/read/${id}`,'PUT', [])
            console.log("Read notify =>", res)
            dispatch(actions.controlLoading(false))
            toast.success(`Read ${id} has been created successfully`, {position: "top-center", autoClose: 1000});
            setReloadData(prev => !prev)
            window.location.reload();
        } catch (error) {
            dispatch(actions.controlLoading(false))
            toast.error( error, {position: "top-center", autoClose: 2000})
            console.log('error=> ',error)
        }
    };

    const handleDelete = async (id) => {
        console.log('handleRead', id)
        try {
            const res = await requestApi(`/notify/${id}`,'DELETE', [])
            console.log("DELETE notify =>", res)
            dispatch(actions.controlLoading(false))
            toast.success(`DELETE Message ${id} has been created successfully`, {position: "top-center", autoClose: 1000});
            setReloadData(prev => !prev)
        } catch (error) {
            dispatch(actions.controlLoading(false))
            toast.error( error, {position: "top-center", autoClose: 2000})
            console.log('error=> ',error)
        }
    };

  return (
        <div id="layoutSidenav_content">
            <main>
            <div className="card">
    <div className="card-header">
        <h5 className="mb-0">My Notifies</h5>
    </div>
    <div className="card-body">
    <div className="btn-group" role="group" aria-label="Basic example">
                    <button 
                        type="button" 
                        className={`btn ${showReadingTrue ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => toggleReading(true)}
                    >
                        Already Check
                    </button>
                    <button 
                        type="button" 
                        className={`btn ${showReadingTrue ? 'btn-secondary' : 'btn-primary'}`} 
                        onClick={() => toggleReading(false)}
                    >
                        Not Check
                    </button>
                </div>
            </div>
            <div className="card-body">
                {myNotifies[0] ? 
                
                myNotifies ? (
                    <>
                        {showReadingTrue ? (
                            myNotifies.filter(item => item.isReading).map(item => (
                                <div key={item.id} className="card mb-3 border-success" >
                                <div className="card-body">
                                    <div class="card-header">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="card-title">Message Already Read</h5>
                                        <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                    </div>
                                    
                                        <p className="card-text "><small className="text-muted">User: {profile.firstName} {profile.lastName}</small></p>
                                        <p className="card-text "><small className="text-muted">Email: {profile.email}</small></p>
                                    </div>
                                    
                                    <p className="card-text">Message: {item.message}</p>

                                   <div className="card bg-info d-flex align-items-center justify-content-between">
                                
                                        <h5 className="card-text text-white">Water Level: {item.reading.water_level}</h5>
                                        <p className="card-text text-white small">Reading at: {new Date(item.reading.updated_at).toLocaleString()}</p>
                                    
                                   </div>
                                   <p className="card-text "><small className="text-muted">Create at: {new Date(item.created_at).toLocaleString()}</small></p>
                                  
                                </div>
                            </div>
                            ))
                        ) : (
                            myNotifies.filter(item => !item.isReading).map(item => (
                                <div key={item.id} className="card mb-3 border-info" >
                                    <div className="card-body">
                                        <div class="card-header">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h5 className="card-title">You have a new Message</h5>
                                            <button className="btn btn-primary" onClick={() => handleRead(item.id)}>Read</button>
                                        </div>
                                        
                                            <p className="card-text "><small className="text-muted">User: {profile.firstName} {profile.lastName}</small></p>
                                            <p className="card-text "><small className="text-muted">Email: {profile.email}</small></p>
                                        </div>
                                        
                                        <p className="card-text">Message: {item.message}</p>

                                       <div className="card bg-danger d-flex align-items-center justify-content-between">
                                    
                                            <h5 className="card-text text-white">Water Level: {item.reading.water_level}</h5>
                                            <p className="card-text text-white small">Reading at: {new Date(item.reading.updated_at).toLocaleString()}</p>
                                        
                                       </div>
                                       <p className="card-text "><small className="text-muted">Create at: {new Date(item.created_at).toLocaleString()}</small></p>
                                      
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                ) : (
                    <p>Loading profile...</p>
            )
                
                :  <p>Bạn không có thông báo nào !</p>}
               
    </div>


    
</div>

            </main>
        </div>
  )
}

export default NotifyAdd