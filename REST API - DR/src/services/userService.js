import { User } from "../model/User.js";
import bcrypt from 'bcrypt';
import * as jwt from '../lib/jwt.js';
import 'dotenv/config';

export const getProfile = (userId) => User.findById(userId);
export const updateProfileAvatar = (userId, imagePath) => User.findByIdAndUpdate(userId, { image: imagePath });
export const deleteProfile = (userId) => User.findByIdAndDelete(userId);

const generateToken = async (userData) => {
    const payload = { email: userData.email, username: userData.username, _id: userData._id };

    return await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
}

export const register = async (userData) => {
    const { email, username, password, rePass } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error('The email address or username you entered is already associated with an existing account.');
    }

    if (password !== rePass) {
        throw new Error('Passwords do not match: The password and confirm password fields must be identical.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({ email, username, password: hashedPassword });

    const accessToken = await generateToken(newUser);

    return {
        email: newUser.email,
        username: newUser.username,
        _id: newUser._id,
        accessToken
    };;
}

export const login = async (loginData) => {
    const { email, password } = loginData;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        throw new Error('Invalid credentials. Please try again.');
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials. Please try again.');
    }

    const accessToken = await generateToken(existingUser);

    return {
        email: existingUser.email,
        username: existingUser.username,
        _id: existingUser._id,
        accessToken
    };
}
export const updateProfile = async (userId, updatedProfile) => {
    if (!updatedProfile.password) {
        throw new Error('Failed to update profile. Please check your input and try again.');
    }

    if (updatedProfile.password !== updatedProfile.rePass) {
        throw new Error('Passwords do not match: The password and confirm password fields must be identical.');
    }

    const hashedPassword = await bcrypt.hash(updatedProfile.password, 12);

    updatedProfile.password = hashedPassword;

    return User.findByIdAndUpdate(userId, updatedProfile);
};
