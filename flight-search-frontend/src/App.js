import React, { useState } from 'react';
import styles from './App.module.css';
import { useAuth } from './contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Customer from './components/Customer';
import Flight from './components/Flight';
import Hotel from './components/Hotel';
import Booking from './components/Booking';

function App() {
  const { currentUser } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  const [hasManuallyLoggedIn, setHasManuallyLoggedIn] = useState(false);

  if (!currentUser || !hasManuallyLoggedIn) {
    return showSignUp ? (
      <SignUp onBack={() => setShowSignUp(false)} />
    ) : (
      <div className={styles.authContainer}>
        <Login onLogin={() => setHasManuallyLoggedIn(true)} />
        <p className={styles.switchText}>
          Don't have an account?{' '}
          <button className={styles.linkButton} onClick={() => setShowSignUp(true)}>
            Sign Up
          </button>
        </p>
      </div>
    );
  }

  return (
    <Router>
      <div className={styles.app}>
        <header className={styles.header}>
          <h1>Travel Booking Dashboard</h1>
          <p>
            Welcome, {currentUser.email}{' '}
            <button className={styles.logoutButton} onClick={() => signOut(auth)}>Log Out</button>
          </p>
        </header>

        <nav className={styles.nav}>
          <Link to="/customer"><button>Customer</button></Link>
          <Link to="/flight"><button>Flight</button></Link>
          <Link to="/hotel"><button>Hotel</button></Link>
          <Link to="/booking"><button>Booking</button></Link>
        </nav>

        <Routes>
          <Route path="/customer" element={<Customer />} />
          <Route path="/flight" element={<Flight />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
