import Database from './db';
import * as dotenv from 'dotenv';

export async function testDBConnection() {
  await reloadDotEnv()
  let db = new Database()
  console.log('ESS->DB Connection test')

  let status = await db.testConnection()
    .then(() => {
      return { error: null, message: `Connection test: Successful!` }
    })
    .catch(err => {
      // return { error: err, message: `Connection test: failed! ${err.code}` }
      return { error: err, message: err }
    })

  return status
}

export async function reloadDotEnv() {
  await dotenv.config()
}