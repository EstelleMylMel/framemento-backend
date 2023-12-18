import * as mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: String,
})

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;