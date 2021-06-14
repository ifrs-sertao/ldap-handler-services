const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

const routes = require('./routes');

app.use(cors());

// Set default API response
app.get('/', (req, res) => {
    res.json({
      status: 'API Is Working',
      message: 'API REST LDAP DATA HANDLE ',
    });
  });

app.use('/api/v1', routes);

module.exports = app;