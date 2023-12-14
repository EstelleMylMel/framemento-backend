export type UserProfileType = Document & {
    _id: string,
    username: string,
    profilePicture: string,
    cameras?: mongoose.Schema.type.ObjectId[],
    lenses?: mongoose.Schema.type.ObjectId[],
    framesList?: mongoose.Schema.type.ObjectId[],
    rollsList?: mongoose.Schema.type.ObjectId[],
    favorites?: mongoose.Schema.type.ObjectId[],
    followedUsers?: mongoose.Schema.type.ObjectId[]
};