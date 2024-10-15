import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './Auth/SignUp';
import SignIn from './Auth/SignIn';
// import { UserProvider } from './context/UserContext';
import Home from './Page/Home';
import Chat from './Page/Chat';
import ChatRoom from './Page/ChatRoom';
import TopNavbar from './Page/TopNavbar';   
import BottomNavbar from './Page/BottomNavbar';
import Notification from './Page/Notification';
import { useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
function App() {
    // const nevigate=useNavigate();  
    const { setUsers, setUser, isAuthorized, setIsAuthorized } = useContext(UserContext);
    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null; // Check if userData exists
    const token = parsedUser ? parsedUser.token : null; // Check if parsedUser is not null

    // console.log('token:', token); // Log the token

    useEffect(() => {
        const checkUserAuthentication = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Assuming you store the token in localStorage
                    },
                });


                if (response.data) {
                    setUser(response.data); // Assuming the user data is returned in response.data.user
                    // setUsers(response.data)
                    // console.log(response.data, "kkk");
                    setIsAuthorized(true);
                    // console.log(isAuthorized)
                    // console.log(response.data)
                    localStorage.setItem('ids', JSON.stringify(response.data));
                    // console.log(localStorage.getItem('ids'), "ddddDDDD")
                    const storedData = JSON.parse(localStorage.getItem('ids'));
                    console.log(storedData, "Parsed Data");
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error('Error checking user authentication', error);
                setIsAuthorized(false);
            }
        };

        checkUserAuthentication();
    }, []);


    return (

        <Router>
            <TopNavbar/>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/home" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chatroom/:id" element={<ChatRoom />} />
                <Route path="/notifications" element={<Notification />} />
            </Routes>
            <BottomNavbar/>
        </Router>

    );
}

export default App;
