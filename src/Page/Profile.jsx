import React, { useEffect, useState } from 'react';
import './Profile.css'; // Importing the CSS file

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetching user data from localStorage
    const storedUserData = localStorage.getItem('ids');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData).data);
    }
  }, []);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <div className="image-container">
        <img
          src={`https://gateway.pinata.cloud/ipfs/${userData.profile_image}`} // Update with actual image URL or source
          alt={userData.name}
          className="profile-images"
        />
      </div>
      <div className="info-container">
        <h2 className="name">{userData.name}</h2>
        <p className="email">{userData.email}</p>
        <p className="bio">{userData.bio}</p>
        <p className='roll no'>{userData.rollNo}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default Profile;
