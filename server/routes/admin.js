const express = require('express')
const router = express.Router()

const Blog = require('../models/Blog')
const User = require('../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET

// auth middleware
const authMiddleWare = (req, res, next) => {
  const token = req.cookies.token

  if(!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.userId = decoded.userId
    next()

  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

// Admin - Page
router.get('/admin', async (req, res) => {
  try {
    const locals = {
      title: "admin dashboard",
      description: "Welcome to admin dashboard."
    }

    res.render('admin/index', { locals, layout: adminLayout })

  } catch (error) {
    console.log(error)
  }
})

// // Admin - Check Login
router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body

    // if((username === 'admin') && (password === 'password')) {
    //   res.send('You are logged in.')
    // }
    // else {
    //   res.send('Wrong username or password.')
    // }

    const user = await User.findOne({ username })

    if(!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret)
    res.cookie('token', token, { httpOnly: true })

    res.redirect('/dashboard')

    // res.render('admin/index', { layout: adminLayout })

  } catch (error) {
    console.log(error)
  }
})

// Admin - Regitser
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    // if((username === 'admin') && (password === 'password')) {
    //   res.send('You are logged in.')
    // }
    // else {
    //   res.send('Wrong username or password.')
    // }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const user = await User.create({ username, password: hashedPassword })
      res.status(201).json({ message: 'User created', user })

    } catch (error) {

      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use' })
      }

      res.status(500).json({ message: 'Internal server error' })
    }

    // res.render('admin/index', { layout: adminLayout })

  } catch (error) {
    console.log(error)
  }
})

// Admin - Logout
router.get('/logout', (req, res) => {
  try {
    res.clearCookie('token')

    // res.json({ message: 'Logged out successfully !' })
    res.redirect('/')
    
  } catch (error) {
    console.log(error)
  }
})

// Admin - Dashboard
router.get('/dashboard', authMiddleWare, async (req, res) => {

  try {
    const locals = {
      title: 'Dashboard',
      description: 'Admin dashboard'
    }

    const blogs = await Blog.find()

    res.render('admin/dashboard', {
      locals,
      blogs,
      layout: adminLayout
    })

  } catch (error) {
    console.log(error)
  }
})

// Admin - Blog
router.get('/add-blog', authMiddleWare, async(req, res) => {
  try {
    const locals = {
      title: 'Add Blog',
      description: 'Add blog via admin dashboard'
    }

    res.render('admin/add-blog', {
      locals,
      layout: adminLayout
    })
    
  } catch (error) {
    console.log(error)
  }
})

// Admin - create new Blog
router.post('/add-blog', authMiddleWare, async(req, res) => {
  try {
    const { title, body } = req.body

    try {
      const newBlog = new Blog({
        title: title,
        body: body
      })

      await Blog.create(newBlog)
      res.redirect('/dashboard')
      
    } catch (error) {
      console.log(error)
    }
    
  } catch (error) {
    console.log(error)
  }
})

// Admin - edit Blog
router.put('/edit-blog/:id', authMiddleWare, async(req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    })

    res.redirect(`/edit-blog/${req.params.id}`)
    
  } catch (error) {
    console.log(error)
  }
})

router.get('/edit-blog/:id', authMiddleWare, async(req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id })

    const locals = {
      title: blog.title,
      description: `Edit ${blog.title} blog`
    }

    res.render('admin/edit-blog', {
      locals,
      blog,
      layout: adminLayout
    })
    
  } catch (error) {
    console.log(error)
  }
})

// Admin - delete Blog
router.delete('/delete-blog/:id', authMiddleWare, async(req, res) => {
  try {
    await Blog.deleteOne({ _id: req.params.id })

    res.redirect('/dashboard')
    
  } catch (error) {
    console.log(error)
  }
})

module.exports = router