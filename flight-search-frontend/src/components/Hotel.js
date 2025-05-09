import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Hotel() {
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({
    name: '', city: '', pricePerNight: ''
  });
  const [editingHotel, setEditingHotel] = useState(null);

  const apiBase = 'http://localhost:8080/api/hotels';

  const fetchHotels = () => {
    axios.get(apiBase)
      .then(res => setHotels(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleAdd = async () => {
    if (!newHotel.name || !newHotel.city || !newHotel.pricePerNight) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await axios.post(apiBase, newHotel);
      setNewHotel({ name: '', city: '', pricePerNight: '' });
      fetchHotels();
    } catch (error) {
      console.error('Add failed:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBase}/${id}`);
      fetchHotels();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const startEditing = (hotel) => {
    setEditingHotel({ ...hotel });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${apiBase}/${editingHotel.hotelId}`, editingHotel);
      setEditingHotel(null);
      fetchHotels();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Hotel Table</h2>

      {/* Add hotel */}
      <div style={{ marginBottom: '15px' }}>
        <input placeholder="Name" value={newHotel.name}
               onChange={e => setNewHotel({ ...newHotel, name: e.target.value })} />
        <input placeholder="City" value={newHotel.city}
               onChange={e => setNewHotel({ ...newHotel, city: e.target.value })} />
        <input type="number" min="0" step="0.01" placeholder="Price Per Night" value={newHotel.pricePerNight}
               onChange={e => setNewHotel({ ...newHotel, pricePerNight: e.target.value })} />
        <button onClick={handleAdd}>Add</button>
      </div>

      {/* Hotel table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>City</th><th>Price/Night</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map(hotel => (
            <tr key={hotel.hotelId}>
              <td>{hotel.hotelId}</td>
              <td>
                {editingHotel?.hotelId === hotel.hotelId ? (
                  <input value={editingHotel.name}
                         onChange={e => setEditingHotel({ ...editingHotel, name: e.target.value })} />
                ) : hotel.name}
              </td>
              <td>
                {editingHotel?.hotelId === hotel.hotelId ? (
                  <input value={editingHotel.city}
                         onChange={e => setEditingHotel({ ...editingHotel, city: e.target.value })} />
                ) : hotel.city}
              </td>
              <td>
                {editingHotel?.hotelId === hotel.hotelId ? (
                  <input type="number" value={editingHotel.pricePerNight}
                         onChange={e => setEditingHotel({ ...editingHotel, pricePerNight: e.target.value })} />
                ) : `$${hotel.pricePerNight}`}
              </td>
              <td>
                {editingHotel?.hotelId === hotel.hotelId ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingHotel(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(hotel)}>Edit</button>
                    <button onClick={() => handleDelete(hotel.hotelId)}>Delete</button>
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
