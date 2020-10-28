const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    // required: [true,'Name is required']
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true,
    index: true,
    required: [true, 'email is required'],
    validate: {
        validator: function(v) {
            /* eslint-disable no-useless-escape */
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
    },
  },
  password:{
    type: String,
    trim: true,
    required: [true,'Password is required'],
    select:false
  }
},{
  timestamps : true
});

UserSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    } // Adding this statement solved the problem!!

    bcrypt.genSalt(5, function(err, salt){
        if (err){ return next(err) }

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err){return next(err)}

            user.password = hash;
            next();
        })
    })
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

mongoose.plugin(schema => {
  schema.pre('findOneAndUpdate', setRunValidators);
  schema.pre('updateMany', setRunValidators);
  schema.pre('updateOne', setRunValidators);
  schema.pre('update', setRunValidators);
});

function setRunValidators() {
  this.setOptions({ runValidators: true });
}

var User = mongoose.model("users", UserSchema);

User.syncIndexes();

module.exports = { User };
