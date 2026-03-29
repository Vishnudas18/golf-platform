require('dotenv').config();
const app = require('./backend/server');

module.exports = (req, res) => {
  try {
    return app(req, res);
  } catch (error) {
    console.error('API Invocation Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
