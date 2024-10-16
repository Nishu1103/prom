import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';  
import createToast from '../utils/toast';
import "./Chat.css";
const Chat = () => {
    const { user } = useContext(UserContext);
    // const token = user ? user.token : null;
    const navigate = useNavigate();  

    const [matches, setMatches] = useState([]);
    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null; 
    const token = parsedUser ? parsedUser.token : null;  
    console.log(matches.profile_image)
    console.log(matches)
    console.log('token:', token);  
    useEffect(() => {
         
        const fetchMatches = async () => {
            if (token) {
                try {
                    const response = await axios.get('http://localhost:3000/matches', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.data && response.data.matches) {
                        setMatches(response.data.matches);
                    } else {
                        console.error("No matches found in the response");
                        
                    }
                } catch (error) {
                    console.error("Error fetching matches:", error);
                }
            }
        };

        fetchMatches();
    }, [token]);

    const startChat = (user) => {
 
        navigate(`/chatroom/${user.id}`);
    };

    return (
        <div className="chat-container">
            <div className="matches-list">
                <h3>Your Matches</h3>
                {matches.length > 0 ? (
                    <ul>
                        {matches.map((match) => (
                            <li key={match.id} onClick={() => startChat(match)}>
                                <img src={`https://gateway.pinata.cloud/ipfs/${match.profile_image}`} alt={match.name} className="profile-image" />
                                <span>{match.name}</span>
                            </li>
                        ))}

                    </ul>
                ) : (
                    <p>No matches available.</p>
                )}
            </div>
        </div>
    );
};

export default Chat;
