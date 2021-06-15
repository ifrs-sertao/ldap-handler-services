const express = require('express');
const cors = require('cors');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

const routes = require('./routes');

app.use(cors());

// Set default API response
app.get('/', (req, res) => {
    res.json({
      status: 'API Is Working',
      message: 'API REST LDAP HANDLER SERVICES ',
    });
  });

app.use('/api/v1', routes);

module.exports = app;