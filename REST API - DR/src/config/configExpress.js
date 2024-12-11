import express from 'express';
import cors from 'cors';
import { auth } from '../middlewares/authMiddleware.js';
import cookieParser from 'cookie-parser';
import path from 'path';

export const configExpress = (app) => {
    app.use(cors({
        origin: 'http://localhost:4200',
        credentials: true
    }));
    app.use('/images', express.static(path.resolve('images')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(auth);
}