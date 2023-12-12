export type RollType = Document & {
    _id: String,
    name: String,
    rollType: String,
    images: Number,
    pushPull: {required: false, Number},
    camera: {required: false,String},
    framesList: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'frames' }]
};

// Ajout de _id pour être conforme avec TS