import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Flight() {
  const [flights, setFlights] = useState([]);
  const [newFlight, setNewFlight] = useState({
    origin: '', destination: '', departureTime: '', arrivalTime: '', price: ''
  });
  const [editingFlight, setEditingFlight] = useState(null);

  const apiBase = 'http://localhost:8080/api/flights';

  // Fetch all flights
  const fetchFlights = () => {
    axios.get(apiBase)
      .then(res => setFlights(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  // Add new flight
  const handleAdd = async () => {
    const { origin, destination, departureTime, arrivalTime, price } = newFlight;
    if (!origin || !destination || !departureTime || !arrivalTime || !price) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await axios.post(apiBase, newFlight);
      setNewFlight({ origin: '', destination: '', departureTime: '', arrivalTime: '', price: '' });
      fetchFlights();
    } catch (error) {
      console.error('Add failed:', error);
    }
  };

  // Delete flight
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBase}/${id}`);
      fetchFlights();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // Start editing
  const startEditing = (flight) => {
    setEditingFlight({ ...flight });
  };

  // Save update
  const handleUpdate = async () => {
    try {
      await axios.put(`${apiBase}/${editingFlight.flightId}`, editingFlight);
      setEditingFlight(null);
      fetchFlights();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Flight Table</h2>

      {/* Add flight form */}
      <div style={{ marginBottom: '15px' }}>
        <input placeholder="Origin" value={newFlight.origin}
               onChange={e => setNewFlight({ ...newFlight, origin: e.target.value })} />
        <input placeholder="Destination" value={newFlight.destination}
               onChange={e => setNewFlight({ ...newFlight, destination: e.target.value })} />
        <input type="datetime-local" value={newFlight.departureTime}
               onChange={e => setNewFlight({ ...newFlight, departureTime: e.target.value })} />
        <input type="datetime-local" value={newFlight.arrivalTime}
               onChange={e => setNewFlight({ ...newFlight, arrivalTime: e.target.value })} />
        <input type="number" min="0" step="0.01" placeholder="Price" value={newFlight.price}
               onChange={e => setNewFlight({ ...newFlight, price: e.target.value })} />
        <button onClick={handleAdd}>Add</button>
      </div>

      {/* Flights table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Origin</th><th>Destination</th><th>Departure</th><th>Arrival</th><th>Price</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(flight => (
            <tr key={flight.flightId}>
              <td>{flight.flightId}</td>
              <td>
                {editingFlight?.flightId === flight.flightId ? (
                  <input value={editingFlight.origin}
                         onChange={e => setEditingFlight({ ...editingFlight, origin: e.target.value })} />
                ) : flight.origin}
              </td>
              <td>
                {editingFlight?.flightId === flight.flightId ? (
                  <input value={editingFlight.destination}
                         onChange={e => setEditingFlight({ ...editingFlight, destination: e.target.value })} />
                ) : flight.destination}
              </td>
              <td>
                {editingFlight?.flightId === flight.flightId ? (
                  <input type="datetime-local" value={editingFlight.departureTime}
                         onChange={e => setEditingFlight({ ...editingFlight, departureTime: e.target.value })} />
                ) : flight.departureTime}
              </td>
              <td>
                {editingFlight?.flightId === flight.flightId ? (
                  <input type="datetime-local" value={editingFlight.arrivalTime}
                         onChange={e => setEditingFlight({ ...editingFlight, arrivalTime: e.target.value })} />
                ) : flight.arrivalTime}
              </td>
              <td>
                {editingFlight?.flightId === flight.flightId ? (
                  <input type="number" value={editingFlight.price}
                         onChange={e => setEditingFlight({ ...editingFlight, price: e.target.value })} />
                ) : `$${flight.price}`}
              </td>
              <td>
                {editingFlight?.flightId === flight.flightId ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingFlight(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(flight)}>Edit</button>
                    <button onClick={() => handleDelete(flight.flightId)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
