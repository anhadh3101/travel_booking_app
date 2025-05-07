const express = require('express');
const axios = require('axios');
const qs = require('qs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 8000;

// Enable CORS so React can access this server

app.use(cors({
    origin: 'http://localhost:3000'
  }));

// Fetch Access Token from Amadeus
async function fetchAccessToken() {
  try {
    const data = qs.stringify({
      'client_id': process.env.CLIENT_ID,
      'client_secret': process.env.CLIENT_SECRET,
      'grant_type': 'client_credentials'
    });

    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error fetching access token:', error.response?.data || error.message);
    throw error;
  }
}

// Fetch Flight Offers from Amadeus
async function fetchFlightOffers(accessToken, searchParams) {
  try {
    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: searchParams
    });

    return response.data.data;
  } catch (error) {
    console.error('❌ Error fetching flight offers:', error.response?.data || error.message);
    throw error;
  }
}

// API route for frontend to call
app.get('/search-flights', async (req, res) => {
  const { origin, destination, departureDate, returnDate, adults } = req.query;

  if (!origin || !destination || !departureDate || !returnDate || !adults) {
    return res.status(400).json({ error: 'Missing required query parameters.' });
  }

  try {
    const accessToken = await fetchAccessToken();

    const searchParams = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      returnDate,
      adults,
      max: 5 // optional: limit to 5 results
    };

    const flights = await fetchFlightOffers(accessToken, searchParams);

    res.json({ data: flights });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching flights.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
