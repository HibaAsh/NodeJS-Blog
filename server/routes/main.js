const express = require('express')
const router = express.Router()

const Blog = require('../models/Blog')

// Routes
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "Node JS - Blog",
      description: "Simple blog created with Node JS, Express & MongoDB."
    }

    let perPage = 5
    let page = req.query.page || 1
    
    // const blogs = await Blog.find()

    const blogs = await Blog.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec()

    const count = await Blog.countDocuments()
    const nextPage = parseInt(page) + 1
    const hasNextPage = nextPage <= Math.ceil(count / perPage)

    res.render('index', {
      locals,
      blogs,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    })

  } catch (error) {
    console.log(error)
  }
})

router.get('/about', (req, res) => {
  // res.send('Hello World!')

  res.render('about', { currentRoute: '/about' })
})

// Blog Routes
function insertBlogData() {
  const blogPosts = [
    {
      title: "10 Tips for Better JavaScript Code",
      body: "Learn how to write cleaner, more efficient JavaScript with these practical tips that will level up your coding skills."
    },
    {
      title: "Understanding Async/Await in Node.js",
      body: "A deep dive into asynchronous programming with async/await syntax and how it makes your code more readable."
    },
    {
      title: "MongoDB Indexing Strategies",
      body: "How to properly index your MongoDB collections to dramatically improve query performance."
    },
    {
      title: "Building a REST API with Express",
      body: "Step-by-step guide to creating a production-ready REST API using Express.js framework."
    },
    {
      title: "React Component Lifecycle Explained",
      body: "Complete breakdown of React component lifecycle methods and when to use each one."
    },
    {
      title: "CSS Grid vs Flexbox",
      body: "When to use CSS Grid versus Flexbox with practical examples of each layout method."
    },
    {
      title: "Authentication with JWT",
      body: "Implementing secure JSON Web Token authentication in your Node.js applications."
    },
    {
      title: "TypeScript Basics for JavaScript Developers",
      body: "Introduction to TypeScript fundamentals for developers familiar with JavaScript."
    },
    {
      title: "Deploying Node.js Apps to Heroku",
      body: "Complete walkthrough for deploying your Node.js application to Heroku cloud platform."
    },
    {
      title: "ES6 Features You Should Be Using",
      body: "Overview of the most useful ECMAScript 2015 (ES6) features that modern JavaScript developers need."
    },
    {
      title: "Mongoose CRUD Operations",
      body: "How to perform Create, Read, Update and Delete operations using Mongoose ODM."
    },
    {
      title: "State Management in React",
      body: "Comparing different state management solutions for React applications."
    },
    {
      title: "Docker for Node.js Developers",
      body: "Getting started with Docker containers for your Node.js applications."
    },
    {
      title: "Web Security Best Practices",
      body: "Essential security practices every web developer should implement."
    },
    {
      title: "GraphQL vs REST",
      body: "Comparing GraphQL and REST API architectures with their pros and cons."
    },
    {
      title: "Optimizing React Performance",
      body: "Practical techniques to make your React applications faster and more efficient."
    },
    {
      title: "Node.js Error Handling Patterns",
      body: "Best practices for handling errors in Node.js applications."
    },
    {
      title: "Building CLI Tools with Node.js",
      body: "How to create powerful command line interface tools using Node.js."
    },
    {
      title: "Microservices Architecture Basics",
      body: "Introduction to microservices architecture and when to use it."
    },
    {
      title: "Progressive Web Apps (PWA) Guide",
      body: "Complete guide to building Progressive Web Applications with modern web technologies."
    }
  ]

  Blog.insertMany(blogPosts)
}
// insertBlogData()

router.get('/blog/:id', async(req, res) => {
  try {
    let id = req.params.id
    const blog = await Blog.findById({ _id: id })

    const locals = {
      title: blog.title,
      description: `Simple description to ${blog.title} blog`
    }

    res.render('blog', {
      locals,
      blog,
      currentRoute: `/blog/${id}`
    })

  } catch (error) {
    console.log(error)
  }
})

// Search
router.post('/search', async(req, res) => {
  try {
    const locals = {
      title: "Node JS - Blog",
      description: "Simple blog created with Node JS, Express & MongoDB."
    }

    let searchTerm = req.body.searchTerm
    
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '')

    const blogs = await Blog.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
      ]
    })

    res.render('search', { locals, blogs })
    
  } catch (error) {
    console.log(error)
  }
})

module.exports = router