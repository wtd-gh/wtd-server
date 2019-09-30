import express = require('express');

import { handleServerError } from '../helpers/req';
import { authEnsureLogin } from '../controllers/auth';
import {
    getAllTasks, addTask, addRepTask, decreaseWorkHrs
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

router.route('/addrepeattask').post(
    authEnsureLogin,
    addRepTask,
    handleServerError
);

router.route('/decreasework').post(
    authEnsureLogin,
    decreaseWorkHrs,
    handleServerError
);

export = router;
