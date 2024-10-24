import './TopNavbar.css';
import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import Modal from 'react-modal';
import createToast from '../utils/toast';

const TopNavbar = () => {
  const { user, isAuthorized } = useContext(UserContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const userData = localStorage.getItem('user');
  const parsedUser = userData ? JSON.parse(userData) : null;
  const token = parsedUser ? parsedUser.token : null;

  if (!isAuthorized) {
    return null;
  }

   
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  
  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('https://lol-2eal.onrender.com/invitePromPartner', {
        partnerName,
        partnerEmail
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      
    );
      setSuccessMessage('Invitation sent successfully!');
      createToast('Invitation sent successfully! check mail',"success")
      setPartnerName('');
      setPartnerEmail('');
      console.log(response.message)
      closeModal();
    } catch (error) {
      if (error.response && error.response.status === 409) {
       
        setErrorMessage('Already matched with someone.');
        createToast('Already matched with someone.', 'error');
      } else {
         
        setErrorMessage('Failed to send invitation. Please try again.');
        createToast('Failed to send invitation. Please try again.', 'error');
      }
      console.log(error);
    } finally {
      setLoading(false);
    }}

  return (
    <nav className="top-navbar">
      <div className="logo">
        <img src="/images/SF Prom Night.png" alt="logo" />
      </div>

      
      <button className="invite-btn" onClick={openModal}>
        Invite to Prom Night
      </button>

      
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        contentLabel="Invite to Prom Night"
        className="invite-modal"
        overlayClassName="invite-modal-overlay"
      >
        <h2>Invite a Partner</h2>
        <form className="invite-form" onSubmit={handleInvite}>
          <input
            type="text"
            placeholder="Partner's Name"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Partner's Email"
            value={partnerEmail}
            onChange={(e) => setPartnerEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
 
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Close Modal Button */}
        <button className="close-modal-btn" onClick={closeModal}>
          Close
        </button>
      </Modal>
    </nav>
  );
};

export default TopNavbar;
