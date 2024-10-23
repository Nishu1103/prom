// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// // import { UserContext } from './context/UserContext.jsx'
// import { UserProvider } from './context/UserContext.jsx'

// createRoot(document.getElementById('root')).render(

// <UserProvider>

//   <StrictMode>
//     <App />
//   </StrictMode>,


// </UserProvider>
// )
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';  // Import Router
import App from './App.jsx';
import './index.css';
import { UserProvider } from './context/UserContext.jsx';

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <Router>   
      <StrictMode>
        <App />
      </StrictMode>
    </Router>
  </UserProvider>
);
