const mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/intelligence-assessment-api', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// })

const uri = "mongodb+srv://gutierrpdev:XcJ3LI3UUUp4Umzd@intelligenceassessment-uibbp.mongodb.net/intelligence-assessment-events?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})