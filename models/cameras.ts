import * as mongoose from 'mongoose';

const cameraSchema = new mongoose.Schema({
    brand: String,
    model: String,
    shared: Boolean, 
});
    
const Camera = mongoose.model('cameras', cameraSchema);

module.exports = Camera;