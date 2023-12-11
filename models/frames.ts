const frameSchema = mongoose.Schema({
    numero: Number,
    shutterSpeed: Number,
    aperture: Number,
    exposureValue: {required: false, Number}, 
    location: String,
    date: Date,
    weather: String,
    camera: { required: false, String },
    lens: { required: false, String },
    title: { required: false, String },
    comment: { required: false, String },
    favorite: { required: false, Boolean },
    share: { required: false, Boolean },
    categories: [{ required: false, String }],
    nbLikes: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'likes' }],
    commentaries: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'commentaries' }],
    phonePhoto: { required: false, String },
    argenticPhoto: { required: false, String },
})

const Frame = mongoose.model('frames', frameSchema);

module.exports = Frame;