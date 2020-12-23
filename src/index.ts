import objhash from 'object-hash'
import firebase from 'firebase-admin'
import { Reshuffle } from 'reshuffle-base-connector'
import { CoreConnector, CoreEventHandler } from './CoreConnector'

type Obj = Record<string, any>

export interface FirebaseCredentials {
  type: 'service_account'
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}

export interface FirebaseConnectorOptions {
  credentials: FirebaseCredentials | string
  databaseURL: string
}

const EventTypes: Record<string, string> = {
  ChildAdded: 'child_added',
  ChildChanged: 'child_changed',
  ChildMoved: 'child_moved',
  ChildRemoved: 'child_removed',
  Value: 'value',
}

export type FirebaseEventType =
  | 'ChildAdded'
  | 'ChildChanged'
  | 'ChildMoved'
  | 'ChildRemoved'
  | 'Value'

export interface FirebaseEventOptions {
  type: FirebaseEventType
  ref: firebase.database.Reference | string
}

export type FirebaseSnapshot = firebase.database.DataSnapshot

export class FirebaseConnector extends CoreConnector {
  private databaseURL: string
  private fb: firebase.app.App
  private eventHashes: Record<string, boolean> = {}

  constructor(app: Reshuffle, options: FirebaseConnectorOptions, id?: string) {
    super(app, options, id)

    const cred = validateCredentials(options.credentials)
    this.databaseURL = validateURL(options.databaseURL)

    this.fb = firebase.initializeApp({
      credential: firebase.credential.cert(cred),
      databaseURL: this.databaseURL,
    })
  }

  // Events /////////////////////////////////////////////////////////

  public on(
    options: FirebaseEventOptions,
    handler: CoreEventHandler,
    eventId?: string,
  ) {
    if (!(options.type in EventTypes)) {
      throw new Error(`Invalid event type: ${options.type}`)
    }

    const [ref, refstr] = this.getReference(options.ref)

    const desc = { databaseURL: this.databaseURL, refstr, type: options.type }
    const hash = objhash(desc)
    if (!this.eventHashes[hash]) {
      ref.on(EventTypes[options.type], (snapshot: FirebaseSnapshot) => {
        void this.eventManager.fire(
          (ec) =>
            ec.options.type === options.type &&
            ec.options.refstr === refstr,
          snapshot,
        )
      })
      this.eventHashes[hash] = true
    }

    return this.eventManager.addEvent(
      { type: options.type, refstr },
      handler,
      eventId || desc,
    )
  }

  private getReference(ref: firebase.database.Reference | string) {
    if (typeof ref === 'string') {
      return [this.ref(ref), ref]
    }
    if (typeof ref === 'object' && ref.constructor.name === 'Reference') {
      return [ref, (ref as any).path.pieces_.join('/')]
    }
    throw new Error(`Invalid reference: ${ref}`)
  }

  // Actions ////////////////////////////////////////////////////////

  public database(): firebase.database.Database {
    return this.fb.database()
  }

  public ref(path: string): firebase.database.Reference {
    return this.database().ref(path)
  }
}

function validateCredentials(credentials: FirebaseCredentials | string): Obj {
  if (typeof credentials === 'string') {
    credentials = JSON.parse(credentials)
  }
  if (
    typeof credentials !== 'object' ||
    credentials.type !== 'service_account'
  ) {
    throw new Error('Invalid credentials')
  }
  return credentials
}

const URLRE = new RegExp(
  '^https?:\\/\\/([^:]+(:[^@]+)?@)?[0-9a-zA-Z_-]+' +
  '(\\.[0-9a-zA-Z_-]+)*(\\/[\\.0-9a-zA-Z_-]+)*\\/?$'
)

function validateURL(url: string): string {
  if (!URLRE.test(url)) {
    throw new Error(`Invalid URL: ${url}`)
  }
  return url
}
