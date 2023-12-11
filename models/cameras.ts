const cameraSchema = mongoose.Schema({
    brand: String,
    model: String,
    shared: Boolean, 
});
    
const Camera = mongoose.model('cameras', cameraSchema);

module.exports = Camera;