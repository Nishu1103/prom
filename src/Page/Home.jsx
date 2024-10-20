import BottomNavbar from './BottomNavbar';  
import TopNavbar from './TopNavbar';  
import './Home.css';  
import Swipe from "./Swipe"
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user , isAuthorized } = useContext(UserContext);
  const navigate = useNavigate();

  if(!isAuthorized || !localStorage.getItem('user')) {

    navigate('/');


  }
  return (
    <div>
      {/* <TopNavbar /> */}
      <div className="home-content">
        {/* <h1>Welcome to SF Promnight</h1> */}
        <Swipe/>
      </div>
      {/* <BottomNavbar /> */}
    </div>
  );
};

export default Home;
