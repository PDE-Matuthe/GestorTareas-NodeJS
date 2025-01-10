import pool from './db.js'

export const getTareaByTareaId = async (tareaId) => {
  const [rows] = await pool.query(
    'SELECT BIN_TO_UUID(id) as id, titulo, categoria, descripcion, completada FROM tareas WHERE BIN_TO_UUID(id) = ?',
    [tareaId]
  )
  return rows[0]
}

export const getTareasByUsuarioId = async (usuarioId) => {
  const [rows] = await pool.query(
    'SELECT BIN_TO_UUID(id) as id, titulo, categoria, descripcion, completada FROM tareas WHERE usuario_id = UUID_TO_BIN(?) ORDER BY id DESC',
    [usuarioId]
  )
  return rows
}

export const getTareasBycategoria = async (usuarioId, categoria) => {
  const [rows] = await pool.query(
    'SELECT titulo, categoria, descripcion, completada FROM tareas WHERE usuario_id = UUID_TO_BIN(?) AND categoria = ?',
    [usuarioId, categoria]
  )
  return rows
}

export const createTarea = async (usuarioId, titulo, categoria, descripcion) => {
  await pool.query(
    'INSERT INTO tareas (usuario_id, titulo, categoria, descripcion) VALUES (UUID_TO_BIN(?), ?, ?, ?)',
    [usuarioId, titulo, categoria, descripcion]
  )
}

export const updateTarea = async (tareaId, titulo, categoria, descripcion, completada) => {
  await pool.query('UPDATE tareas SET titulo = ?, categoria = ?, descripcion = ?, completada = ? WHERE BIN_TO_UUID(id) = ?',
    [titulo, categoria, descripcion, completada, tareaId]
  )
}

export const deleteTarea = async (tareaId) => {
  await pool.query('DELETE FROM tareas WHERE BIN_TO_UUID(id) = ?', [tareaId])
}
