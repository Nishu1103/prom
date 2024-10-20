// import { useEffect, useState, useContext, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { UserContext } from '../context/UserContext';
// import "./ChatRoom.css";
// const ChatRoom = () => {
//     const { id } = useParams(); // Get the user ID from URL
//     console.log(id,"reciver id")
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState('');
//     const [loading, setLoading] = useState(true);
//     const { user } = useContext(UserContext);

//     console.log(user);
//     // Use useRef to store socket instance
//     const socket = useRef(null);
//     const userData = localStorage.getItem('user');
//     console.log(userData)
//     const parsedUser = JSON.parse(userData);
//     console.log(parsedUser)// Parse the user data
//     const token = parsedUser.token;
//     console.log(token)
//     const ids = localStorage.getItem('ids');
//     console.log(typeof ids, ids);  // Check if it's a string and properly formatted
//     console.log(localStorage.getItem('ids'), "ddddDDDD")
//     const storedData = JSON.parse(ids);
//     console.log(storedData, "Parsed Data");
//     const userId = storedData.data.id;
//     console.log(userId, "sender id");

//     useEffect(() => {
//         // Initialize socket connection only once
//         socket.current = io('http://localhost:3001');

//         // Register the user to the socket room
//         console.log(`Registering user with ID: ${userId}`);
//         socket.current.emit('registerUser', userId);
//         socket.current.emit('registerUser', id); 
//         // console.log(`User ${user.id} registered to socket`);
//         socket.current.on('connect', () => {
//             console.log('Socket connected:', socket.current.id);
//         });
//         socket.current.on('receiveMessage', (data) => {
//             console.log('Received message:', data);
//             setMessages((prevMessages) => [...prevMessages, data]);
//         });

//         // Cleanup on component unmount
//         return () => {
//             socket.current.off('receiveMessage');
//             socket.current.disconnect();
//         };
//     }),[userId,id]; // Run only when id changes

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3000/messages/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     }
//                 });
//                 setMessages(response.data.messages);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching messages:", error);
//             }
//         };

//         fetchMessages();
//     }, [id, token]); // Run when id or token changes

//     const sendMessage = async () => {
//         try {
//             await axios.post('http://localhost:3000/send-message', {
//                 receiverId: id,
//                 message: message
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             // Emit the message to the receiver via socket
//             socket.current.emit('sendMessage', {
//                 receiverId: id,
//                 message: message,
//                 senderId: userId
//             });

//             setMessages((prevMessages) => [
//                 ...prevMessages,
//                 { senderId: userId, message }
//             ]);
//             setMessage('');
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };

//     return (
//         <div className="chat-room">
//             <h3>Chat with User {id}</h3>
//             {loading ? (
//                 <p>Loading messages...</p>
//             ) : (
//                 <div className="messages">
//                     {messages.map((msg, index) => (
//                         <div key={index} className={`message ${msg.senderId === id ? 'incoming' : 'outgoing'}`}>
//                             {msg.message}
//                         </div>
//                     ))}
//                 </div>
//             )}
//             <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a message..."
//             />
//             <button onClick={sendMessage}>Send</button>
//         </div>
//     );
// };

// export default ChatRoom;
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
    const socket = useRef(null);
    const messagesEndRef = useRef(null);
    const hasShownNotification = useRef(false);
    const hasShownNotificationrequest=useRef(false);
    const [promRequest, setPromRequest] = useState(null);
    const userData = localStorage.getItem('user');
    const parsedUser = JSON.parse(userData);  
    const token = parsedUser.token;  
    const ids = localStorage.getItem('ids');
    // console.log(typeof ids, ids);   
    console.log(localStorage.getItem('ids'), "ddddDDDD")
    const storedData = JSON.parse(ids);
    // console.log(storedData, "Parsed Data");
    const userId = storedData.data.id;
    const userName = storedData.data.name;
    const navigate = useNavigate();
    console.log(userName)
    console.log(userId, "sender id");

    if(!ids || !localStorage.getItem('user')) {

        navigate('/');
    
    
      }

    useEffect(() => {
        
        socket.current = io('http://localhost:3001');

        
        socket.current.emit('registerUser', userId);

        
        socket.current.on('receiveMessage', (data) => {
            if (data.senderId === id || data.receiverId === id) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        });

        return () => {
            socket.current.off('receiveMessage');
            socket.current.disconnect();
        };
    }, [userId, id]);

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
                console.log(response.data.messages)
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
                    senderId: userId,  
                    message: message
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

              
                socket.current.emit('sendMessage', {
                    receiverId: id,
                    message: message,
                    senderId: userId
                });

               
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { senderId: userId, message }
                ]);
                setMessage('');
            } catch (error) {
                console.error("Error sending message:", error);
                createToast("Error sending message:","error")
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
                createToast("Prom night request sent!","success")
                setPromRequest({ senderId: userId, receiverId: id });
            }
        } catch (error) {
            console.error("Error sending prom night request:", error);
            createToast("Error sending prom night request:","error")
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
            const response = await axios.post('http://localhost:3000/acceptPromNight', {
                requestId: promRequest._id 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // alert('Prom night request accepted!');
                createToast("Prom night request accepted!","success")
                setPromRequest(null);   
            }
        } catch (error) {
            console.error("Error accepting prom night request:", error);
            createToast("Error accepting prom night request:","error")
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
                createToast("Prom night request canceled!","success");
                setPromRequest(null);  
            }
        } catch (error) {
            console.error("Error canceling prom night request:", error);
            createToast("Error canceling prom night request:","error")
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setPromRequest(null);  
    };
    return (
        <div className="chat-room">
            <h3 style={{position:"fixed",
            top:"80px",
            left:0,
            right:0,
            // color:"black",
            textAlign:"center",
            padding:"10px",
            color:"#7E60BF",
            }}>Chat with {userName}</h3>
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
            <div className="hello" style={{display:"flex"

            }}>

            <input className='input-chat'
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button className='chatbutton' onClick={sendMessage}>Send</button>
            </div>
            <button style={{
                position:"absolute",
                top:"50%",
                left:"-60px",
                transform:"translateY(-50%)rotate(90deg)",
                // backgroundColor:"#4CAF50",
                color:"#fff",
                backgroundColor:"#7E60BF",
                border:"none",
                padding:"10px 20px",
                cursor:"pointer",

            }} onClick={requestPromNight}>Request Prom Night</button>
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