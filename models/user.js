const { createHmac, randomBytes } = require('node:crypto')
const mongoose = require('mongoose');

const { createTokenForUser } = require('../services/authentication');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImgUrl: {
        type: String,
        default: '/images/user.jpg'
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }

}, { timestamps: true })


//for hashing password
userSchema.pre('save', function (next) {
    const user = this

    if (!user.isModified('password')) return;

    const salt = randomBytes(16).toString()
    const hashedPassword = createHmac("sha256", salt).
        update(user.password).digest('hex')

    this.salt = salt
    this.password = hashedPassword

    next()
});

//for login 
userSchema.static('matchPasswordAndGenerateTokens', async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) throw new Error('user not found!')

    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedHash = createHmac("sha256", salt).
        update(password).digest('hex');

    if (hashedPassword !== userProvidedHash) throw new Error('incorrect password')

    const token = createTokenForUser(user)
    return token
})

module.exports = mongoose.model('users', userSchema)