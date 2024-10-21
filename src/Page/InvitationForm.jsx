// InvitationForm.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InvitationForm() {
  const { inviteCode } = useParams(); // Get the invite code from the URL
  console.log(inviteCode)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    hall: '',
    year: '',
    phoneNo: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`http://localhost:3000/promInvite/${inviteCode}`, formData);
      if (response.status === 201) {
        alert('Invitation accepted successfully!');
        navigate('/'); // Navigate to the homepage or any success page
      }
    } catch (error) {
      setErrorMessage('Failed to submit form. Please check the details or the invite may have expired.');
      console.error('Error accepting invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invitation-form-container">
      <h2>Confirm Your Participation</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Hall:</label>
          <input
            type="text"
            name="hall"
            value={formData.hall}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Year:</label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default InvitationForm;
