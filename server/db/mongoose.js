
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todos');

mongoose.connection.on('open', function(){});

module.exports = {
    mongoose:mongoose
}