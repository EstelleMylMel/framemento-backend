import * as mongoose from 'mongoose';

const rollSchema = new mongoose.Schema({
    name: String,
    rollType: String,
    images: Number,
    pushPull: {required: false, Number},
    camera: {required: false,String},
    framesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'frames' }]
});
    
const Roll = mongoose.model('rolls', rollSchema);

module.exports = Roll;