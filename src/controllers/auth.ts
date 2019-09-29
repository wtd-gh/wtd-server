import JWT = require('jsonwebtoken');
import express = require('express');
import bcrypt = require('bcryptjs');

import User = require('../models/user');
import config = require('../config/convict.conf');
import { authRequest } from '../helpers/req';
import { validateEmail } from '../helpers/validators';


export function authEnsureLogin(req: authRequest, res: express.Response) {
    const token = req.headers['x-auth'];
    if (!token) {
        res.status(401).json({
            Error: 'User not authenticated',
            ErrorDescription: 'No cookie found on headers'
        });
        return;
    }
    JWT.verify(token.toString(), config.get('jwtSecret'), (error: any, decoded: any) => {
        if (error || !decoded) {
            res.status(405).json({
                Error: 'Cookie invalid'
            });
            return;
        }
        req.userID = decoded.id;
        console.log(req.userID);
        res.status(200).json({
            Ok: true
        });
    });
}

export async function authLogin(req: authRequest, res: express.Response) {
    try {
        const uId = req.body.uId;
        const pass = req.body.pass;

        if (!uId || !pass) {
            res.status(403).json({ Ok: false });
            return;
        }

        let user: any;

        if (validateEmail(uId)) {
            user = await User.findOne({ email: uId });
        } else {
            user = await User.findOne({ userName: uId });
        }

        if (!user) {
            res.status(403).json({ Ok: false });
            return;
        }

        const hashedPass = user.password;

        bcrypt.compare(pass, hashedPass).then((resp) => {
            if (resp === false) {
                res.status(403).json({ Ok: false });
                return;
            }
            const token = JWT.sign({ id: user._id }, config.get('jwtSecret'));
            res.setHeader('x-auth', token);
            res.status(200).json({ Ok: true });
        });
    } catch (err) {
        // console.log(err);
        res.status(403).json({ Ok: false });
    }
}
/*
 * For below two functions :-
 * @args: userName or email
 * @return: true if value 'not' present in database, false if value present in database
 *
 */
async function checkUserName(userName: string) {
    const user = await User.find({ userName });
    if (!user || user.length < 1) { return true; }
    return false;
}

async function checkEmail(email: string) {
    const user = await User.find({ email });
    if (!user || user.length < 1) { return true; }
    return false;
}

export async function authCheckUname(req: authRequest, res: express.Response) {
    try {
        const userName = req.body.uName;
        if (!userName) {
            res.status(403).json({ Ok: false });
            return;
        }
        const isAvail = await checkUserName(userName);
        res.status(200).json({ Ok: isAvail });
    } catch (error) {
        res.status(403).json({ Ok: false });
    }
}

export async function authCheckEmail(req: authRequest, res: express.Response) {
    try {
        const email = req.body.email;
        if (!email) {
            res.status(403).json({ Ok: false });
            return;
        }
        const isAvail = await checkEmail(email);
        res.status(200).json({ Ok: isAvail });
    } catch (error) {
        res.status(403).json({ Ok: false });
    }
}

export async function authRegister(req: authRequest, res: express.Response) {

    try {
        const name = req.body.name;
        const email = req.body.email;
        const userName = req.body.uName;
        const password = req.body.pass;

        if (!name || !email || !userName || !password) {
            res.status(403).json({ Ok: false });
            return;
        }

        if ((name.length + email.length + userName.length + password.length) > 2000) {
            res.status(403).json({ Ok: false, error: 'Too long to store!' });
            return;
        }

        if (!validateEmail(email)) {
            res.status(200).json({ Ok: false, error: 'Not a valid email address!' });
            return;
        }

        const isUnameValid = await checkUserName(userName);
        if (!isUnameValid) {
            res.status(200).json({ Ok: false, error: 'Username already taken!' });
            return;
        }

        const isEmailValid = await checkEmail(email);
        if (!isEmailValid) {
            res.status(200).json({ Ok: false, error: 'Email address already exist, please login!' });
            return;
        }


        await bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                res.status(501).json({ Ok: false, error: 'Internal Error!' });
            }
            bcrypt.hash(password, salt, (err2, hashedPass) => {
                if (err2) {
                    res.status(501).json({ Ok: false, error: 'Internal Error!' });
                }
                const newUser = {
                    name,
                    userName,
                    email,
                    password: hashedPass,
                    regDate: new Date()
                };
                new User(newUser).save().then(user => {
                    return res.status(200).json({
                        Ok: true
                    });
                });
            });
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({ Ok: false });
    }
}

export function authHandleError(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(401).json({
        Error: 'Authentcation Error',
        ErrorDesc: error.message ? error.message : 'User not authenticated'
    });
}
