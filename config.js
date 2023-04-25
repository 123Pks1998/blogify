const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL).then((e) => console.log('mongodb connected'))