import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfSE5ccbL0ldv2Y9EyoBVgf90fsbIrM7I",
  authDomain: "registration-form-464f0.firebaseapp.com",
  projectId: "registration-form-464f0",
  storageBucket: "registration-form-464f0.appspot.com",
  messagingSenderId: "318911543649",
  appId: "1:318911543649:web:ad6cf399b192ea3320ed20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const App = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      alert('Registration successful! You can now login.');
    } catch (error) {
      console.error("Registration error:", error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError("Email already in use");
          break;
        case 'auth/invalid-email':
          setError("Invalid email address");
          break;
        case 'auth/weak-password':
          setError("Password should be at least 6 characters");
          break;
        default:
          setError("Registration failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: '600'
      }}>Registration Form</h1>
      
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          style={{
            padding: '15px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#95a5a6' : '#3498db',
            color: 'white',
            padding: '15px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p style={{ color: '#e74c3c', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
};

// Reusable input style
const inputStyle = {
  padding: '15px',
  border: '2px solid #e0e0e0',
  borderRadius: '8px',
  fontSize: '16px',
  transition: 'all 0.3s ease',
  ':focus': {
    borderColor: '#3498db',
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)'
  }
};

export default App;