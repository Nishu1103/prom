import React, { useEffect, useState, useContext } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Profile = () => {
	const [userData, setUserData] = useState(null);
	const navigate = useNavigate();

	const { user, isAuthorized, setIsAuthorized } = useContext(UserContext);
	if (!localStorage.getItem("user")) {
		navigate("/");
		setIsAuthorized(false);
	} else {
		setIsAuthorized(true);
	}

	useEffect(() => {
		// Fetching user data from localStorage
		const storedUserData = localStorage.getItem("ids");
		if (storedUserData) {
			setUserData(JSON.parse(storedUserData).data);
		}
	}, []);

	if (!userData) {
		return <p>Loading profile...</p>;
	}
	const handleLogout = () => {
		localStorage.clear();
		navigate("/");
		setIsAuthorized(false);
	};

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
				<h2 className="name">Name: {userData.name}</h2>
				<p className="email">Email: {userData.email}</p>
				<p className="bio">Bio: {userData.bio}</p>
				<p className="roll no">Roll No: {userData.rollNo}</p>
				{/* Add more details as needed */}
			</div>

			<div className="logOut" onClick={handleLogout}>
				logout
			</div>
		</div>
	);
};

export default Profile;
