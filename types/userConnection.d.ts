import { UserProfileType } from "./userProfile";

export type UserConnectionType = {
    _id: String,
    email: String,
    password: String,
    token: String,
    profile: UserProfileType
    // profile: { type: mongoose.Schema.Types.ObjectId, ref: 'userProfiles' }
};