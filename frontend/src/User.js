import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import CreateUser from './CreateUser';

function User() {
    
    const [user, setUser] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const fetchData = () => {
        axios.get(`http://localhost:8099/?page=${currentPage}`)
          .then((res) => {
            setUser(res.data.data);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
            setTotalItems(res.data.totalItems);
          })
          .catch((err) => console.log(err));
    };

    useEffect(()=>{
        axios.get(`http://localhost:8099/?page=${currentPage}`)
        .then(res => {
            const { data, totalPages, currentPage, totalItems } = res.data;
            setUser(data);
            setTotalPages(totalPages);
            setCurrentPage(currentPage);
            setTotalItems(totalItems);
          })
        .catch(err => console.log(err));
    }, [currentPage])
    
    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:8099/'+id)
            Swal.fire({
                title: "Do you want to delete this user?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Delete",
                confirmButtonColor: "#39ed39",
                denyButtonText: `Cancel`
            }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire("User deleted!", "", "success").then(() => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                  });
                }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Something was wrong, try again.'
            })
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
          setCurrentPage(newPage);
        }
    };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
        <div className='w-50 bg-white rounded p-3'>
            
            <button onClick={openModal} className='btn btn-success mb-3'>Add +</button>
            {showModal && <CreateUser onClose={closeModal} fetchData={fetchData} />}
            
            <div className="table-responsive">
                <table className="table table-secondary table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            user.map((data, i) =>(
                                <tr key={i}>
                                    <td>{data.name}</td>
                                    <td>{data.email}</td>
                                    <td>
                                        <Link to={`update/${data.id}`} className='btn btn-warning'>Edit</Link>
                                        <button className='btn btn-danger ms-2' onClick={e => handleDelete(data.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-center mt-3">
                <button
                    className='btn btn-secondary'
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(Number(currentPage) - 1)}>
                    Previous
                </button>
                <span className='mx-3'>Page {currentPage} of {totalPages} , Total records: {totalItems}</span>
                <button
                    className='btn btn-secondary'
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(Number(currentPage) + 1)}>
                    Next
                </button>
            </div>
            
        </div>
    </div>
  )
}

export default User