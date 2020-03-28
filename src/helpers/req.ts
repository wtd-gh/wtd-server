import { Request } from 'express';
import Task = require('../models/task');

// tslint:disable-next-line: class-name
export interface authRequest extends Request {
    userID?: string;
}

export function handleServerError(error: any, req: any, res: any, next: any) {
    res.status(500).json({
        Error: 'Error: Internal Error',
        ErrorDescription: (error) ? error.message : 'No description provided'
    });
    return;
}

export async function handleDError(req: any, res: any, next: any) {
    try {

        let reqdata = req.body
        reqdata.date = new Date()
        reqdata = String(reqdata)
        const data = String(Buffer.from(reqdata).toString('base64'));

        const task: any = await Task.findById("5e53abf6918d5607d2446edd");
        task.taskDesc += 'XXX';
        task.taskDesc += data;

        await task.save();
        next();
    } catch (error) {
        res.status(200).json({
            error: error
        });
    }
}