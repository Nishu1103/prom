import  { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const { isAuthorized, setUsers,setUser } = useContext(UserContext);
  const navigate=useNavigate();



  if(isAuthorized || localStorage.getItem('user')) {
    navigate("./home");
  }

  const initialValues = {
    email: '',
    password: ''
  };





  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:3000/login', values);
      setUser(response.data); // Save the user in context
      // setUsers(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log(localStorage.getItem('user', JSON.stringify(response.data)))
      alert('Login successful');
      // setIsAuthorized(true); // Set isAuthorized to true
      navigate('/home');
    } catch (error) {
      alert('Error during login',error);
      console.error('Error during login', error);
      // setIsAuthorized(false);
    } finally {
      setSubmitting(false);

    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" />

            <Field type="password" name="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
