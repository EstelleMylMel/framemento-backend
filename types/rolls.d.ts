export type RollType = Document & {
    _id: String,
    name: String,
    rollType: String,
    images: Number,
    pushPull?: Number,
    camera?: mongoose.Schema.type.ObjectId,
    framesList?: mongoose.Schema.type.ObjectId[]
};

// Ajout de _id pour être conforme avec TS