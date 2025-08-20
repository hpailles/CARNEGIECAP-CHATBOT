// Basic serverless endpoint to prove the backend is alive
module.exports = (req, res) => {
  // CORS to allow your GoDaddy site to call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.status(200).json({ ok: true, time: new Date().toISOString() });
};
