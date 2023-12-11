import * as mongoose from 'mongoose';

const commentarySchema = new mongoose.Schema({
    username: String,
    text: String,
    date: Date
})
    
const Commentary = mongoose.model('commentaries', commentarySchema);

module.exports = Commentary;