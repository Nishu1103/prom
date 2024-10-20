import './TopNavbar.css'; 
import { UserContext } from '../context/UserContext'; 
import { useContext } from 'react';

const TopNavbar = () => {

  const { user , isAuthorized } = useContext(UserContext);

  if (!isAuthorized) {
    return null;
  }

  return (
    <nav className="top-navbar">
      <div className="logo">
        <img src="/images/SF Prom Night.png" alt="logo" />
      </div>
      {/* <div className="title">SF Promnight</div> */}
    </nav>
  );
};

export default TopNavbar;
