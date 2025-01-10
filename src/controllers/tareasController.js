import { getTareaByTareaId, getTareasByUsuarioId, getTareasBycategoria, createTarea, updateTarea, deleteTarea } from '../models/tareas.js'

export const renderTareasPage = async (req, res) => {
  const usuarioId = req.session.usuarioId

  const { categoria } = req.query // Obtener la categoría del filtro (si existe)

  let tareas
  if (categoria) {
    // Si hay una categoría, obtener las tareas filtradas
    tareas = await getTareasBycategoria(usuarioId, categoria)
  } else {
    // Si no hay filtro, obtener todas las tareas del usuario
    tareas = await getTareasByUsuarioId(usuarioId)
  }

  res.render('tareas', { title: 'Tareas', tareas })
}

export const renderCrearTarea = async (req, res) => {
  res.render('crear', { title: 'Crear tarea' })
}

export const registerTarea = async (req, res) => {
  const usuarioId = req.session.usuarioId
  const { titulo, categoria, descripcion } = req.body

  try {
    await createTarea(usuarioId, titulo, categoria, descripcion)
    res.redirect('/tareas')
  } catch (error) {
    console.error('Error al crear tarea:', error.message)
    res.status(500).send('Error interno del servidor.')
  }
}

export const deleteTareaById = async (req, res) => {
  const tareaId = req.params.id

  try {
    if (!tareaId) {
      return res.status(400).send('ID de tarea no proporcionado.')
    }

    await deleteTarea(tareaId)
    res.redirect('/tareas')
  } catch (error) {
    console.error('Error al eliminar tarea:', error.message)
    res.status(500).send('Error interno del servidor.')
  }
}

export const renderEditarTarea = async (req, res) => {
  const tareaId = req.params.id
  const tarea = await getTareaByTareaId(tareaId)
  res.render('editar', { title: 'Editar tarea', tarea })
}

export const updateTareaById = async (req, res) => {
  const tareaId = req.params.id
  const { titulo, categoria, descripcion } = req.body
  const completada = req.body.completada ? 1 : 0
  try {
    if (!tareaId) {
      return res.status(400).send('ID de tarea no proporcionado.')
    }

    await updateTarea(tareaId, titulo, categoria, descripcion, completada)
    res.redirect('/tareas')
  } catch (error) {
    console.error('Error al actualizar tarea:', error.message)
    res.status(500).send('Error interno del servidor.')
  }
}
