const LIMIT_PER_SECONDS = 3

let _visitors = {}

// clearing every 10 seconds to not bloat memory with visit records
setInterval(() => {
  _visitors = {}
}, 10000)



/**
 * Middleware to limit API usage to 10 calls per seconds.
 * Sets req.apiLimit to true if above or to false if below
 */
export default function apiLimiter(req, res, next = null) {
  const uniqueVisitorId = req.uniqueVisitorId

  // adding an entry for this visitor
  if (!(uniqueVisitorId in _visitors)) {
    _visitors[uniqueVisitorId] = {}
  }

  // timestamp in seconds
  const now = ~~(Date.now() / 1000)

  // adding an entry for this timestamp
  if (!(now in _visitors[uniqueVisitorId])) {
    _visitors[uniqueVisitorId][now] = []
  }
  _visitors[uniqueVisitorId][now].push(1)

  if (_visitors[uniqueVisitorId][now].length > LIMIT_PER_SECONDS) {
    req.apiLimit = true
    res.statusCode = 429
    return res.json({ error: 'Too many requests' })
  } else {
    req.apiLimit = false
  }

  if (next) {
    next()
  }
}