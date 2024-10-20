import { useLocation } from 'react-router-dom';
import TopNavbar from './Page/TopNavbar';
import BottomNavbar from './Page/BottomNavbar';
import PropTypes from 'prop-types';
const Layout = ({ children }) => {
  const location = useLocation();

  // Routes where the navbars should be hidden
  const hideNavbars = location.pathname === '/' || location.pathname === '/signup';

  return (
    <>
      {/* Conditionally render TopNavbar and BottomNavbar */}
      {!hideNavbars && <TopNavbar />}
      <div className="main-content">
        {children} {/* The main content (e.g., SignIn, SignUp, etc.) */}
      </div>
      {!hideNavbars && <BottomNavbar />}
    </>
  );
};

export default Layout;
Layout.propTypes = {
    children: PropTypes.node.isRequired,
};