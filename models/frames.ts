import * as mongoose from 'mongoose';

const frameSchema = new mongoose.Schema({
    numero: Number,
    shutterSpeed: Number,
    aperture: Number,
    exposureValue: { required: false, type: Number }, 
    location: String,
    date: Date,
    weather: String,
    camera: { required: false, type: String },
    lens: { required: false, type: String },
    title: { required: false, type: String },
    comment: { required: false, type: String },
    favorite: { required: false, type: Boolean },
    share: { required: false, type: Boolean },
    categories: [{ required: false, type: String }],
    nbLikes: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'likes' }],
    commentaries: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'commentaries' }],
    phonePhoto: { required: false, type: String },
    argenticPhoto: { required: false, type: String },
})

const Frame = mongoose.model('frames', frameSchema);

module.exports = Frame;