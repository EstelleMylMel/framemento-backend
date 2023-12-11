const categorySchema = mongoose.Schema({
    name: String,
    icon: String,
})

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;