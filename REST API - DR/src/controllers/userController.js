import { Router } from 'express';
import * as userService from '../services/userService.js';
import { storage } from '../helpers/storage.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { getErrorMsg } from '../utilities/errorUtility.js';

const userController = Router();

userController.post('/register', async (req, res) => {
    try {
        const registeredUser = await userService.register(req.body);
        res.cookie('auth', registeredUser.accessToken, { httpOnly: true });
        res.status(201).json({ message: 'User registered successfully.', user: registeredUser });
    } catch (error) {
        res.status(401).json({ error: getErrorMsg(error) || 'Failed to register user. Please check your input and try again.' });
    }
});

userController.post('/login', async (req, res) => {
    try {
        const loggedInUser = await userService.login(req.body);
        res.cookie('auth', loggedInUser.accessToken, { httpOnly: true });
        res.status(200).json({ message: 'Login successful.', user: loggedInUser });
    } catch (error) {
        res.status(401).json({ error: 'Invalid credentials. Please try again.' });
    }
});

userController.get('/profile', async (req, res) => {
    try {
        const profile = await userService.getProfile(req.user?._id);
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile. Please try again later.' });
    }
});

userController.put('/profile/image', storage, isAuth, async (req, res) => {
    try {
        const image = `http://localhost:3000/images/${req.file.filename}`;
        const updatedProfile = await userService.updateProfileAvatar(req.user._id, image);
        res.status(200).json({ message: 'Profile image updated successfully.', profile: updatedProfile });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile image. Please try again later.' });
    }
});

userController.put('/profile', isAuth, async (req, res) => {
    try {
        const updatedProfile = await userService.updateProfile(req.user._id, req.body);
        res.status(200).json({ message: 'Profile updated successfully.', profile: updatedProfile });
    } catch (error) {
        res.status(400).json({ error: getErrorMsg(error) || 'Failed to update profile. Please try again.' });
    }
});

userController.get('/logout', (req, res) => {
    res.clearCookie('auth');
    res.status(200).json({ message: 'Logout successful.' });
});

userController.delete('/profile', isAuth, async (req, res) => {
    try {
        await userService.deleteProfile(req.user._id);
        res.clearCookie('auth');
        res.status(200).json({ message: 'Profile deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete profile. Please try again later.' });
    }
});

export { userController };
