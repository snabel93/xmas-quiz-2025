const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true  // removes whitespace
    },
    score: {
        type: Number,
        required: true,
        min: 0,     // score can't be negative
        max: 30     // since there are 25 questions
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Score', scoreSchema);
