const path = require('path');
const fs = require('fs');

// Path to the backend server relative to the api function
const backendPath = path.resolve(__dirname, '../backend/server.js');

module.exports = async (req, res) => {
  console.log(`[Vercel Wrapper] Request: ${req.method} ${req.url}`);
  console.log(`[Vercel Wrapper] Resolving backend at: ${backendPath}`);

  if (!fs.existsSync(backendPath)) {
    console.error(`[Vercel Wrapper Error] Backend server not found at: ${backendPath}`);
    return res.status(500).json({
      success: false,
      message: 'Backend module not found in serverless environment.',
      path: backendPath,
      dirContents: fs.readdirSync(path.resolve(__dirname, '..'))
    });
  }

  try {
    const app = require(backendPath);
    return await app(req, res);
  } catch (error) {
    console.error('[Vercel Wrapper Error] Failure during execution:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error in API Wrapper',
      error: error.message,
      stack: error.stack
    });
  }
};
