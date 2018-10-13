
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
// {
//     email : 'lalit@gmail.com',
//     password : 'mypass123',
//     tokens : [{
//         access : 'auth',
//         token : 'jsjasdkncdkds'
//     }]
// }

var UserSchema = new mongoose.Schema({
    email : {
        type: String,
        minlength : 1,
        trim : true,
        required : true,
        unique : true,
        validate:{
            validator: validator.isEmail,
            message : '{VALUE} is not valid email'
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    tokens : [{
        access : {
            type : String,
            required : true
        },
        token : {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id : user._id.toHexString(), access}, 'abc123').toString();

     user.tokens.push({ access, token });
    //  when u return to chain in promise, u return another promise 
    // here we returning value, that value passed as success argument for next then call
    //user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(()=>{
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {   
        return Promise.reject();
    }
    
    return User.findOne({
        _id : decoded._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    });
}

UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (arr, hash) => {
                user.password = hash;
                next();
            });
        });   
    } else {
        next();
    }
});

var User = mongoose.model('user', UserSchema);

module.exports.User = User;