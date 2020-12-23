# reshuffle-firebase-connector

[Code](https://github.com/reshufflehq/reshuffle-firebase-connector) |
[npm](https://www.npmjs.com/package/reshuffle-firebase-connector) |
[Code sample](https://github.com/reshufflehq/reshuffle-firebase-connector/examples)

`npm install reshuffle-firebase-connector`

### Reshuffle Firebase Connector

This package contains a [Reshuffle](https://dev.reshuffle.com)
connector to [Google Firebase](https://firebase.google.com).

The following example tracks values in the Firebase realtime database:

```js
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
```

#### Table of Contents

[Configuration](#configuration) Configuration options

[Types](#types) TypeScript types

_Connector events_:

[ChildAdded](#ChildAdded) Child added to key

[ChildChanged](#ChildChanged) Child changed

[ChildMoved](#ChildMoved) Child moved

[ChildRemoved](#ChildRemoved) Child removed

[Value](#Value) Value changed

_Connector actions_:

[database](#database) Get the realtime database

[ref](#ref) Get a key reference in the realtime database

##### <a name="configuration"></a>Configuration options

```js
const app = new Reshuffle()
const firebaseConnector = new FirebaseConnector(app, {
  credentials: process.env.FIREBASE_CREDENTIALS,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
})
```

Credentials can be an object or a JSON string with service account
credentials that can be downloaded from the Firebase admin console.
See the `Credentials` interface exported from the connector for details.

The `databaseURL` is a string provided by Firebase.

##### <a name="types"></a>TypeScript types

The following types are exported from the connector:

* **interface FirebaseCredentials** Google service account credentials
* **interface FirebaseConnectorOptions** Connector configuration options
* **type FirebaseEventType** Supported events
* **interface FirebaseEventOptions** Event options
* **type FirebaseSnapshot** Data snapshot used as event handler argument
* **class FirebaseConnector** Connector class

#### Connector events

##### <a name="ChildAdded"></a>Child Added event

_Event options:_

```ts
type: 'ChildAdded'
ref: firebase.database.Reference | string
```

_Event object:_

Firebase's [snapshot object](https://firebase.google.com/docs/reference/node/firebase.database.DataSnapshot)

_Example:_

```js
firebaseConnector.on({ type: 'ChildAdded', ref: 'mkKey' }, (snapshot) => {
  console.log(`${snapshot.key} = ${snapshot.val()}`)
})
```

Child added in the realtime database. Learn more [here](https://firebase.google.com/docs/database/admin/retrieve-data#child-added).

##### <a name="ChildChanged"></a>Child Changed event

_Event options:_

```ts
type: 'ChildChanged'
ref: firebase.database.Reference | string
```

_Event object:_

Firebase's [snapshot object](https://firebase.google.com/docs/reference/node/firebase.database.DataSnapshot)

_Example:_

```js
firebaseConnector.on({ type: 'ChildChanged', ref: 'mkKey' }, (snapshot) => {
  console.log(`${snapshot.key} = ${snapshot.val()}`)
})
```

Child changed in the realtime database. Learn more [here](https://firebase.google.com/docs/database/admin/retrieve-data#child-changed).

##### <a name="ChildMoved"></a>Child Moved event

_Event options:_

```ts
type: 'ChildMoved'
ref: firebase.database.Reference | string
```

_Event object:_

Firebase's [snapshot object](https://firebase.google.com/docs/reference/node/firebase.database.DataSnapshot)

_Example:_

```js
firebaseConnector.on({ type: 'ChildMoved', ref: 'mkKey' }, (snapshot) => {
  console.log(`${snapshot.key} = ${snapshot.val()}`)
})
```

Child moved in the realtime database. Learn more [here](https://firebase.google.com/docs/database/admin/retrieve-data#child-moved).

##### <a name="ChildRemoved"></a>Child Removed event

_Event options:_

```ts
type: 'ChildRemoved'
ref: firebase.database.Reference | string
```

_Event object:_

Firebase's [snapshot object](https://firebase.google.com/docs/reference/node/firebase.database.DataSnapshot)

_Example:_

```js
firebaseConnector.on({ type: 'ChildRemoved', ref: 'mkKey' }, (snapshot) => {
  console.log(`${snapshot.key} = ${snapshot.val()}`)
})
```

Child removed from the realtime database. Learn more [here](https://firebase.google.com/docs/database/admin/retrieve-data#child-removed).

##### <a name="Value"></a>Value event

_Event options:_

```ts
type: 'Value'
ref: firebase.database.Reference | string
```

_Event object:_

Firebase's [snapshot object](https://firebase.google.com/docs/reference/node/firebase.database.DataSnapshot)

_Example:_

```js
firebaseConnector.on({ type: 'Value', ref: 'mkKey' }, (snapshot) => {
  console.log(`${snapshot.key} = ${snapshot.val()}`)
})
```

Value changed in the realtime database. Learn more [here](https://firebase.google.com/docs/database/admin/retrieve-data#value).

#### Connector actions

##### <a name="database"></a>Database action

_Definition:_

```ts
() => firebase.database.Database
```

_Usage:_

```js
const database = firebaseConnector.database()
```

Get the realtime database object.

##### <a name="ref"></a>Ref action

_Definition:_

```ts
(
  path: string,
) => firebase.database.Reference
```

_Usage:_

```js
firebaseConnector.ref('myKey').set('myValue')
```

Get a key reference in the realtime database.
