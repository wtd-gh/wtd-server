import express = require('express');
import validator = require('validator');

import User = require('../models/user');
import Task = require('../models/task');
import repeatTask = require('../models/repeatTask');
import { authRequest } from '../helpers/req';


export async function addTask(req: authRequest, res: express.Response) {
    try {
        const userId = req.userID;
        let taskName = req.body.tName;
        let taskDesc = req.body.tDesc;
        const taskQuanta = req.body.tQuanta;
        const taskWorkHrs = req.body.tWorkHrs;
        let taskDeadline = req.body.tDeadline;

        if (!taskName || !taskQuanta || !taskWorkHrs || !taskDeadline) {
            res.status(400).json({ error: 'At least one required field is either not valid or is empty!' });
            return;
        }

        if (taskName.length + taskDesc.length > 10000) {
            res.status(400).json({ error: 'Too much to store!' });
            return;
        }

        if (!validator.isAfter(taskDeadline)) {
            res.status(400).json({ error: 'Task deadline cannot be in past!' });
            return;
        }
        taskDeadline = validator.toDate(taskDeadline);

        const user: any = await User.findById(userId);
        taskName = validator.escape(taskName);
        taskDesc = validator.escape(taskDesc);

        const newTask = {
            taskUser: userId,
            taskName,
            taskDesc,
            taskDeadline,
            taskWorkHrs
        };

        new Task(newTask).save().then(task => {
            user.tasks.push({taskId: task._id});
            user.save().then((savedUser: any) => {
                res.status(200).json({ Ok: true });
                return;
            });
        });

        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal error!' });
    }
}

export async function addRepTask(req: authRequest, res: express.Response) {
    try {
        const userId = req.userID;
        let taskName = req.body.tName;
        let taskDesc = req.body.tDesc;
        const taskQuanta = req.body.tQuanta;
        const taskWorkHrs = req.body.tWorkHrs;
        const taskRepTime = req.body.tRepTime;
        const taskRepDays = req.body.tRepDays;

        if (!taskName || !taskQuanta || !taskWorkHrs || taskRepTime > 1440 || taskRepDays.length !== 7) {
            res.status(400).json({ error: 'At least one required field is either not valid or is empty!' });
            return;
        }

        if (taskName.length + taskDesc.length > 10000) {
            res.status(400).json({ error: 'Too much to store!' });
            return;
        }

        const user: any = await User.findById(userId);
        taskName = validator.escape(taskName);
        taskDesc = validator.escape(taskDesc);

        const newRepTask = {
            taskUser: userId,
            taskName,
            taskDesc,
            taskWorkHrs,
            taskRepTime,
            taskRepDays
        };

        new repeatTask(newRepTask).save().then(rtask => {
            user.repeatTasks.push({repeatTaskId: rtask._id});
            user.save().then((savedUser: any) => {
                res.status(200).json({ Ok: true });
                return;
            });
        });

        return;
    } catch (error) {
        res.status(500).json({ error: 'Internal error!' });
    }
}

export async function decreaseWorkHrs(req: authRequest, res: express.Response) {
    try {
        const userId = req.userID;
        const taskId = req.body.tId;
        const decAmount = req.body.decAmount;

        if (!taskId || !decAmount) {
            res.status(400).json({ error: 'At least one required field is either not valid or is empty!' });
            return;
        }

        const task: any = await Task.findById(taskId);
        if (!task || String(task.taskUser) !== userId) {
            res.status(400).json({ error: 'At least one required field is either not valid or is empty!' });
            return;
        }

        task.taskWorkHrs -= decAmount;
        if (task.taskWorkHrs < 0) {
            task.taskWorkHrs = 0;
        }

        task.save().then((t: any) => {
            res.status(200).json({ Ok: true });
            return;
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal error!' });
    }

}

export async function getAllTasks(req: authRequest, res: express.Response) {
    try {
        const userId = req.userID;
        const user: any = await User.findById(userId);
        const tasks: any = [];

        for (const uTask of user.tasks) {
            const t: any = await Task.findById(uTask.taskId);

            const tRep = t.taskRepeat ? true : false;
            const tRepId = String(t.taskRepId);

            tasks.push({
                taskId: t._id,
                taskName: t.taskName,
                taskDesc: t.taskDesc,
                taskDeadline: t.taskDeadline,
                taskQuanta: t.taskQuanta,
                taskWorkHrs: t.taskWorkHrs,
                taskRepeat: tRep,
                taskRepeatId: tRepId
            });
        }
        res.status(200).json({
            count: user.tasks.length,
            tasks
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal error!' });
    }
}

