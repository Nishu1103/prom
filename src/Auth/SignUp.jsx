import { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import "./Auth.css";
import { useState } from "react";
import createToast from "../utils/toast";
import { Link } from "react-router-dom";
// import { createLogger } from 'vite';

const SignUp = () => {
	const navigate = useNavigate();
	const { setUser } = useContext(UserContext);
	const [uploadingPhoto, setUploadingPhoto] = useState(false);
	const initialValues = {
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		age: "",
		PhoneNO: "",
		rollNo: "",
		gender: "",
		bio: "",
		profileImage1: "",
		profileImage2: "",
	};

	const validationSchema = Yup.object({
		name: Yup.string().required("Required"),
		email: Yup.string().email("Invalid email format").required("Required"),
		password: Yup.string()
			.min(6, "Password too short")
			.required("Required"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password")], "Passwords must match")
			.required("Required"),
		age: Yup.number().required("Required"),
		PhoneNO: Yup.number().required("Required"),
		rollNo: Yup.string().required("Required"),
		gender: Yup.string().required("Required"),
		bio: Yup.string().required("Required"),
		profileImage1: Yup.string().required("Required"),
		profileImage2: Yup.string().required("Required"),
	});

	const handleSubmit = async (values, { setSubmitting }) => {
		const formData = new FormData();
		console.log("click");
		console.log(formData);
		// Append user details to formData
		for (const key in values) {
			if (key === "profileImage1" || key === "profileImage2") {
				formData.append(key, values[key]); // Directly append the hash strings
			} else {
				formData.append(key, values[key]);
			}
		}

		// Log FormData entries for debugging
		for (let [key, value] of formData.entries()) {
			console.log(key, value);
		}

		// Log form values
		console.log("Form Values:", values);

    try {
      const response = await axios.post('http://localhost:3000/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setUser(response.data); // Save the user in context
      // alert('User Registered Successfully!');
      createToast("User Registered Successfully!", "success")
      navigate('/');
    } catch (error) {
      // alert('Error during registration');
      createToast("Error during registration", "error")
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };




	//   const handleSubmit = async (values, { setSubmitting }) => {
	//     const formData = new FormData();

	//     // Append user details to formData
	//     for (const key in values) {
	//         if (Array.isArray(values[key])) {
	//             values[key].forEach((file) => {
	//                 formData.append('profileImage', file); // Ensure you're using the same key
	//             });
	//         } else {
	//             formData.append(key, values[key]);
	//         }
	//     }
	//     console.log(formData,"formdata")
	//     // Log the FormData entries for debugging
	//     for (let [key, value] of formData.entries()) {
	//         console.log(key, value);
	//     }

	//     try {
	//         const response = await axios.post('http://192.168.12.1:3000/register', formData, {
	//             headers: {
	//                 'Content-Type': 'multipart/form-data'
	//             }
	//         });
	//         setUser(response.data); // Save the user in context
	//         alert('User Registered Successfully!');
	//         navigate('/');
	//     } catch (error) {
	//         alert('Error during registration');
	//         console.error(error);
	//     } finally {
	//         setSubmitting(false);
	//     }
	// };

	const handleImageChange = async (event, setFieldValue) => {
		const files = Array.from(event.currentTarget.files);

		// Check that exactly two files are uploaded
		if (files.length !== 2) {
			alert("Please upload exactly two images.");
			return;
		}

		try {
			setUploadingPhoto(true);
			// Upload images to Pinata and get their hashes
			const uploadedHashes = await Promise.all(
				files.map((file) => uploadToPinata(file))
			);
			console.log("Uploaded IPFS Hashes:", uploadedHashes);
			// Set the hashes to the respective fields
			setFieldValue("profileImage1", uploadedHashes[0]); // First image hash
			setFieldValue("profileImage2", uploadedHashes[1]); // Second image hash
			setUploadingPhoto(false);
		} catch (error) {
			// alert('Error uploading images. Please try again.');
			createToast("Error uploading images. Please try again.", "error");
			console.log(error);
		}
	};

	const uploadToPinata = async (file) => {
		setUploadingPhoto(true);
		const pinataApiKey = "f6331fbb7aa149475ff3"; // Replace with your Pinata API key
		const pinataSecretKey =
			"ad957485ff439f7eafea6678595944edd323548b45e9b3b76bf7dbf2ac5bc0b7"; // Replace with your Pinata secret key

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await axios.post(
				"https://api.pinata.cloud/pinning/pinFileToIPFS",
				formData,
				{
					maxBodyLength: Infinity, // Allow large files
					headers: {
						"Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
						pinata_api_key: pinataApiKey,
						pinata_secret_api_key: pinataSecretKey,
					},
				}
			);
			const ipfsHash = response.data.IpfsHash; // Store the IPFS hash in a string
			console.log("IPFS hash is", ipfsHash);
			setUploadingPhoto(false);
			return ipfsHash; // Return the IPFS hash
		} catch (error) {
			console.error("Error uploading to Pinata:", error);

			throw error; // Rethrow the error for handling in the calling function
		}
	};

	return (
		<div className="auth-containers">
			<div className="auth-container">
				<h2 style={{ color: "#7E60BF" }}> Sign Up</h2>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({ isSubmitting, setFieldValue }) => (
						<Form>
							<Field type="text" name="name" placeholder="Name" />
							<ErrorMessage name="name" component="div" />

							<Field
								type="email"
								name="email"
								placeholder="Email"
							/>
							<ErrorMessage name="email" component="div" />

							<Field
								type="password"
								name="password"
								placeholder="Password"
							/>
							<ErrorMessage name="password" component="div" />

							<Field
								type="password"
								name="confirmPassword"
								placeholder="Confirm Password"
							/>
							<ErrorMessage
								name="confirmPassword"
								component="div"
							/>

							<Field
								type="text"
								name="rollNo"
								placeholder="Roll No"
							/>
							<ErrorMessage name="rollNo" component="div" />

							<Field
								type="number"
								name="PhoneNO"
								placeholder="Mobile No"
							/>
							<ErrorMessage name="PhoneNO" component="div" />

							<Field type="number" name="age" placeholder="Age" />
							<ErrorMessage name="age" component="div" />

							<Field as="select" name="gender">
								<option value="">Select Gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</Field>
							<ErrorMessage name="gender" component="div" />

							<Field type="text" name="bio" placeholder="Bio" />
							<ErrorMessage name="bio" component="div" />

							{/* Image Upload Fields */}
							<input
								type="file"
								name="profileImage"
								accept="image/*"
								multiple
								onChange={(event) =>
									handleImageChange(event, setFieldValue)
								}
								style={{ height: "40px" }}
							/>
							<ErrorMessage name="profileImage" component="div" />

							<button
								className="bubble-button"
								type="submit"
								disabled={isSubmitting || uploadingPhoto}
							>
								{uploadingPhoto
									? "Uploading Images.."
									: isSubmitting
									? "Signing Up.."
									: "Sign Up"}
							</button>
							<div className="bubble-link-container">
								<Link to="/" className="link-button">
									Already have an account? Sign in
								</Link>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default SignUp;
