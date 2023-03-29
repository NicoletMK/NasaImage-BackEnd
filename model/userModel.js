const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirm_password: { type: String, required: true },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    console.log(this.password, 'password');
    this.password = await bcrypt.hash(this.password, 10); // current password 

    this.confirm_password = await bcrypt.hash(this.confirm_password, 10);
  }
  next(); //This next line auth.js save() method call will be done
});
// jwt token generating
userSchema.methods.generateAuthToken = async function () {
  try {
    let mytoken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: mytoken });
    await this.save();
    return mytoken;
  } catch (err) {
    console.log(err);
  }
};
//hack the password before saving it
const User = mongoose.model('user', userSchema);
module.exports = User;
