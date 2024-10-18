
import './App.css';
import './css/styles.css';
import { Routes, Route } from 'react-router-dom';
import  Main  from './layouts/Main';
import  Dashboard  from './components/Dashboard';
import Login from './components/Login';
import  Register  from './components/Register';
import PrivateRoutes from './layouts/PrivateRoutes';
import PublicRoutes from './layouts/PublicRoutes';
import Layout from './layouts/Layout';
import 'react-toastify/dist/ReactToastify.css';
import UserList from './components/user/UserList';
import UserAdd from './components/user/UserAdd';
import UserUpdate from './components/user/UserUpdate';
import PageNotFound from './components/PageNotFound';
import Profile from './components/Profile';
import RegionList from './components/region/RegionList';
import RegionAdd from './components/region/RegionAdd';
import RegionUpdate from './components/region/RegionUpdate';
import SensorList from './components/sensor/SensorList';
import SensorAdd from './components/sensor/SensorAdd';
import SensorUpdate from './components/sensor/SensorUpdate';
import ReadingList from './components/reading/ReadingList';
import ReadingAdd from './components/reading/ReadingAdd';
import ReadingUpdate from './components/reading/ReadingUpdate';
import NotifyList from './components/notify/NotifyList';
import NotifyAdd from './components/notify/NotifyAdd';
import MyNotify from './components/notify/MyNotify';

function App() {
  return (
    <Routes>
        <Route element={<Layout/>}>
            <Route element={<Main/>}> 
                <Route element={<PrivateRoutes/>}>
                    <Route path='/' element={<Dashboard/>}/>
                    <Route path='/users' element={<UserList />} />
                    <Route path='/user/add' element={<UserAdd/>}/>
                    <Route path='/user/edit/:id' element={<UserUpdate/>}/>
                    <Route path='/profile' element={<Profile/>}/>
                    <Route path='/regions' element={<RegionList/>}/>
                    <Route path='/region/add' element={<RegionAdd/>}/>
                    <Route path='/region/edit/:id' element={<RegionUpdate/>}/>
                    <Route path='/sensors' element={<SensorList/>}/>
                    <Route path='/sensor/add' element={<SensorAdd/>}/>
                    <Route path='/sensor/edit/:id' element={<SensorUpdate/>}/>
                    <Route path='/readings' element={<ReadingList/>}/>
                    <Route path='/reading/add' element={<ReadingAdd/>}/>
                    <Route path='/reading/edit/:id' element={<ReadingUpdate/>}/>
                    <Route path='/notifies' element={<NotifyList/>}/>
                    <Route path='/notify/add' element={<NotifyAdd/>}/>
                    <Route path='user/notify' element={<MyNotify/>}/>

                </Route>
            </Route>
            <Route element={<PublicRoutes/>}>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
            </Route>
        </Route>
        <Route path='*' element={<PageNotFound/>}/>
    </Routes>
  );
}

export default App;
