const express = require('express');
const graphqlHTTP = require('express-graphql');

const schema = require('./schema/schema');
const mongoose = require('mongoose');

const cors = require('cors');

// Set up port
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

const app = express();

// allow cross-origin requests
app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

mongoose.connect(`
    mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@studiome-server-1-1sjpe.gcp.mongodb.net/test?retryWrites=true&w=majority
`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(port);
    console.log('connected and listening on port 4000')
})
.catch(err => {
    console.log(err)
})