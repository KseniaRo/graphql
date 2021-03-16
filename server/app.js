const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

//aloow cross-origin requests
app.use(cors())


// connect to mogodb Atlas
// make sure to replce db string and creds with my own

mongoose
  .connect(
    "mongodb+srv://ksenia:Code123@graphql-netninja.70lyi.mongodb.net/graphql-practice-?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.log("Error: ", err.message));






// mongoose.connect('mongodb://localhost/graphQL-netNinja',
//   //to get rid of warnings...
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
// mongoose.connection.once('open', function () {
//   console.log('Connection has been made, now make fireworks...');

// }).on('error', function (error) {
//   console.log('Connection error:', error);
// });




app.use('/graphql', graphqlHTTP({
  schema, // just schema bc names are the same
  graphiql: true
}))

app.listen(4000, () => {
  console.log('now listening for requests on port 4000')
})
