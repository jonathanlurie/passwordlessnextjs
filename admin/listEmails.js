require('dotenv').config()
const lmdbStore = require('lmdb-store')

const subDBname = 'emails'

function list() {
  const db = lmdbStore.open({
    path: process.env.DB_FILENAME,
    compression: true ,
  })

  // store where each key is an email and the associated values is the uuid of corresponding user
  const subDB = db.openDB(subDBname,
  {
    compression: true, 
  })



  subDB.getRange({})
    .forEach(({ key, value }) => {
        console.log(key, value)
    })

  // for (let { key, value } of subDB.getRange({})) {
  //   console.log(key, value)
  // }
}


async function put() {
  const db = lmdbStore.open({
    path: process.env.DB_FILENAME,
    compression: true ,
    // name: 'emails',
  })

  // store where each key is an email and the associated values is the uuid of corresponding user
  const subDB = db.openDB(subDBname,
  {
    compression: true, 
  })

  await subDB.put('someKey', 'someValue')

}



async function get() {
  const db = lmdbStore.open({
    path: process.env.DB_FILENAME,
    compression: true ,
    // name: 'emails',
  })

  // store where each key is an email and the associated values is the uuid of corresponding user
  const subDB = db.openDB(subDBname,
  {
    compression: true, 
  })

  const value = subDB.get('someKey')
  console.log(value)
}

// put()
// get()
list()