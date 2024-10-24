// import { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { UserContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';  
// import createToast from '../utils/toast';
// import "./Chat.css";
// const Chat = () => {
//     const { user } = useContext(UserContext);
//     // const token = user ? user.token : null;
//     const navigate = useNavigate();  

//     const [matches, setMatches] = useState([]);
//     const userData = localStorage.getItem('user');
//     const [likes, setLikes] = useState([]); 
//     const parsedUser = userData ? JSON.parse(userData) : null; 
//     const token = parsedUser ? parsedUser.token : null;  
//     console.log(matches.profile_image)
//     console.log(matches)
//     console.log('token:', token);  
//     useEffect(() => {
         
//         const fetchMatches = async () => {
//             if (token) {
//                 try {
//                     const response = await axios.get('https://lol-2eal.onrender.com/matches', {
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     });
//                     if (response.data && response.data.matches) {
//                         setMatches(response.data.matches);
//                     } else {
//                         console.error("No matches found in the response");
                        
//                     }
//                 } catch (error) {
//                     console.error("Error fetching matches:", error);
//                 }
//             }
//         };

//         fetchMatches();
//     }, [token]);

//     const startChat = (user) => {
 
//         navigate(`/chatroom/${user.id}`);
//     };

//     return (
//         <div className="chat-container">
//             <div className="matches-list">
//                 <h3>Your Matches</h3>
//                 {matches.length > 0 ? (
//                     <ul>
//                         {matches.map((match) => (
//                             <li key={match.id} onClick={() => startChat(match)}>
//                                 <img src={`https://gateway.pinata.cloud/ipfs/${match.profile_image}`} alt={match.name} className="profile-image" />
//                                 <span>{match.name}</span>
//                             </li>
//                         ))}

//                     </ul>
//                 ) : (
//                     <p>No matches available.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Chat;
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';  
import createToast from '../utils/toast';
import "./Chat.css";

const Chat = () => {
    const { user , isAuthorized, setIsAuthorized} = useContext(UserContext);
    const navigate = useNavigate();  

    const [matches, setMatches] = useState([]);
    const [likes, setLikes] = useState([]);  
    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null; 
    const token = parsedUser ? parsedUser.token : null;  
    const ids = localStorage.getItem('ids');
    const storedData = JSON.parse(ids);
    const userId = storedData.data.id;

    useEffect(()=>{

        if(!isAuthorized || !localStorage.getItem('user')) {
        
          navigate('/');
        }
      
      
      })
   
    useEffect(() => {
        const fetchMatchesAndLikes = async () => {
            if (token) {
                try {
                    // Fetch matches
                    const matchesResponse = await axios.get('https://lol-2eal.onrender.com/matches', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (matchesResponse.data && matchesResponse.data.matches) {
                        setMatches(matchesResponse.data.matches);
                    } else {
                        console.error("No matches found in the response");
                    }

                    // Fetch users who liked you
                    const likesResponse = await axios.get(`https://lol-2eal.onrender.com/likes/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (likesResponse.data) {
                        setLikes(likesResponse.data);
                    } else {
                        console.error("No likes found in the response");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchMatchesAndLikes();
    }, [token]);

    const startChat = (match) => {
        navigate(`/chatroom/${match.id}`, { state: { name: match.name } });
    };
    

    return (
        <div className="chat-container">
            
            <div className="likes-list">
                <h3>Who Liked You</h3>
                {likes.length > 0 ? (
                    <div className="horizontal-scroll">
                        {likes.map((like) => (
                            <div className="like-item" key={like.id}>
                                <img
                                    src={`https://gateway.pinata.cloud/ipfs/${like.profile_image}`}
                                    alt={like.name}
                                    className="blurred-profile-image"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No likes yet.</p>
                )}
            </div>
    
           
            <div className="matches-list">
                <h3>Your Matches</h3>
                {matches.length > 0 ? (
                    <ul>
                        {matches.map((match) => (
                            <li key={match.id} onClick={() => startChat(match)}>
                                <img
                                    src={`https://gateway.pinata.cloud/ipfs/${match.profile_image}`}
                                    alt={match.name}
                                    className="profile-image"
                                />
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
}    
export default Chat;
