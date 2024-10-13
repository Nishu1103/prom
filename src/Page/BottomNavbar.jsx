
import { Link } from 'react-router-dom';
import './BottomNavbar.css'; // Add CSS for styling

const BottomNavbar = () => {
  return (
    <nav className="bottom-navbar">
      <Link to="/home" className="nav-item">Home</Link>
      <Link to="/profile" className="nav-item">Profile</Link>
      <Link to="/chat" className="nav-item">Chat</Link>
      <Link to="/notifications" className="nav-item">Notifications</Link>
    </nav>
  );
};

export default BottomNavbar;
