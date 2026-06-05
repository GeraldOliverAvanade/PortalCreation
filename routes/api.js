const express = require('express');
const axios = require('axios');
const { getToken } = require('../db/connection');

const router = express.Router();

const BASE_URL = `${process.env.DATAVERSE_URL}/api/data/v9.2`;
const TABLE = 'cr763_simpledvolivers';

async function getHeaders() {
  const token = await getToken();
  return {
    Authorization: `Bearer ${token}`,
    'OData-MaxVersion': '4.0',
    'OData-Version': '4.0',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/items', async (req, res) => {
  try {
    const headers = await getHeaders();
    const result = await axios.get(
      `${BASE_URL}/${TABLE}?$select=cr763_name,cr763_description`,
      { headers }
    );
    const items = result.data.value.map(r => ({
      name: r.cr763_name,
      description: r.cr763_description,
    }));
    res.json(items);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Dataverse error' });
  }
});

router.post('/items', async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  try {
    const headers = await getHeaders();
    await axios.post(`${BASE_URL}/${TABLE}`, {
      cr763_name: name,
      cr763_description: description || '',
    }, { headers });
    res.status(201).json({ message: 'Item created' });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Dataverse error' });
  }
});

module.exports = router;
