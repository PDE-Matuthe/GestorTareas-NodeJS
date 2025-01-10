import { Router } from 'express'
import { renderLoginPage, renderRegisterPage, handleRegister, handleLogin, handleLogout } from '../controllers/authController.js'
import { renderTareasPage, renderCrearTarea, registerTarea, deleteTareaById, updateTareaById, renderEditarTarea } from '../controllers/tareasController.js'

const router = Router()

router.get('/login', renderLoginPage)
router.post('/login', handleLogin)

router.get('/register', renderRegisterPage)
router.post('/register', handleRegister)

router.get('/', (req, res) => res.render('home', { title: 'Inicio' }))

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.usuarioId) {
    next()
  } else {
    req.session.redirectTo = req.originalUrl
    res.redirect('/login')
  }
}

router.get('/logout', isAuthenticated, handleLogout)

router.get('/tareas', isAuthenticated, renderTareasPage)
router.get('/editar/:id', isAuthenticated, renderEditarTarea)
router.post('/editar/:id', isAuthenticated, updateTareaById)

router.get('/crear', isAuthenticated, renderCrearTarea)
router.post('/crear', isAuthenticated, registerTarea)

router.get('/delete/:id', isAuthenticated, deleteTareaById)

router.use((req, res) => res.status(404).send('404'))

export default router
