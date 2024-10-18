import React, { useEffect, useState } from 'react'
import DataTable from '../common/DataTable'
import requestApi from '../../helpers/api'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {formatDateTime} from '../../helpers/common'
import { toast } from 'react-toastify'
const NotifyList = () => {
    const dispatch = useDispatch()

    const [sensors, setSensors] = useState([])
    const [numOfPage, setNumOfPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [searchString, setSearchString] = useState('')
    const [selectedRows, setSelectedRows] = useState([])
    const [deleteItem, setDeleteItem] = useState(null)
    const [deleteType, setDeleteType] = useState('single')
    const [showModal, setShowModal] = useState(false)
    const [refresh, setRefresh] = useState(Date.now())

    const columns = [
        {
            name: "ID",
            element: row => row.id
        },
        {
            name: "Message",
            element: row => {
                return row.message
            }
        },
        {
            name: "Water Level",
            element: row => row.reading?.water_level
        },
        {
            name: "User Read",
            element: row => row.isReading === true ? 'true' :'false'
        },
        {
            name: "User Name",
            element: row => {
                return `${row.user?.firstName } ${row.user?.lastName }`
            }
        },
        {
            name: "User Email",
            element: row => row.user?.email
        },
        {
            name: "Created at",
            element: row => formatDateTime(row.created_at)
        },
        {
            name: "Actions",
            element: row => (
                <>
                    <button type="button" className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(row.id)}><i className="fa fa-trash"></i> </button>
                </>
            )
        }
    ]

    const handleDelete = (id) => {
        console.log("single delete with id => ", id)
        setShowModal(true)
        setDeleteItem(id)
        setDeleteType('single')
    }

    const handleMultiDelete = () => {
        console.log("multi delete => ", selectedRows)
        setShowModal(true)
        setDeleteType('multi')
    }

    const requestDeleteApi = () => {
        if (deleteType === 'single') {
            dispatch(actions.controlLoading(true))
            requestApi(`/notify/${deleteItem}`, 'DELETE', []).then(response => {
                setShowModal(false)
                setRefresh(Date.now())
                dispatch(actions.controlLoading(false))
                toast.success(`Notify ${deleteItem} has been deleted successfully`, {position: "top-center", autoClose: 2000})
            }).catch(err => {
                console.log(err)
                setShowModal(false)
                dispatch(actions.controlLoading(false))
                toast.error( err, {position: "top-center", autoClose: 2000})
            })
        } 
        else {
            dispatch(actions.controlLoading(true))
            console.log("ĐÃ vào xóa ", selectedRows.toString())
            requestApi(`/notify/multiple?ids=${selectedRows.toString()}`, 'DELETE', []).then(response => {
                setShowModal(false)
                setRefresh(Date.now())
                toast.success(`All Notify selected: ${selectedRows.toString()} has been deleted successfully`, {position: "top-center", autoClose: 2000})
                setSelectedRows([])
                dispatch(actions.controlLoading(false))
                
            }).catch(err => {
                console.log(err)
                setShowModal(false)
                dispatch(actions.controlLoading(false))
                toast.error( err, {position: "top-center", autoClose: 2000})
            })
        }
    }

    useEffect(() => {
        dispatch(actions.controlLoading(true))
        let query = `?limit=${itemsPerPage}&page=${currentPage}&search=${searchString}`
        console.log(query)
        requestApi(`/notify${query}`, 'GET', []).then(response => {
            console.log("Notify Get All=> ", response)
            setSensors(response.data.data)
            setNumOfPage(response.data.lastPage)
            dispatch(actions.controlLoading(false))
        }).catch(err => {
            console.log(err)
            dispatch(actions.controlLoading(false))
        })
    }, [currentPage, itemsPerPage, searchString, refresh])

    return (
        <div id="layoutSidenav_content">
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Tables Notify</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to='/'>Dashboard</Link></li>
                        <li className="breadcrumb-item active">Tables</li>
                    </ol>
                    <div className='mb-3'>
                        <Link className='btn btn-sm btn-success me-2' to='/notify/add'><i className="fa fa-plus"></i> Add new</Link>
                        {selectedRows.length > 0 && <button type='button' className='btn btn-sm btn-danger' onClick={handleMultiDelete}><i className="fa fa-trash"></i> Delete</button>}
                    </div>
                    <DataTable
                        name="List Notifies"
                        data={sensors}
                        columns={columns}
                        numOfPage={numOfPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onChangeItemsPerPage={setItemsPerPage}
                        onKeySearch={(keyword) => {
                            console.log("keyword in user list comp=> ", keyword)
                            setSearchString(keyword)
                        }}
                        onSelectedRows={rows => {
                            console.log("selected rows in uselist=> ", rows)
                            setSelectedRows(rows)
                        }}
                    />
                </div>
            </main>
            <Modal show={showModal} onHide={() => setShowModal(false)} size='sm'>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure want to delete?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowModal(false)}>Close</Button>
                    <Button className='btn-danger' onClick={requestDeleteApi}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default NotifyList