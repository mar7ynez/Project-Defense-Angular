import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Invalid email adress!'],
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minLength: [6, 'Username must be atleast 6 characters long!']
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minLength: [8, 'Password must be atleast 8 characters long!']
    }
});

export const User = mongoose.model('User', userSchema);