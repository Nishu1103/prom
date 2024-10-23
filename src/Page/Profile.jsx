import React, { useEffect, useState, useContext } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Profile = () => {
	const [userData, setUserData] = useState(null);
	const navigate = useNavigate();

	const { user, isAuthorized, setIsAuthorized } = useContext(UserContext);

	const [ partnerData ,setPartnerData ] = useState(null);
	if (!localStorage.getItem("user")) {
		navigate("/");
		setIsAuthorized(false);
	} else {
		setIsAuthorized(true);
	}

	const ids = localStorage.getItem('ids');
    const storedData = JSON.parse(ids);
    const userId = storedData.data.id;
	const userDatas = localStorage.getItem('user');
    const parsedUser = JSON.parse(userDatas); // Parse the user data
    const token = parsedUser.token; 

	// console.log(token)

	// console.log(userId)


	useEffect(() => {
		// Fetching user data from localStorage
	
		const storedUserData = localStorage.getItem("ids");
		if (storedUserData) {
			setUserData(JSON.parse(storedUserData).data);
		}

		fetchPartnerDetails();

	},[]);

	const fetchPartnerDetails = async () => {
        try {
            const response = await axios.get(`https://lol-2eal.onrender.com/api/partner/${userId}`, {
                headers: {
					Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.partner) {
                setPartnerData(response.data.partner);
				// console.log(response.data.partner)
            }
        } catch (error) {
            console.error("Error fetching partner details", error);
        }

    };
	// fetchPartnerDetails()

	


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

			 <div className="lll">

			<h2 className="name">Name: {userData.name}</h2>
			<div className="ppp" style={{display:"flex"}}>

			<div className="image-container">
				<img
					src={`https://gateway.pinata.cloud/ipfs/${userData.profile_image}`} // Update with actual image URL or source
					alt={userData.name}
					className="profile-images"
				/>
			</div>
			<div className="info-container">
				
				<p className="email">Email: {userData.email}</p>
				<p className="bio">Bio: {userData.bio}</p>
				<p className="roll no">Roll No: {userData.rollNo}</p>
				<p className="Phone no">Phone no: {userData.PhoneNo}</p>
				<p className="hall">Hall: {userData.hall}</p>
				{/* Add more details as needed */}
			</div>

			</div>

			</div>

			{partnerData && (
                <div className="partner-info">
                    <h3 style={
						

						{
							fontSize: "20px",
							fontWeight: "bold",
							color: "#444",
							marginBottom: "10px",
							textAlign: "center",
							color:"#7E60BF",
							
						}
					}>Partner Details</h3>

					<div className="llll" style={{display:"flex", gap:"20px"}}>


					<div className="imgg">
                    <img
                        src={`https://gateway.pinata.cloud/ipfs/${partnerData.profile_image}`}
                        alt={partnerData.name}
                        className="partner-images"
                    />
					</div>
					<div className="info" style={{
						display:"flex",
						flexDirection:"column",
						gap:"10px",
						// alignItems:"center",
						justifyContent:"center",
					}}>
                    <p className="partner-name">Name: {partnerData.name}</p>
                    <p className="partner-email">Email: {partnerData.email}</p>
                    <p className="partner-rollno">Roll No: {partnerData.rollno}</p>

					</div>

					</div>
                </div>
            )}

			<div className="logOut" onClick={handleLogout}>
				logout
			</div>
		</div>
	);
};

export default Profile;
