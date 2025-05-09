import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);

  const apiBase = 'http://localhost:8080/travel_booking_backend/api/customers';

  // Fetch all customers
  const fetchCustomers = () => {
    axios.get(apiBase)
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Add new customer
  const handleAdd = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      alert("Please fill all fields.");
      return;
    }
    try {
      await axios.post(apiBase, newCustomer);
      setNewCustomer({ name: '', email: '', phone: '' });
      fetchCustomers();
    } catch (error) {
      console.error('Add failed:', error);
    }
  };

  // Delete customer
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBase}/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // Start editing
  const startEditing = (customer) => {
    setEditingCustomer({ ...customer });
  };

  // Save edited customer
  const handleUpdate = async () => {
    try {
      await axios.put(`${apiBase}/${editingCustomer.customerId}`, editingCustomer);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Customer Table</h2>

      {/* Add new customer */}
      <div style={{ marginBottom: '15px' }}>
        <input placeholder="Name" value={newCustomer.name}
               onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
        <input placeholder="Email" value={newCustomer.email}
               onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
        <input placeholder="Phone" value={newCustomer.phone}
               onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
        <button onClick={handleAdd}>Add</button>
      </div>

      {/* Customer table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.customerId}>
              <td>{customer.customerId}</td>
              <td>
                {editingCustomer?.customerId === customer.customerId ? (
                  <input value={editingCustomer.name}
                         onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })} />
                ) : customer.name}
              </td>
              <td>
                {editingCustomer?.customerId === customer.customerId ? (
                  <input value={editingCustomer.email}
                         onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value })} />
                ) : customer.email}
              </td>
              <td>
                {editingCustomer?.customerId === customer.customerId ? (
                  <input value={editingCustomer.phone}
                         onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })} />
                ) : customer.phone}
              </td>
              <td>
                {editingCustomer?.customerId === customer.customerId ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingCustomer(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(customer)}>Edit</button>
                    <button onClick={() => handleDelete(customer.customerId)}>Delete</button>
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
