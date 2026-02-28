export function errorHandler(err, req, res, next) {
  console.error("Server Error:", err)
  res.status(500).json({ error: err.message })
}