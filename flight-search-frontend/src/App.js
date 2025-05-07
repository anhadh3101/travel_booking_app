import React, { useState } from 'react';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
  const { currentUser } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  // Flight search states
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFlights = async () => {
    if (!origin || !destination || !departureDate || !returnDate || !adults) {
      alert('Please fill in all fields!');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        origin, destination, departureDate, returnDate, adults
      });

      const response = await fetch(`https://2u1qfmvm7c.execute-api.us-east-2.amazonaws.com/default/getFlights?${params}`);
      const data = await response.json();

      setFlights(data.data || []);
      if (!data.data) alert('No flights found.');
    } catch (error) {
      console.error('Error fetching flights:', error);
      alert('Failed to fetch flights.');
    } finally {
      setLoading(false);
    }
  };

  // If user is not signed in
  if (!currentUser) {
    return showSignUp ? (
      <SignUp onBack={() => setShowSignUp(false)} />
    ) : (
      <div>
        <Login />
        <p>Don't have an account? <button onClick={() => setShowSignUp(true)}>Sign Up</button></p>
      </div>
    );
  }

  // If user is signed in
  return (
    <div className="App">
      <h1>Flight Search</h1>
      <p>Welcome, {currentUser.email} <button onClick={() => signOut(auth)}>Log Out</button></p>

      <div className="form">
        <input placeholder="Origin (e.g., SYD)" value={origin} onChange={e => setOrigin(e.target.value)} />
        <input placeholder="Destination (e.g., BKK)" value={destination} onChange={e => setDestination(e.target.value)} />
        <input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} />
        <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
        <input type="number" value={adults} min="1" onChange={e => setAdults(e.target.value)} />
        <button onClick={searchFlights} disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </div>

      <div className="results">
        {flights.length > 0 ? flights.map((flight, index) => (
          <div key={index} className="flight-card">
            <h3>Flight {index + 1}</h3>
            {flight.itineraries.map((itinerary, idx) => (
              <div key={idx}>
                <p><strong>Itinerary {idx + 1} Duration:</strong> {itinerary.duration}</p>
                {itinerary.segments.map((segment, sid) => (
                  <div key={sid}>
                    <p>✈️ {segment.departure.iataCode} ➔ {segment.arrival.iataCode}</p>
                    <p>Departure: {segment.departure.at}</p>
                    <p>Arrival: {segment.arrival.at}</p>
                    <p>Carrier: {segment.carrierCode} Flight {segment.number}</p>
                  </div>
                ))}
              </div>
            ))}
            <p><strong>Price:</strong> {flight.price?.grandTotal} {flight.price?.currency}</p>
          </div>
        )) : !loading && <p>No flights to display.</p>}
      </div>
    </div>
  );
}

export default App;
