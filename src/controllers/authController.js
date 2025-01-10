import bcrypt from 'bcrypt'
import { findUserByEmail, createUser, checkUserExists } from '../models/users.js'

export const renderLoginPage = (req, res) => {
  const error = req.session.error || null // Obtener error desde la sesión si existe
  req.session.error = null // Limpiar el error de la sesión
  res.render('login', { title: 'Login', error }) // Pasar el error a la vista
}

export const renderRegisterPage = (req, res) => {
  const error = req.session.error || null
  req.session.error = null
  res.render('register', { title: 'Register', error })
}

export const handleRegister = async (req, res) => {
  const { email, password, fullName } = req.body

  try {
    const userExists = await checkUserExists(email)
    if (userExists) {
      req.session.error = 'Ese correo ya está registrado.'
      return res.redirect('/register')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await createUser(email, hashedPassword, fullName)

    const redirectTo = req.session.redirectTo || '/'
    delete req.session.redirectTo
    res.redirect(redirectTo)
  } catch (error) {
    console.error('Error durante el registro:', error.message)
    req.session.error = 'Error interno del servidor.'
    res.redirect('/register')
  }
}

export const handleLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await findUserByEmail(email)
    if (!user) {
      req.session.error = 'El usuario no existe.'
      return res.redirect('/login')
    }

    const match = await bcrypt.compare(password, user.contrasena)
    if (!match) {
      req.session.error = 'Usuario o contraseña incorrectos.'
      return res.redirect('/login')
    }

    req.session.usuarioId = user.id
    const redirectTo = req.session.redirectTo || '/'
    delete req.session.redirectTo
    res.redirect(redirectTo)
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error.message)
    req.session.error = 'Error interno del servidor.'
    res.redirect('/login')
  }
}

export const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error cerrando la sesión:', err.message)
      return res.status(500).send('Error cerrando la sesión.')
    }
    res.redirect('/')
  })
}
