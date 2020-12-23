const { Reshuffle } = require('reshuffle')
const { FirebaseConnector } = require('reshuffle-firebase-connector')

const app = new Reshuffle()
const fb = new FirebaseConnector(app, {
  credentials: process.env.FIREBASE_CREDENTIALS,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
})

const ref = fb.ref('myKey')
fb.on({ type: 'Value', ref }, (snapshot) => {
  console.log(`New value for key ${snapshot.key}: ${snapshot.val()}`)
})

app.start(8000)
setInterval(() => ref.set(Date.now()), 1000)
