const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/nodeauth');
const db = mongoose.connection;

// User Schema

const UserSchema = mongoose.Schema({
    username : {
        type : String,
        index : true
    },
    password : {
        type : String
    },
    email: {
        type : String
    },
    name : {
        type : String
    },
    profileimage: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);
module.exports.createUser = (newUser,callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};
module.exports.getUserById = (id, callback) => {
    User.findById(id,callback)
};

module.exports.getUserByUsername = (username, callback) => {
    User.findOne({username},callback);
};

module.exports.comparePassword = (candidatePassowrd,hash, callback) => {
    bcrypt.compare(candidatePassowrd, hash, function(err, isMatch) {
        callback(null,isMatch);
    });
};