import * as mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    username: String,
})
    
const Like = mongoose.model('likes', likeSchema);

module.exports = Like;