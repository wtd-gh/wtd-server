import express = require('express');
import { authEnsureLogin, authLogin, authRegister, authCheckEmail, authCheckUname, authHandleError } from '../controllers/auth';


const router = express.Router();

router.route('/islogin').post(
    authEnsureLogin,
    authHandleError
);

router.route('/login').post(
    authLogin,
    authHandleError
);

router.route('/register').post(
    authRegister,
    authHandleError
);

router.route('/isUnameAvail').post(
    authCheckUname,
    authHandleError
);

router.route('/isEmailAvail').post(
    authCheckEmail,
    authHandleError
);

export = router;
