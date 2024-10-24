 
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
import { IoChatbubblesSharp } from "react-icons/io5";
import { IoNotificationsSharp } from "react-icons/io5";
const BottomNavbar = () => {
	const location = useLocation(); // Get the current path
	const [activeLink, setActiveLink] = useState(location.pathname); // Set active link based on path
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
		let activeElement = document.querySelector(".active-icon");
		if (activeElement) {
			moveSlider(activeElement);
		}
	}, [activeLink]);

	useEffect(() => {
	 
		setActiveLink(location.pathname);
	}, [location]);

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
					<IoChatbubblesSharp /> {/* Chat icon */}
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
					<IoNotificationsSharp /> {/* Heart icon */}
					<span>Notifications</span>
				</Link>
			</li>
		</ul>
	);
};

export default BottomNavbar;
