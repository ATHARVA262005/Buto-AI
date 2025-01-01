import userModel from '../models/user.model.js';
import * as userService from '../services/user.services.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';

export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateToken();
        delete user._doc.password;
        res.status(201).json({user, token});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const loginUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const token = await user.generateToken();
        delete user._doc.password;
        res.status(200).json({ user, token });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const profileUserController = async (req, res) => {
    try {
        res.status(200).json({user: req.user});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const logoutUserController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];
        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);
        res.status(200).json({ message: 'Logout successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getAllUsersController = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email }); 
        const allusers = await userService.getAllUsers( { userId: loggedInUser._id });
        return res.status(200).json({ allusers });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}