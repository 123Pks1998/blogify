require('dotenv').config()

const express = require('express')
const userRouter = require('./routers/user')
const blogRouter = require('./routers/blog')
const Blogs = require('./models/blog')
const path = require('path')
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require('./middleware/authentication')
const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())
require('./config')

app.set("view engine", "ejs")
app.set("views", path.resolve('./views'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))

app.get('/', async (req, resp) => {
    const allBlogs = await Blogs.find({})
    resp.render('home', {
        user: req.user,
        blogs: allBlogs
    })
})

app.use('/user', userRouter)
app.use('/blog', blogRouter)

app.listen(PORT, () => console.log('server is running'))
