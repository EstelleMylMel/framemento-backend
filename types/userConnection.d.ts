export type UserConnectionType = {
    _id: String,
    email: String,
    password: String,
    token: String,
    profile: mongoose.Schema.type.ObjectId
    // profile: { type: mongoose.Schema.Types.ObjectId, ref: 'userProfiles' }
};