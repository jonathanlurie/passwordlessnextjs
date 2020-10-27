import DB from '../../core/backend/DB'


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  DB.test2()
  
  const body = JSON.parse(req.body)
  console.log(body)

  res.statusCode = 200
  res.json({ name: 'jo' })
}
