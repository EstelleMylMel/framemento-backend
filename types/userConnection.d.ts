export type UserConnectionType = {
    email: String,
    password: String,
    token: String,
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'userProfiles' }
};