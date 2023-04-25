const { Router } = require('express')
const router = Router()
const Blog = require('../models/blog')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()} - ${file.originalname}`;
        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })

router.get('/addBlogs', (req, resp) => {
    resp.render('addBlogs', {
        user: req.user
    })
})

router.get('/:id', async (req, resp) => {
    const blog = await Blog.findById(req.params.id)
    // console.log(blog)
    return resp.render('blog', {
        user: req.user,
        blog
    })
})

router.post('/', upload.single('coverImage'), async (req, resp) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBY: req.user._id,
        coverImageURL: `uploads/${req.file.filename}`
    })
    resp.redirect(`/blog/${blog._id}`)
})

module.exports = router