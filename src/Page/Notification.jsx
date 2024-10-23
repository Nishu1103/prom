import  { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Modal from 'react-modal';  
import "./Notification.css";
import { useNavigate } from 'react-router-dom';
const Notification = () => {
    const { user , isAuthorized } = useContext(UserContext);
    const navigate = useNavigate();
    const [promRequests, setPromRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    // const token = user.token; // Assuming token is available in user context
    // const userId = user.id; // Assuming user context has the current user's ID
    const userData = localStorage.getItem('user');
    const parsedUser = JSON.parse(userData); // Parse the user data
    const token = parsedUser.token; // Get token
    const ids = localStorage.getItem('ids');
    // console.log(typeof ids, ids);  // Check if it's a string and properly formatted
    // console.log(localStorage.getItem('ids'), "ddddDDDD")
    const storedData = JSON.parse(ids);
    // console.log(storedData, "Parsed Data");
    console.log(token)

    useEffect(()=>{

        if(!isAuthorized || !localStorage.getItem('user')) {
        
          navigate('/');
        }
      
      
      })
   
    const userId = storedData.data.id;
    useEffect(() => {
        const fetchPromRequests = async () => {
            try {
                const response = await axios.get(`https://lol-2eal.onrender.com/promnight/check/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setPromRequests(response.data.promRequests);  
            } catch (error) {
                console.error("Error fetching prom requests:", error);
            }
        };

        fetchPromRequests();
        const interval = setInterval(fetchPromRequests, 10000); 
        return () => clearInterval(interval);
    }, [userId, token]);

    const openModal = (request) => {
        setSelectedRequest(request); 
        setIsModalOpen(true); 
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);  
    };

    const acceptRequest = async () => {
        if (selectedRequest) {
            try {
                const response = await axios.post('https://lol-2eal.onrender.com/acceptPromNight', {
                    requestId: selectedRequest.id,  
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(response.data.message);

                if (response.data.success) {
                    alert('Prom night request accepted!');
                    setPromRequests((prevRequests) => prevRequests.filter(req => req.id !== selectedRequest.id));
                }
            } catch (error) {
                console.error("Error accepting prom night request:", error);
            } finally {
                closeModal();  
            }
        }
    };

    const cancelRequest = async () => {
        if (selectedRequest) {
            try {
                const response = await axios.post('https://lol-2eal.onrender.com/cancelPromNight', {
                    requestId: selectedRequest.id, // Use the request ID to cancel
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(response.data.message);
                if (response.data.success) {
                    alert('Prom night request cancelled!');
                    setPromRequests((prevRequests) => prevRequests.filter(req => req.id !== selectedRequest.id));
                }
            } catch (error) {
                console.error("Error cancelling prom night request:", error);
            } finally {
                closeModal();  
            }
        }
    };

    return (
        <div className="notification">
            <h3>Notifications</h3>
            {promRequests.length === 0 ? (
                <p>No prom night requests at the moment.</p>
            ) : (
                <ul>
                    {promRequests.map((request) => (
                        <li key={request.id}>
                            <span>
                                You have received a prom night request from User {request.requester_id} at {new Date(request.created_at).toLocaleString()}.
                            </span>
                            <button onClick={() => openModal(request)}>Accept</button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal for accepting or cancelling prom night request */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <h2>What would you like to do?</h2>
                <p>User {selectedRequest?.requester_id} has sent you a prom night request.</p>
                <button onClick={acceptRequest}>Yes, Accept</button>
                <button onClick={cancelRequest}>No, Cancel</button>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default Notification;