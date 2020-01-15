const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const impressionSchema = new Schema({
    date: String,
    productId: String
})

module.exports = mongoose.model('Impression', impressionSchema);