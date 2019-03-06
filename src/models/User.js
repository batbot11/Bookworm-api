import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    email: {type: String, required: true, lowercase: true, createIndexes: true, unique: true},
    passwordHash: {type: String, required: true},
    confirmed: {type: Boolean, default: false},
    confirmationToken: {type: String, default: ""}
}, {timestamps: true});

schema.methods.isValidPassword = function isValidPassword(password) {
  return  bcrypt.compareSync(password, this.passwordHash)
}

schema.methods.generateJWT = function generateJWT() {
    return jwt.sign({email: this.email,
    confirmed: this.confirmed
    }, process.env.JWT_SECRET)
}

schema.methods.setPassword = function setPassword(password) {
  return this.passwordHash = bcrypt.hashSync(password, 10)
}
schema.methods.setConfirmationToken = function setConfirmationToken() {
  return this.confirmationToken = this.generateJWT()
}

schema.methods.generateConfirmationURL = function generateConfirmationURL() {
  return `${process.env.HOST}/confirmation/${this.confirmationToken}`
}

schema.methods.toAuthJson = function toAuthJson() {
    return {
        email: this.email,
        token: this.generateJWT(),
        confirmed: this.confirmed
    }
}

schema.plugin(uniqueValidator, {message: "This Username is already Taken!"});

export default mongoose.model("User", schema);