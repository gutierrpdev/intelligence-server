const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

// const uri = "mongodb+srv://gutierrpdev:XcJ3LI3UUUp4Umzd@intelligenceassessment-uibbp.mongodb.net/intelligence-assessment-events?retryWrites=true&w=majority";
// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// })