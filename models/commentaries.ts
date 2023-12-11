const commentarySchema = mongoose.Schema({
    username: String,
    text: String,
    date: Date
})
    
const Commentary = mongoose.model('commentaries', commentarySchema);

module.exports = Commentary;