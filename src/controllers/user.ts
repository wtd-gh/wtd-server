import express = require('express');
import validator = require('validator');

import User = require('../models/user');
import Task = require('../models/task');
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
            res.status(200).json({ ok: false, error: 'At least one required field is either not valid or is empty!' });
            return;
        }

        if (taskName.length + taskDesc.length > 10000) {
            res.status(200).json({ ok: false, error: 'Too much to store!' });
            return;
        }

        if (!validator.isAfter(taskDeadline)) {
            res.status(200).json({ ok: false, error: 'Task deadline cannot be in past!' });
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
            taskQuanta,
            taskDeadline,
            taskWorkHrs,
            taskInitWorkHrs: taskWorkHrs
        };

        new Task(newTask).save().then(task => {
            user.tasks.push({ taskId: task._id });
            user.save().then((savedUser: any) => {
                res.status(200).json({ ok: true , task });
                return;
            });
        });

        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal error!' });
    }
}

export async function deleteTask(req: authRequest, res: express.Response) {
    try {
        const userId = req.userID;
        const tId = req.body.tId;

        if (!tId) {
            res.status(403).json({ error: 'Can\'t delete task!' });
            return;
        }

        const user: any = await User.findById(userId);
        const userTasks = await user.tasks;

        for (let i = 0; i < userTasks.length; i++) {
            if (String(userTasks[i].taskId) === tId) {
                await userTasks.splice(i, 1);
                break;
            }
        }
        await user.save();
        await Task.findByIdAndDelete(String(tId), (err) => { console.log(err); });
        res.status(200).json({ ok: true });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal error!' });
    }
}

function compareTasks(t1: any, t2: any) {
    const currDate = new Date().getTime()  / 3600000;
    const t1Date = new Date(t1.taskDeadline).getTime() / 3600000;
    const t2Date = new Date(t2.taskDeadline).getTime() / 3600000;

    const t1WHrPD = t1.taskWorkHrs / (t1Date - currDate);
    const t2WHrPD = t2.taskWorkHrs / (t2Date - currDate);

    if (t1WHrPD > t2WHrPD) {
        return -1;
    } else {
        return 1;
    }
}


export async function tellTodo(req: authRequest, res: express.Response) {
    try {
        const userId = req.userID;
        const mins = req.body.mins;

        if (!mins) {
            res.status(200).json({ ok: false, error: 'Can\'t anything in zero minutes!' });
            return;
        }

        if (mins <= 0) {
            res.status(200).json({ ok: false, error: 'Can\'t go in the past!' });
            return;
        }

        const user: any = await User.findById(userId);
        const userTaskList = await user.tasks;

        let userTasks: any = [];

        for (let i = 0; i < userTaskList.length; i++) {
            const t = await Task.findById(userTaskList[i].taskId);
            userTasks.push(t);
        }

        userTasks.sort(compareTasks);
        let sTask = null;

        for (let i = 0; i < userTasks.length; i++) {
            if (userTasks[i].taskQuanta <= (mins / 60)) {
                sTask = userTasks[i];
                break;
            }
        }

        if (sTask == null) {
            res.status(200).json({ ok: false,  error: 'No task with a shorter quanta, maybe you should add some!'});
        } else { res.status(200).json({ ok: false,  task: sTask }); }

        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal error!' });
    }
}

export async function decreaseWorkHrs(req: authRequest, res: express.Response) {
    try {
        const userId = req.userID;
        const taskId = req.body.tId;
        const decAmount = req.body.decAmount;

        if (!taskId || !decAmount) {
            res.status(200).json({ ok: false, error: 'At least one required field is either not valid or is empty!' });
            return;
        }

        const task: any = await Task.findById(taskId);
        if (!task || String(task.taskUser) !== userId) {
            res.status(200).json({ ok: false, error: 'Task Id is not valid!' });
            return;
        }

        task.taskWorkHrs -= decAmount;
        if (task.taskWorkHrs < 0) {
            task.taskWorkHrs = 0;
        }

        task.save().then((t: any) => {
            res.status(200).json({ ok: true });
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

        const userTaskList = await user.tasks;

        const userTasks: any = [];

        for (let i = 0; i < userTaskList.length; i++) {
            const t = await Task.findById(userTaskList[i].taskId);
            userTasks.push(t);
        }

        userTasks.sort(compareTasks);
        res.status(200).json({
            count: userTasks.length,
            tasks: userTasks
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal error!' });
    }
}

