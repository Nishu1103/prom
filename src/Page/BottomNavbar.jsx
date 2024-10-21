// import { Link } from 'react-router-dom';
// import './BottomNavbar.css';

// const BottomNavbar = () => {
//   return (
//     <nav className="bottom-navbar">
//       <Link to="/home" className="nav-item">Home</Link>
//       <Link to="/profile" className="nav-item">Profile</Link>
//       <Link to="/chat" className="nav-item">Chat</Link>
//       <Link to="/notifications" className="nav-item">Notifications</Link>
//     </nav>
//   );
// };

// export default BottomNavbar;
import React, {
	useState,
	useRef,
	useEffect,
	useContext,
	useLayoutEffect,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaHome, FaCodepen, FaRegHeart } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import "./BottomNavbar.css";

const BottomNavbar = () => {
	const [activeLink, setActiveLink] = useState("/home");
	const sliderRef = useRef(null);
	const { isAuthorized } = useContext(UserContext);

	const handleLinkClick = (path, event) => {
		setActiveLink(path);
		moveSlider(event.target);
	};

	const moveSlider = (element) => {
		if (sliderRef.current && element) {
			const rect = element.getBoundingClientRect();
			sliderRef.current.style.left = `${rect.left + rect.width / 2}px`;
		}
	};

	useLayoutEffect(() => {
		const timeout = setTimeout(() => {
			let activeElement = document.querySelector(".active-icon");
			console.log("activeElement: ", activeElement); // Debugging
			if (activeElement) {
				moveSlider(activeElement);
			}
		}, 1000);

		return () => clearTimeout(timeout);
	}, [activeLink]);

	if (!isAuthorized) {
		return null;
	}

	return (
		<ul className="bottom-nav">
			<div className="slider" ref={sliderRef}></div>
			<li>
				<Link
					to="/profile"
					className={activeLink === "/profile" ? "active-icon" : ""}
					onClick={(e) => handleLinkClick("/profile", e)}
				>
					<FaUser /> {/* Profile icon */}
					<span>Profile</span>
				</Link>
			</li>
			<li>
				<Link
					to="/home"
					id="home"
					className={activeLink === "/home" ? "active-icon" : ""}
					onClick={(e) => handleLinkClick("/home", e)}
				>
					<FaHome /> {/* Home icon */}
					<span>Home</span>
				</Link>
			</li>
			<li>
				<Link
					to="/chat"
					className={activeLink === "/chat" ? "active-icon" : ""}
					onClick={(e) => handleLinkClick("/chat", e)}
				>
					<FaCodepen /> {/* Chat icon */}
					<span>Chat</span>
				</Link>
			</li>
			<li>
				<Link
					to="/notifications"
					className={
						activeLink === "/notifications" ? "active-icon" : ""
					}
					onClick={(e) => handleLinkClick("/notifications", e)}
				>
					<FaRegHeart /> {/* Heart icon */}
					<span>Notifications</span>
				</Link>
			</li>
		</ul>
	);
};

export default BottomNavbar;
