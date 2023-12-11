//const mongoose: any = require('mongoose');
import * as mongoose from 'mongoose';

const userConnectionSchema = new mongoose.Schema({
    email: String,
    password: String,
    token: String,
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'userProfiles' }
});
    
const UserConnection = mongoose.model('userConnections', userConnectionSchema);

module.exports = UserConnection;