// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.statusCode = 200
  res.json({ name: process.env.SENDGRID_API_KEY })
  // res.json({ name: 'jo' })
}
