import { UserProfileType } from "./userProfile";

export type UserConnectionType = Document & {
    _id: string,
    email: string,
    password: string,
    token: string,
    profile: UserProfileType
};