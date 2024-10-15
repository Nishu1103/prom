// // import { createContext, useState, useEffect } from 'react';
// // import axios from 'axios';
// // import PropTypes from 'prop-types';

// // export const UserContext = createContext();

// // export const UserProvider = ({ children }) => {
// //     const [user, setUser] = useState(null);
// //     const [users, setUsers] = useState([]);
// //     const [matches, setMatches] = useState([]);
// //     const [loading, setLoading] = useState(true); // Loading state
// //     const [error, setError] = useState(null); // Error state
// //     const [isAuthorized, setIsAuthorized]=useState(false);
// // // console.log(user.token,"user");
// //     useEffect(() => {
// //         const fetchUsers = async () => {
// //             setLoading(true); // Set loading to true before fetching
// //             try {
// //                 const response = await axios.get('http://localhost:3000/getUsers');
// //                 // Check if the response contains the expected data structure
// //                 if (response.data && Array.isArray(response.data.data)) {
// //                     setUsers(response.data.data); // Update users from the data property
// //                 } else {
// //                     console.error('Fetched data is not an array', response.data);
// //                     setError('Fetched data is not in the expected format.');
// //                 }
// //             } catch (error) {
// //                 console.error('Error fetching users', error);
// //                 setError('Error fetching users. Please try again later.');
// //             } finally {
// //                 setLoading(false); // Set loading to false after fetching
// //             }
// //         };

// //         fetchUsers();
// //     }, []);

    

// //     const likeUser = async (likedUserId) => {
// //         if (!user || !user.token) {
// //             setError('User is not authenticated.');
// //             return;
// //         }
    
// //         try {
// //             // Add token to headers for authentication
// //             const response = await axios.post(
// //                 'http://localhost:3000/like',
// //                 { likedUserId }, // Correct property name for backend
// //                 {
// //                     headers: {
// //                         Authorization: `Bearer ${user.token}`, // Send token in Authorization header
// //                     },
// //                 }
// //             );
            
// //             // Handle response based on backend logic
// //             if (response.data === "It's a match!") {
// //                 alert('It\'s a match!');
// //                 // Add more logic here to handle a match
// //             } else {
// //                 alert('User liked successfully!');
// //             }
    
// //             setMatches((prevMatches) => [...prevMatches, likedUserId]);
// //         } catch (error) {
// //             console.error('Error liking user', error);
// //             setError('Error liking user. Please try again later.');
// //         }
// //     };
    

// //     return (
// //         <UserContext.Provider value={{ user,users, matches, setUser,likeUser, loading, error  ,isAuthorized, setIsAuthorized}}>
// //             {children}
// //         </UserContext.Provider>
// //     );
// // };

// // UserProvider.propTypes = {
// //     children: PropTypes.node.isRequired,
// // };
// import { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import PropTypes from 'prop-types';
// // import { useNavigate } from 'react-router-dom';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [users, setUsers] = useState([]);
//     const [matches, setMatches] = useState([]);
//     const [loading, setLoading] = useState(true); // Loading state
//     const [error, setError] = useState(null); // Error state
//     const [isAuthorized, setIsAuthorized] = useState(false);
//     const userData = localStorage.getItem('user');
//     const parsedUser = userData ? JSON.parse(userData) : null; // Check if userData exists
//     const token = parsedUser ? parsedUser.token : null; // Check if parsedUser is not null
    
//     console.log('token:', token); // Log the token

//     // if(isAuthorized){
//     //     nevigate("./home");

//     // }

//     useEffect(() => {
//         const fetchUsers = async () => {
//             setLoading(true); // Set loading to true before fetching
//             try {
//                 const response = await axios.get('http://localhost:3000/getUsers');
//                 if (response.data && Array.isArray(response.data.data)) {
//                     setUsers(response.data.data); // Update users from the data property
//                 } else {
//                     console.error('Fetched data is not an array', response.data);
//                     setError('Fetched data is not in the expected format.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching users', error);
//                 setError('Error fetching users. Please try again later.');
//             } finally {
//                 setLoading(false); // Set loading to false after fetching
//             }
//         };

//         fetchUsers();
//     }, []);

//     // const likeUser = async (likedUserId) => {
//     //     if (!user || !user.token) {
//     //         setError('User is not authenticated.');
//     //         return;
//     //     }

//     //     try {
//     //         const response = await axios.post(
//     //             'http://localhost:3000/like',
//     //             { likedUserId },
//     //             {
//     //                 headers: {
//     //                     Authorization: `Bearer ${token}`,
//     //                 },
//     //             }
//     //         );

//     //         if (response.data === "It's a match!") {
//     //             alert('It\'s a match!');
//     //         } else {
//     //             alert('User liked successfully!');
//     //         }

//     //         setMatches((prevMatches) => [...prevMatches, likedUserId]);
//     //     } catch (error) {
//     //         console.error('Error liking user', error);
//     //         setError('Error liking user. Please try again later.');
//     //     }
//     // };

//     return (
//         <UserContext.Provider value={{ user, users, matches, setUser , loading, error, isAuthorized, setIsAuthorized }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// UserProvider.propTypes = {
//     children: PropTypes.node.isRequired,
// };
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [isAuthorized, setIsAuthorized] = useState(false);

    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null;
    const token = parsedUser ? parsedUser.token : null;
    console.log(token)
    useEffect(() => {
        const fetchUsers = async () => {

            if (!token) {
                console.error('No token available for authentication');
                setError('No token available for authentication');
                setLoading(false);
                return;
            }
            setLoading(true); // Set loading to true before fetching
            try {
                // Send request with token authorization header
                const response = await axios.get('http://localhost:3000/getUsers', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data && Array.isArray(response.data.data)) {
                    setUsers(response.data.data); 
                    console.log(response.data.data)// Update users from the data property
                } else {
                    console.error('Fetched data is not an array', response.data);
                    setError('Fetched data is not in the expected format.');
                }
            } catch (error) {
                console.error('Error fetching users', error);
                setError('Error fetching users. Please try again later.');
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUsers();
    }, [token]);

    return (
        <UserContext.Provider value={{ user, users, matches, setUser, loading, error, isAuthorized, setIsAuthorized }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
