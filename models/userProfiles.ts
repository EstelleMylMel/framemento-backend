//const mongoose = require('mongoose');
import * as mongoose from 'mongoose';

import {UserProfileType } from '../types/userProfile';

const userProfileSchema = new mongoose.Schema<UserProfileType>({
    username: String,
    profilePicture: String,
    cameras: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'cameras' }],
    lenses: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'lenses' }],
    framesList: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'frames' }],
    rollsList: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'rolls' }],
    favorites: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'frames' }],
    followedUsers: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'userProfiles' }]
});
    
const UserProfile: mongoose.Model<UserProfileType> = mongoose.model<UserProfileType>('userProfiles', userProfileSchema);

module.exports = UserProfile;