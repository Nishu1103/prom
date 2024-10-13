import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./Chat.css";
const Chat = () => {
    const { user } = useContext(UserContext);
    // const token = user ? user.token : null;
    const navigate = useNavigate(); // Initialize useNavigate

    const [matches, setMatches] = useState([]);
    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null; // Check if userData exists
    const token = parsedUser ? parsedUser.token : null; // Check if parsedUser is not null
    
    console.log('token:', token); // Log the token
    useEffect(() => {
        // Fetch matched users when component mounts and user token is available
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
        // Navigate to the ChatRoom component with the selected user's ID
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
                                <img src={match.profile_image} alt={match.name} className="profile-image" />
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
