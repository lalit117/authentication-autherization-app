
var mongoose = require('mongoose');

var ToDo = mongoose.model('ToDo',{
    text: {
        type: String,
        required : true,
        minlengrh : 1,
        trim : true  // remove leading training white spaces
    },
    complted:{
        type:Boolean,
        default : false
    },
    completedAt:{
        type: Number,
        default : null
    }
});

module.exports = ToDo;