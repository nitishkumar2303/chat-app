import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const userSchema = new mongoose.Schema({
    email: {
        type: String,   // Data type of the field (String)
        required: true, // Email is mandatory (cannot be null or undefined)
        unique: true,   // No two users can have the same email (ensures uniqueness)
        trim: true,     // Removes extra spaces before and after the email
        lowercase: true, // Converts email to lowercase automatically (e.g., NITISH@GMAIL.COM → nitish@gmail.com)
        minLength: [6, 'Email must be at least 6 characters'], // this means that if character is less than 6 then it would throw an error message
        maxLength: [50, 'Email can’t be larger than 50 characters'] // Maximum length of 50 characters with a custom error message
    },

    password:{
        type: String,
        select: false, // this hides the field from queries this would keep the password safe
    }



})

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10);
}

userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password , this.password);
}

userSchema.methods.generateJWT = function () {
    return jwt.sign({ email: this.email , _id:this._id }, process.env.JWT_SECRET ,{expiresIn: '1d'}); // this would generate a token for the user
};

const User = mongoose.model('user' , userSchema);

export default User;
// import bcrypt from 'bcrypt';