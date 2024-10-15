import BottomNavbar from './BottomNavbar'; // bottom navigation component
import TopNavbar from './TopNavbar'; // top navigation component
import './Home.css'; // Add CSS for styling
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
        <h1>Welcome to SF Promnight</h1>
        <Swipe/>
      </div>
      {/* <BottomNavbar /> */}
    </div>
  );
};

export default Home;
