const mongoose = require('mongoose')
const { Schema } = mongoose

const authorSchema = new Schema({
  name: String,
  age: Number
});

//using mongoose as modeling environment(to communictae wuth and shape your data-something like Sequalize and postgrel)
//mongose is ODM Object Documet Mapper
//and SEqualize id Object Relational mapper
//Postrgress is system that talks to SQ database


// Using Schema to create a model-Book(table, collection)
module.exports = mongoose.model('Author', authorSchema);
