import { createContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import createToast from "../utils/toast";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [users, setUsers] = useState([]);
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(true); // Loading state
	const [error, setError] = useState(null); // Error state
	const [isAuthorized, setIsAuthorized] = useState(false);

	const userData = localStorage.getItem("user");
	const parsedUser = userData ? JSON.parse(userData) : null;
	const token = parsedUser ? parsedUser.token : null;
	// console.log(token)
	useEffect(() => {
		const fetchUsers = async () => {
			if (!token) {
				console.error("No token available for authentication");
				setError("No token available for authentication");
				setLoading(false);
				return;
			}
			setLoading(true); // Set loading to true before fetching
			try {
				// Send request with token authorization header
				const response = await axios.get(
					"/getUsers",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (response.data && Array.isArray(response.data.data)) {
					setUsers(response.data.data);
					// console.log(response.data.data); // Update users from the data property
				} else {
					console.error(
						"Fetched data is not an array",
						response.data
					);
					setError("Fetched data is not in the expected format.");
				}
			} catch (error) {
				console.error("Error fetching users", error);
				setError("Error fetching users. Please try again later.");
			} finally {
				setLoading(false); // Set loading to false after fetching
			}
		};

		fetchUsers();

		const checkUserAuthentication = async () => {
			try {
				const response = await axios.get(
					"/user",
					{
						headers: {
							Authorization: `Bearer ${token}`, // Assuming you store the token in localStorage
						},
					}
				);

				if (response.data) {
					setUser(response.data); // Assuming the user data is returned in response.data.user
					// setUsers(response.data)
					// console.log(response.data, "kkk");
					setIsAuthorized(true);
					// console.log(isAuthorized);
					// console.log(response.data)
					localStorage.setItem("ids", JSON.stringify(response.data));
					// console.log(localStorage.getItem('ids'), "ddddDDDD")
					const storedData = JSON.parse(localStorage.getItem("ids"));
					// console.log(storedData, "Parsed Data");
				} else {
					setIsAuthorized(false);
				}
			} catch (error) {
				console.error("Error checking user authentication", error);
				setIsAuthorized(false);
			}
		};

		checkUserAuthentication();
	}, [token]);

	return (
		<UserContext.Provider
			value={{
				user,
				users,
				matches,
				setUser,
				loading,
				error,
				isAuthorized,
				setIsAuthorized,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

UserProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
