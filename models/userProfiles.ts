//const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema({
    username: String,
    profilePicture: String,
    camera: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'cameras' }],
    lenses: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'lenses' }],
    framesList: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'frames' }],
    rollsList: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'rolls' }],
    favorites: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'frames' }],
    followedUsers: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'userProfiles' }]
});
    
const UserProfile = mongoose.model('userProfiles', userProfileSchema);

module.exports = UserProfile;