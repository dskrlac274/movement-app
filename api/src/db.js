import sqlite from 'sqlite3'

sqlite.verbose()

let connection

export const testConnection = () => {
  return new Promise((resolve, reject) => {
    connection = new sqlite.Database('./database.db', (err) => {
      err ? reject() : resolve()
    })
  })
}

export const exec = async (sql, data) => {
  await connection.exec('PRAGMA foreign_keys = ON')

  return new Promise((resolve, reject) => {
    if (/^SELECT/i.test(sql)) {
      connection.all(sql, data, (err, res) => {
        err ? reject(err) : resolve(res)
      })
    } else {
      connection.run(sql, data, function (err) {
        return err ? reject(err) : resolve(this)
      })
    }
  })
}

export const close = () => {
  connection.close()
}
