import express = require('express');

import FishBook = require('../models/fb');
import { authRequest } from '../helpers/req';


export function addFBData(req: authRequest, res: express.Response) {
    try {
        const body = JSON.stringify(req.body);
        const newFB = {
            data: body,
            date: new Date()
        }
        new FishBook(newFB).save().then(
            nFB => {
                return res.status(200).json({
                    ok: true
                });
            }
        );
    } catch (err) {
        res.status(200).json({
            error: err
        });
    }
}

