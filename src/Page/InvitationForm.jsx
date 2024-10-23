import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import createToast from '../utils/toast';
import "./InvitationForm.css";

function InvitationForm() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    hall: '',
    year: '',
    phoneNo: '',
    gender: ''
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
      const response = await axios.post(`https://lol-2eal.onrender.com/prom-invite/${inviteCode}`, formData);
      if (response.status === 201) {
        // alert('Invitation accepted successfully!');
        createToast('Invitation accepted successfully! check mail', 'success');
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Invalid or expired invitation. Please check the invite code.');
        createToast(error,"error")
      } else {
        setErrorMessage('Failed to submit form. Please try again.');
        createToast("Failed to submit form. Please try again.","error")
      }
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
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="hall"
          value={formData.hall}
          onChange={handleChange}
          placeholder="Hall"
          required
        />
        <input
          type="text"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year"
          required
        />
        <input
          type="text"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default InvitationForm;
