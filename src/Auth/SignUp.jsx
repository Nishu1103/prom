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
// import "./sss.css"
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
		PhoneNo: "",
		rollNo: "",
		gender: "",
		bio: "",
		profileImage1: "",
		profileImage2: "",
		year:"",
		hall:"",
	};

	const validationSchema = Yup.object({
		name: Yup.string().required("Required"),
		email: Yup.string()
        .email("Invalid email format")
        .required("Required")
        .matches(/^[\w-\.]+@iitkgp\.ac\.in$/, "Email must be from iitkgp.ac.in domain"), 
    
		password: Yup.string()
			.min(8, "Password too short")
			.required("Required"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password")], "Passwords must match")
			.required("Required"),
		age: Yup.number().required("Required"),
		PhoneNo: Yup.string()  
        .length(10, "Phone number must be exactly 10 digits")  
        .matches(/^\d+$/, "Phone number must be digits only")  
        .required("Required"),
		year: Yup.number().required("Required"),
		hall: Yup.string().required("Required"),
		rollNo: Yup.string()
        .length(9, "Roll number must be exactly 9 characters")  
        .required("Required"),
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
				formData.append(key, values[key]);  
			} else {
				formData.append(key, values[key]);
			}
		}

		 
		for (let [key, value] of formData.entries()) {
			console.log(key, value);
		}

		 
		console.log("Form Values:", values);

    try {
      const response = await axios.post('https://lol-2eal.onrender.com/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setUser(response.data);  
      // alert('User Registered Successfully!');
      createToast("User Registered Successfully!", "success")
      navigate('/');
    } catch (error) {
      // alert('Error during registration');
	  if(error.response && error.response.status === 409){
		createToast("Email Already Exist","error")
	  }else if (error.response && error.response.status === 408){
		createToast("Phone Number or Roll Number Already Exist","error")
	  }else if (error.response && error.response.status === 407	){
		createToast("Roll Number  or Phone No Already Exist","success")
	  } else 
      createToast(error, "error")
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

		 
		if (files.length !== 2) {
			alert("Please upload exactly two images.");
			return;
		}

		try {
			setUploadingPhoto(true);
			 
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
					maxBodyLength: Infinity,  
					headers: {
						"Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
						pinata_api_key: pinataApiKey,
						pinata_secret_api_key: pinataSecretKey,
					},
				}
			);
			const ipfsHash = response.data.IpfsHash;  
			console.log("IPFS hash is", ipfsHash);
			setUploadingPhoto(false);
			return ipfsHash;  
		} catch (error) {
			console.error("Error uploading to Pinata:", error);

			throw error;  
		}
	};

	return (
		<div className="auth-containerss">
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
							<ErrorMessage  style={{ color: 'red' , fontSize:'10px'}} name="name" component="div" />

							<Field
								type="email"
								name="email"
								placeholder="Email"
							/>
							<ErrorMessage style={{ color: 'red' , fontSize:'10px'}} name="email" component="div" />

							<Field
								type="password"
								name="password"
								placeholder="Password"
							/>
							<ErrorMessage style={{ color: 'red' , fontSize:'10px'}} name="password" component="div" />

							<Field
								type="password"
								name="confirmPassword"
								placeholder="Confirm Password"
							/>
							<ErrorMessage
								name="confirmPassword"
								style={{ color: 'red' , fontSize:'10px'}}
								component="div"
							/>

							<Field
								type="text"
								name="rollNo"
								placeholder="Roll No"
							/>
							<ErrorMessage name="rollNo" style={{ color: 'red' , fontSize:'10px'}} component="div" />


							<Field
								type="number"
								name="year"
								placeholder="year"
							/>
							<ErrorMessage name="year" style={{ color: 'red' , fontSize:'10px'}} component="div" />


							<Field
								type="text"
								name="hall"
								placeholder="hall"
							/>
							<ErrorMessage name="hall" style={{ color: 'red' , fontSize:'10px'}} component="div" />



							<Field
								type="number"
								name="PhoneNo"
								placeholder="Mobile No"
							/>
							<ErrorMessage name="PhoneNo" style={{ color: 'red' , fontSize:'10px'}} component="div" />

							<Field type="number" name="age" placeholder="Age" />
							<ErrorMessage name="age" style={{ color: 'red' , fontSize:'10px'}} component="div" />

							<Field as="select" name="gender">
								<option value="">Select Gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</Field>
							<ErrorMessage name="gender" style={{ color: 'red' , fontSize:'10px'}} component="div" />

							<Field type="text" name="bio" placeholder="Bio" />
							<ErrorMessage name="bio" style={{ color: 'red' , fontSize:'10px'}} component="div" />

							{/* Image Upload Fields */}
							<input
								type="file"
								name="profileImage"
								accept="image/*"
								multiple
								placeholder="upload two photos"
								onChange={(event) =>
									handleImageChange(event, setFieldValue)
								}
								style={{ height: "40px" }}
							/>
							<ErrorMessage style={{ color: 'red' , fontSize:'10px'}} name="profileImage" component="div" />

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
