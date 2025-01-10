import pool from './db.js'

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT BIN_TO_UUID(id) AS id, contrasena FROM usuarios WHERE mail = ?', [email])
  return rows[0]
}

export const createUser = async (email, hashedPassword, fullName) => {
  await pool.query(
    'INSERT INTO usuarios (id, mail, contrasena, nombre_completo) VALUES (UUID_TO_BIN(UUID()), ?, ?, ?)',
    [email, hashedPassword, fullName]
  )
}

export const checkUserExists = async (email) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE mail = ?', [email])
  return rows.length > 0
}
