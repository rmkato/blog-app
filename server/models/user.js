const bcrypt = require('bcrypt');
const mongoose = require("mongoose")

var userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    cookie: {
        type: String,
        required: false
    }
})

let SALT = 10;

// .pre() hashes password with bcrypt before inserting it into the database
userSchema.pre('save', function(next){
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(SALT, function(err, salt){
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash){
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(candidatePassword, checkpassword) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return checkpassword(err);
        checkpassword(null, isMatch);
        return (isMatch ? true : false);
    })
}

// Export the schema 
module.exports = mongoose.model('UserSchema', userSchema);