const lensSchema = mongoose.Schema({
    brand: String,
    model: String,
    shared: Boolean, 
});
   
const Lens = mongoose.model('lenses', lensSchema);

module.exports = Lens;