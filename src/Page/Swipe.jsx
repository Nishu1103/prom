import { useState, useContext } from 'react';
import { useSwipeable } from 'react-swipeable';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './Swipe.css';

const Swipe = () => {
    const { users,setMatches } = useContext(UserContext); // assuming users are fetched and provided in UserContext
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext); // assuming UserContext contains user data and token

    const token = user?.token;

    // Function to handle liking a user
    const likeUser = async (likedUserId) => {
        if (!user || !user.token) {
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

    // Function to handle disliking a user
    const dislikeUser = async (dislikedUserId) => {
        if (!user || !user.token) {
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

    // Handle the user swipe actions
    const handleLike = (userId) => {
        likeUser(userId); // Call like API when user swipes right or clicks like button
        nextUser();
    };

    const handleDislike = () => {
        dislikeUser(users[currentIndex].id); // Call dislike API
        nextUser(); // Move to the next user
    };

    // Move to the next user
    const nextUser = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length); // Cycle through users
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleDislike, // Dislike on left swipe
        onSwipedRight: () => handleLike(users[currentIndex].id), // Like on right swipe
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    if (users.length === 0) {
        return <div>No users available</div>;
    }

    const currentUser = users[currentIndex];

    return (
        <div className="swipe-container" {...handlers}>
            <div className="card">
                <img src={currentUser.image} alt={currentUser.name} className="user-image" />
                <div className="user-info">
                    <h3>{currentUser.name}</h3>
                    <p>{currentUser.bio}</p>
                </div>
                <div className="action-buttons">
                    <button onClick={handleDislike} className="dislike-button">Dislike</button>
                    <button onClick={() => handleLike(currentUser.id)} className="like-button">Like</button>
                </div>
            </div>
        </div>
    );
};

export default Swipe;
