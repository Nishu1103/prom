import { useState, useContext } from 'react';
import { useSwipeable } from 'react-swipeable';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './Swipe.css';
import { FcLike } from "react-icons/fc";
import { ImCross } from "react-icons/im";
import { GiReturnArrow } from "react-icons/gi";

const Swipe = () => {
    const { users, setMatches } = useContext(UserContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animation, setAnimation] = useState(''); // New state to handle animation
    const { user } = useContext(UserContext);
    const [error, setError] = useState(null);
    const [swipeText, setSwipeText] = useState('');
    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null;
    const token = parsedUser ? parsedUser.token : null;
    console.log(token)


    const likeUser = async (likedUserId) => {
        if (!user || !token) {
            setError('User is not authenticated.');
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:3000/like',
                { likedUserId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data === "It's a match!") {
                alert('It\'s a match!');
            } else {
                alert('User liked successfully!');
            }
            setMatches((prevMatches) => [...prevMatches, likedUserId]);
        } catch (error) {
            console.error('Error liking user', error);
            setError('Error liking user. Please try again later.');
        }
    };

    const dislikeUser = async (dislikedUserId) => {
        if (!user || !token) {
            setError('User is not authenticated.');
            return;
        }
        try {
            await axios.post(
                'http://localhost:3000/dislike',
                { dislikedUserId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('User disliked successfully!');
        } catch (error) {
            console.error('Error disliking user', error);
            setError('Error disliking user. Please try again later.');
        }
    };

    const handleLike = (userId) => {
       
        setAnimation('swipe-right'); // Trigger right swipe animation
        setSwipeText('Like!');
        setTimeout(() => {
            likeUser(userId);
            nextUser();
            setAnimation(''); // Reset animation after transition
            setSwipeText('');
        }, 500); // Match the animation duration
    };

    const handleDislike = () => {
        setAnimation('swipe-left'); // Trigger left swipe animation
        setSwipeText('Nope');
        setTimeout(() => {
            dislikeUser(users[currentIndex].id);
            nextUser();
            setAnimation(''); 
            setSwipeText('');
        }, 500); // Match the animation duration
    };

    const nextUser = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleDislike,
        onSwipedRight: () => handleLike(users[currentIndex].id),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    if (users.length === 0) {
        return <div>No users available</div>;
    }

    const currentUser = users[currentIndex];
    console.log(currentUser)

    return (
        <div className={`swipe-container ${animation}`} {...handlers}>
            <div className={`card ${animation}`}>
            <img src={`https://gateway.pinata.cloud/ipfs/${currentUser.profile_image}`} alt={currentUser.name} className="user-image" />

                <div className="user-info">
                    <h3>{currentUser.name}</h3>
                    <p>{currentUser.bio}</p>
                </div>
                <div className="action-buttons">
                    <ImCross onClick={handleDislike} className="dislike-button"/>
                    <FcLike onClick={() => handleLike(currentUser.id)} className="like-button"/> 
                    <GiReturnArrow onClick={() => handleLike(currentUser.id)} className="reverse-button"/>
                </div>
            </div>
            {swipeText && <div className={`swipe-text ${animation}`}>{swipeText}</div>}
        </div>
    );
};

export default Swipe;
