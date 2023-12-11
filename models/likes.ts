const likeSchema = mongoose.Schema({
    username: String,
})
    
const Like = mongoose.model('likes', likeSchema);

module.exports = Like;