import JWT = require('jsonwebtoken');
import express = require('express');
import bcrypt = require('bcryptjs');
import validator = require('validator');
import mailer = require('../config/mailer.conf');

import User = require('../models/user');
import config = require('../config/convict.conf');
import { authRequest } from '../helpers/req';


export function authEnsureLogin(req: authRequest, res: express.Response, next: express.NextFunction) {
    const token = req.headers['x-auth'];
    if (!token) {
        res.status(401).json({
            ok: false,
            error: 'No cookie found on headers'
        });
        return;
    }
    JWT.verify(token.toString(), config.get('jwtSecret'), (error: any, decoded: any) => {
        if (error || !decoded) {
            res.status(405).json({
                ok: false,
                error: 'Cookie invalid'
            });
            return;
        }
        req.userID = decoded.id;
        console.log(req.userID);
        next();
    });
}

export function authSuccess(req: authRequest, res: express.Response) {
    res.status(200).json({
        ok: true
    });
}

export async function authLogin(req: authRequest, res: express.Response) {
    try {
        const uId = req.body.uId;
        const pass = req.body.pass;

        if (!uId || !pass) {
            res.status(403).json({ ok: false, error: 'The username or email address doesn\'t match any account' });
            return;
        }

        let user: any;

        if (validator.isEmail(uId)) {
            user = await User.findOne({ email: uId });
        } else {
            user = await User.findOne({ userName: uId });
        }

        if (!user) {
            res.status(200).json({ ok: false, error: 'The username or email address doesn\'t match any account' });
            return;
        }

        const hashedPass = user.password;

        bcrypt.compare(pass, hashedPass).then((resp) => {
            if (resp === false) {
                res.status(200).json({ ok: false, error: 'The password you entered is incorrect!' });
                return;
            }
            const token = JWT.sign({ id: user._id }, config.get('jwtSecret'));
            res.setHeader('x-auth', token);
            res.status(200).json({ ok: true, name: user.name });
        });
    } catch (err) {
        console.log(err);
        res.status(501).json({ ok: false });
    }
}

/*
 * For below two functions :-
 * @args: userName or email
 * @return: true if value 'not' present in database, false if value present in database
 */
async function checkUserName(userName: string) {
    const user = await User.find({ userName: userName.toLowerCase() });
    if (!user || user.length < 1) { return true; }
    return false;
}

async function checkEmail(email: string) {
    const nEmail = validator.normalizeEmail(email, { all_lowercase: true, gmail_convert_googlemaildotcom: true });
    const user = await User.find({ email: nEmail });
    if (!user || user.length < 1) { return true; }
    return false;
}

export async function authCheckUname(req: authRequest, res: express.Response) {
    try {
        const userName = req.body.uName;
        if (!userName) {
            res.status(403).json({ ok: false, error: 'Username ' + userName + ' is not available!' });
            return;
        }
        const isAvail = await checkUserName(userName);
        res.status(200).json({ ok: isAvail });
    } catch (error) {
        res.status(501).json({ ok: false });
    }
}

export async function authCheckEmail(req: authRequest, res: express.Response) {
    try {
        const email = req.body.email;
        if (!email || !validator.isEmail(email)) {
            res.status(403).json({ ok: false, error: 'WtD account with the email address already exist, please login!' });
            return;
        }
        const isAvail = await checkEmail(email);
        res.status(200).json({ ok: isAvail });
    } catch (error) {
        res.status(403).json({ ok: false });
    }
}

export async function authRegister(req: authRequest, res: express.Response) {

    try {
        const name = req.body.name;
        const email = req.body.email;
        const userName = req.body.uName;
        const password = req.body.pass;

        if (!name || !email || !userName || !password) {
            res.status(403).json({ ok: false });
            return;
        }

        if ((name.length + email.length + userName.length + password.length) > 2000) {
            res.status(403).json({ ok: false, error: 'Too long to store!' });
            return;
        }

        if (!validator.isEmail(email)) {
            res.status(200).json({ ok: false, error: 'Not a valid email address!' });
            return;
        }

        const isUnameValid = await checkUserName(userName);
        if (!isUnameValid) {
            res.status(200).json({ ok: false, error: 'Username already taken!' });
            return;
        }

        const isEmailValid = await checkEmail(email);
        if (!isEmailValid) {
            res.status(200).json({ ok: false, error: 'Email address already exist, please login!' });
            return;
        }


        await bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                res.status(501).json({ ok: false, error: 'Internal Error!' });
                return;
            }
            bcrypt.hash(password, salt, (err2, hashedPass) => {
                if (err2) {
                    res.status(501).json({ ok: false, error: 'Internal Error!' });
                    return;
                }
                const nEmail = validator.normalizeEmail(email, {
                    all_lowercase: true, gmail_convert_googlemaildotcom: true
                });
                const newUser = {
                    name,
                    userName: userName.toLowerCase(),
                    email: nEmail,
                    password: hashedPass,
                    regDate: new Date()
                };
                new User(newUser).save().then(user => {
                    return res.status(200).json({
                        ok: true
                    });
                });
            });
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({ ok: false });
    }
}

export function authHandleError(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(401).json({
        Error: 'Authentcation Error',
        ErrorDesc: error.message ? error.message : 'User not authenticated'
    });
}
