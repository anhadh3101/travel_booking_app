import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Booking() {
    const [bookings, setBookings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [flights, setFlights] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [newBooking, setNewBooking] = useState({
        customerId: '', flightId: '', hotelId: '', bookingDate: ''
    }); 
    const [editingBooking, setEditingBooking] = useState(null);

    const apiBase = 'http://localhost:8080/api';

    const fetchAll = () => {
        axios.get(`${apiBase}/customers`).then(res => setCustomers(res.data));
        axios.get(`${apiBase}/flights`).then(res => setFlights(res.data));
        axios.get(`${apiBase}/hotels`).then(res => setHotels(res.data));
        axios.get(`${apiBase}/bookings`).then(res => setBookings(res.data));
    }

    useEffect(() => {
        fetchAll();
      }, []);
  

    const handleAdd = async () => {
        const { customerId, flightId, hotelId, bookingDate } = newBooking;

        if (!customerId || !flightId || !hotelId || !bookingDate ) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            await axios.post(`${apiBase}/bookings`, newBooking);
            setNewBooking({ name: '', city: '', pricePerNight: '' });
            fetchAll();
        } catch (error) {
            console.error('Add failed:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiBase}/bookings/${id}`);
            fetchAll();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const startEditing = (booking) => {
        setEditingBooking({ ...booking });
    };

    const handleUpdate = async () => {
        try {
        await axios.put(`${apiBase}/bookings/${editingBooking.bookingId}`, editingBooking);
        setEditingBooking(null);
        fetchAll();
        } catch (error) {
        console.error('Update failed:', error);
        }
    };

    const renderSelect = (value, list, key, onChange) => (
        <select value={value} onChange={e => onChange(e.target.value)}>
            <option value={""}>Select</option>
            {list.map(item => (
                <option key={item[key]} value={item[key]}>
                    {key === 'customerId' ? item.name : key === 'flightId' ? `${item.origin} -> ${item.destination}` : item.name}
                </option>
            ))}
        </select>
    )

    return (
        <div style={{ padding: '20px' }}>
      <h2>Booking Table</h2>

      {/* Add new booking */}
      <div style={{ marginBottom: '15px' }}>
        {renderSelect(newBooking.customerId, customers, 'customerId', val => setNewBooking({ ...newBooking, customerId: val }))}
        {renderSelect(newBooking.flightId, flights, 'flightId', val => setNewBooking({ ...newBooking, flightId: val }))}
        {renderSelect(newBooking.hotelId, hotels, 'hotelId', val => setNewBooking({ ...newBooking, hotelId: val }))}
        <input type="date" value={newBooking.bookingDate} onChange={e => setNewBooking({ ...newBooking, bookingDate: e.target.value })} />
        <button onClick={handleAdd}>Book</button>
      </div>

      {/* Booking table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Customer</th><th>Flight</th><th>Hotel</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.bookingId}>
              <td>{b.bookingId}</td>
              <td>
                {editingBooking?.bookingId === b.bookingId
                  ? renderSelect(editingBooking.customerId, customers, 'customerId', val => setEditingBooking({ ...editingBooking, customerId: val }))
                  : customers.find(c => c.customerId === b.customerId)?.name}
              </td>
              <td>
                {editingBooking?.bookingId === b.bookingId
                  ? renderSelect(editingBooking.flightId, flights, 'flightId', val => setEditingBooking({ ...editingBooking, flightId: val }))
                  : `${flights.find(f => f.flightId === b.flightId)?.origin} ➔ ${flights.find(f => f.flightId === b.flightId)?.destination}`}
              </td>
              <td>
                {editingBooking?.bookingId === b.bookingId
                  ? renderSelect(editingBooking.hotelId, hotels, 'hotelId', val => setEditingBooking({ ...editingBooking, hotelId: val }))
                  : hotels.find(h => h.hotelId === b.hotelId)?.name}
              </td>
              <td>
                {editingBooking?.bookingId === b.bookingId
                  ? <input type="date" value={editingBooking.bookingDate}
                           onChange={e => setEditingBooking({ ...editingBooking, bookingDate: e.target.value })} />
                  : b.bookingDate}
              </td>
              <td>
                {editingBooking?.bookingId === b.bookingId ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingBooking(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(b)}>Edit</button>
                    <button onClick={() => handleDelete(b.bookingId)}>Delete</button>
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