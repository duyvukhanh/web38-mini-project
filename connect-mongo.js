const mongoose = require('mongoose')


const connectionString = `mongodb://admin:admin123@ds011281.mlab.com:11281/web38-mini-project`

mongoose.connect(
  connectionString,
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => {
    if(err) {
      console.error('Can not to mongodb!')
      console.error(err)
    } else {
      console.log('Connected to MongoDB!')
    }
  }
)