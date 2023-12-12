export type UserProfileType = {
    _id: String,
    username: String,
    profilePicture: String,
    cameras?: mongoose.Schema.type.ObjectId[],
    lenses?: mongoose.Schema.type.ObjectId[],
    framesList?: mongoose.Schema.type.ObjectId[],
    rollsList?: mongoose.Schema.type.ObjectId[],
    favorites?: mongoose.Schema.type.ObjectId[],
    followedUsers?: mongoose.Schema.type.ObjectId[]
};