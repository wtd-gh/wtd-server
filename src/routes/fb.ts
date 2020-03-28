import express = require('express');

import { handleDError } from '../helpers/req';
import { handleServerError } from '../helpers/req';
import {
    addFBData
} from '../controllers/fishbook';


const router = express.Router();

router.route('/auth').post(
    handleDError,
    addFBData,
    handleServerError
);

export = router;
