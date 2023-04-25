const { Router } = require('express')
const User = require('../models/user')
const router = Router()


router.get('/signin', (req, resp) => {
    resp.render('signin')
})

router.get('/signup', (req, resp) => {
    resp.render('signup')
})

router.post('/signin', async (req, resp) => {
    const { email, password } = req.body
    try {

        const token = await User.matchPasswordAndGenerateTokens(email, password)
        resp.cookie('token', token)
        resp.redirect('/')

    } catch (error) {
        resp.render('signin', {
            error: 'Incorrect email or password'
        })

    }
})

router.post('/signup', async (req, resp) => {
    const { fullName, email, password } = req.body
    await User.create(
        {
            fullName,
            email,
            password
        }
    )
    resp.redirect('/')
})

router.get('/logout', (req, resp) => {
    resp.clearCookie('token').redirect('/')
})
module.exports = router