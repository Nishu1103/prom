
import { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { UserContext } from '../context/UserContext';
import "./ChatRoom.css";
import Modal from 'react-modal';
import { useCallback } from 'react';
import createToast from '../utils/toast';
import { useNavigate } from 'react-router-dom';
const ChatRoom = () => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const socket = useRef(null);
    const messagesEndRef = useRef(null);
    const hasShownNotification = useRef(false);
    const hasShownNotificationrequest = useRef(false);
    const [promRequest, setPromRequest] = useState(null);
    const userData = localStorage.getItem('user');
    const parsedUser = JSON.parse(userData);
    const token = parsedUser.token;
    const ids = localStorage.getItem('ids');
    // console.log(typeof ids, ids);   
    // console.log(localStorage.getItem('ids'), "ddddDDDD")
    const storedData = JSON.parse(ids);
    // console.log(storedData, "Parsed Data");
    const userId = storedData.data.id;
    const userName = storedData.data.name;
    const navigate = useNavigate();
    // console.log(userName)
    // console.log(userId, "sender id");

    const socket = useRef(null);
    
    useEffect(() => {
        
        socket.current = io.connect('http://localhost:3000');
        // socket.current = io('http://localhost:3000', { transports: ['websocket'] });

        socket.current.on('connect', () => {
            console.log('Socket connected:', socket.current.id);
            socket.current.emit('registerUser', userId);  
            console.log('User registered with userId:', userId);
        });

        // socket.emit('registerUser', userId); 

        // Set up message listener
        socket.current.on('receiveMessage', (data) => {
            console.log('Message received:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
            if (data.senderId !== userId) {
                console.log('Message from another user:', data);
            }
        });

        // Clean up the connection when component unmounts
        return () => {
            socket.current.disconnect();
        };
    }, [ userId ] );



    if (!ids || !localStorage.getItem('user')) {

        navigate('/');


    }


    useEffect(() => {
        // Fetch chat messages between sender and receiver
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/messages/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        senderId: userId,
                        receiverId: id,
                    }
                });
                setMessages(response.data.messages);
                // console.log(response.data.messages)
                setLoading(false);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

    }, [id, token, userId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async () => {

        if (message.trim()) {
            try {
                await axios.post('http://localhost:3000/send-message', {
                    receiverId: id,
                    sender_id: userId,
                    message
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });


                socket.current.emit('sendMessage', {
                    receiverId: id,
                    message,
                    sender_id: userId
                });


                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender_id: userId, message }
                ]);
                setMessage('');
            } catch (error) {
                console.error("Error sending message:", error);
                createToast("Error sending message:", "error")
            }
        }
    };

    const requestPromNight = async () => {
        try {
            const response = await axios.post('http://localhost:3000/requestPromNight', {
                senderId: userId,
                receiverId: id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // alert('Prom night request sent!');
                createToast("Prom night request sent!", "success")
                setPromRequest({ senderId: userId, receiverId: id });
            }
        } catch (error) {
            if (error.response) {
                // Handle specific status codes
                const status = error.response.status;
                if (status === 409) {
                  createToast('You are already matched with someone.', 'error');
                } else if (status === 408) {
                  createToast('The requested user is already matched with someone.', 'error');
                } else if (status === 404) {
                  createToast('Requested user does not exist.', 'error');
                } else if (status === 411) {
                  createToast('Request already sent.', 'error');
                } else {
                  createToast('Error sending prom night request. Please try again.', 'error');
                }
              } else {
                // Generic error handling
                createToast('Error sending prom night request. Please try again.', 'error');
              }
              console.log(error);
            }
          };

    const checkPromRequest = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:3000/promnight/check/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.promRequest) {
                setPromRequest(response.data.promRequest);
                console.log(response.data.promRequest);
            }
            const newRequests = response.data.promRequests;

            if (newRequests.length > 0) {
                // If a new request is received, set it to state
                setPromRequest(newRequests[0]);
                setIsModalOpen(true);
                hasShownNotificationrequest.current = true;
            }
        } catch (error) {
            console.error("Error checking prom night request:", error);
        }
    }, [userId, token]);

    useEffect(() => {
        const interval = setInterval(() => {
            checkPromRequest();
            console.log("hello");
        }, 900000);

        return () => clearInterval(interval);
    }, [checkPromRequest]);
    const acceptPromNight = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3000/acceptPromNight',
                {
                    requestId: promRequest._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data.success) {
                // Success case
                createToast('Prom night request accepted!', 'success');
                setPromRequest(null);
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                // Handle specific status codes
                if (status === 409) {
                    createToast('You are already matched with someone.', 'error');
                } else if (status === 408) {
                    createToast('Requester is already matched with someone.', 'error');
                } else if (status === 404) {
                    createToast('No pending request found.', 'error');
                } else {
                    createToast('Error accepting prom night request. Please try again.', 'error');
                }
            } else {
                // Generic error handling
                createToast('Error accepting prom night request. Please try again.', 'error');
            }
            console.error('Error accepting prom night request:', error);
        }
    };
    

    const cancelPromNight = async () => {
        try {
            const response = await axios.post('http://localhost:3000/cancelPromNight', {
                requestId: promRequest._id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // alert('Prom night request canceled!');
                createToast("Prom night request canceled!", "success");
                setPromRequest(null);
            }
        } catch (error) {
            console.error("Error canceling prom night request:", error);
            createToast("Error canceling prom night request:", "error")
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setPromRequest(null);
    };
    return (
        <div className="chat-room">

            <div className="hlo" style={{display:"flex",
                //  position: "fixed",
                 top: "80px",
                 flexDirection:"row",
                 // color:"black",
                 backgroundColor:"#F5EFFF",
                 textAlign: "center",
                 alignItems:"center",
                 padding: "10px",
                 color: "#7E60BF",
                 justifyContent:"space-between",
                 borderRadius: "20px 20px 20px 20px"
            }}>
                <h3 style={{
                   
                }}>Chat with {id}</h3>

                <button style={{
                     
                }} onClick={requestPromNight}>Request Prom Night</button>


            </div>
            {loading ? (
                <p>Loading messages...</p>
            ) : (
                <div className="messages">
                    {messages.map((msg, index) => (
                        
                        <div key={index} className={`message ${msg.sender_id === userId ? 'outgoing' : 'incoming'}`}>
                            {msg.message}
                        </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>
            )}
            <div className="hello" style={{
                display: "flex"

            }}>

                <input className='input-chat'
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button className='chatbutton' onClick={sendMessage}>Send</button>
            </div>
             
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <h2>New Prom Night Request!</h2>
                <p>User {promRequest?.requester_id} has sent you a request.</p>
                <button onClick={closeModal}>Close</button>
            </Modal>

            {promRequest && (
                <div className="prom-request">
                    <h4>Prom Night Request Received!</h4>
                    <button onClick={acceptPromNight}>Accept</button>
                    <button onClick={cancelPromNight}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default ChatRoom;