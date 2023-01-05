import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.end(`Hello! Welcome to Calibre GraphQL API. Go to this link: <a href="https://calibre-server.vercel.app/api">API</a>`)
})

export default router
