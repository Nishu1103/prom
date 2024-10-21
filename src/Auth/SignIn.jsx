import { useContext , useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import "./Auth.css"; // Updated CSS file
import { useNavigate } from "react-router-dom";
import createToast from "../utils/toast";
import { Link } from "react-router-dom";

const SignIn = () => {
	const { isAuthorized, setUsers, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	if (isAuthorized || localStorage.getItem("user")) {
		navigate("./home");
	}

	const initialValues = {
		email: "",
		password: "",
	};

	const validationSchema = Yup.object({
		email: Yup.string().email("Invalid email format").required("Required"),
		password: Yup.string().required("Required"),
	});

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('https://lol-2eal.onrender.com/login', values);
      setUser(response.data); // Save the user in context
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('ids', JSON.stringify(response.data));
      createToast('Login successful', 'success');
      navigate('/home');
    } catch (error) {
      createToast('Error during login', 'error');
      console.error('Error during login', error);
    } finally {
      setSubmitting(false);
    }
  };

	return (
		<div className="auth-containers">
			<div className="bubble-auth-container">
				<h2 className="bubble-title">Sign In</h2>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({ isSubmitting }) => (
						<Form className="bubble-form">
							<Field
								type="email"
								name="email"
								placeholder="Email"
								className="bubble-input"
							/>
							<ErrorMessage
								name="email"
								component="div"
								className="bubble-error"
							/>

							<Field
								type="password"
								name="password"
								placeholder="Password"
								className="bubble-input"
							/>
							<ErrorMessage
								name="password"
								component="div"
								className="bubble-error"
							/>

							<button
								type="submit"
								className="bubble-button"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Signing In..." : "Sign In"}
							</button>

							<div className="bubble-link-container">
								<Link to="/Signup" className="bubble-link">
									Don't have an account? Sign up
								</Link>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default SignIn;
