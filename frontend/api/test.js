require('dotenv').config();
module.exports = (req, res) => {
  res.status(200).json({ 
    message: "API routing is operational.",
    method: req.method,
    url: req.url,
    query: req.query,
    headers: req.headers
  });
};
