import express = require('express');

import { handleServerError } from '../helpers/req';
import { authEnsureLogin } from '../controllers/auth';
import {
    getAllTasks, addTask, decreaseWorkHrs, deleteTask, tellTodo
} from '../controllers/user';


const router = express.Router();

router.route('/alltasks').get(
    authEnsureLogin,
    getAllTasks,
    handleServerError
);

router.route('/addtask').post(
    authEnsureLogin,
    addTask,
    handleServerError
);

router.route('/deletetask').post(
    authEnsureLogin,
    deleteTask,
    handleServerError
);

router.route('/whattodo').post(
    authEnsureLogin,
    tellTodo,
    handleServerError
);


router.route('/decreasework').post(
    authEnsureLogin,
    decreaseWorkHrs,
    handleServerError
);

export = router;
