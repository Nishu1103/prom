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

  // Handle modal open/close
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Handle invite submission
  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:3000/invitePromPartner', {
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
      createToast('Invitation sent successfully!',"success")
      setPartnerName('');
      setPartnerEmail('');
      console.log(response.message)
      closeModal();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Handle specific 409 error
        setErrorMessage('Already matched with someone.');
        createToast('Already matched with someone.', 'error');
      } else {
        // Handle other errors
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

      {/* Invite Button */}
      <button className="invite-btn" onClick={openModal}>
        Invite to Prom Night
      </button>

      {/* Modal for the invite form */}
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

        {/* Success and Error Messages */}
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
