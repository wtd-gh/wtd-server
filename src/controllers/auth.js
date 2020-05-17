"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHandleError = exports.authRegister = exports.authCheckEmail = exports.authCheckUname = exports.authLogin = exports.authSuccess = exports.authEnsureLogin = void 0;
var JWT = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var validator = require("validator");
var User = require("../models/user");
var config = require("../config/convict.conf");
function authEnsureLogin(req, res, next) {
    var token = req.headers['x-auth'];
    if (!token) {
        res.status(401).json({
            ok: false,
            error: 'No cookie found on headers'
        });
        return;
    }
    JWT.verify(token.toString(), config.get('jwtSecret'), function (error, decoded) {
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
exports.authEnsureLogin = authEnsureLogin;
function authSuccess(req, res) {
    res.status(200).json({
        ok: true
    });
}
exports.authSuccess = authSuccess;
function authLogin(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var uId, pass, user_1, hashedPass, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    uId = req.body.uId;
                    pass = req.body.pass;
                    if (!uId || !pass) {
                        res.status(403).json({ ok: false, error: 'The username or email address doesn\'t match any account' });
                        return [2 /*return*/];
                    }
                    if (!validator.isEmail(uId)) return [3 /*break*/, 2];
                    return [4 /*yield*/, User.findOne({ email: uId })];
                case 1:
                    user_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, User.findOne({ userName: uId })];
                case 3:
                    user_1 = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!user_1) {
                        res.status(200).json({ ok: false, error: 'The username or email address doesn\'t match any account' });
                        return [2 /*return*/];
                    }
                    hashedPass = user_1.password;
                    bcrypt.compare(pass, hashedPass).then(function (resp) {
                        if (resp === false) {
                            res.status(200).json({ ok: false, error: 'The password you entered is incorrect!' });
                            return;
                        }
                        var token = JWT.sign({ id: user_1._id }, config.get('jwtSecret'));
                        res.setHeader('x-auth', token);
                        res.status(200).json({ ok: true, name: user_1.name });
                    });
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.log(err_1);
                    res.status(501).json({ ok: false });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.authLogin = authLogin;
/*
 * For below two functions :-
 * @args: userName or email
 * @return: true if value 'not' present in database, false if value present in database
 */
function checkUserName(userName) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User.find({ userName: userName.toLowerCase() })];
                case 1:
                    user = _a.sent();
                    if (!user || user.length < 1) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
function checkEmail(email) {
    return __awaiter(this, void 0, void 0, function () {
        var nEmail, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nEmail = validator.normalizeEmail(email, { all_lowercase: true, gmail_convert_googlemaildotcom: true });
                    return [4 /*yield*/, User.find({ email: nEmail })];
                case 1:
                    user = _a.sent();
                    if (!user || user.length < 1) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
function authCheckUname(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userName, isAvail, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userName = req.body.uName;
                    if (!userName) {
                        res.status(403).json({ ok: false, error: 'Username ' + userName + ' is not available!' });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, checkUserName(userName)];
                case 1:
                    isAvail = _a.sent();
                    res.status(200).json({ ok: isAvail });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    res.status(501).json({ ok: false });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.authCheckUname = authCheckUname;
function authCheckEmail(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var email, isAvail, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    email = req.body.email;
                    if (!email || !validator.isEmail(email)) {
                        res.status(403).json({ ok: false, error: 'WtD account with the email address already exist, please login!' });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, checkEmail(email)];
                case 1:
                    isAvail = _a.sent();
                    res.status(200).json({ ok: isAvail });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    res.status(403).json({ ok: false });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.authCheckEmail = authCheckEmail;
function authRegister(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var name_1, email_1, userName_1, password_1, isUnameValid, isEmailValid, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    name_1 = req.body.name;
                    email_1 = req.body.email;
                    userName_1 = req.body.uName;
                    password_1 = req.body.pass;
                    if (!name_1 || !email_1 || !userName_1 || !password_1) {
                        res.status(403).json({ ok: false });
                        return [2 /*return*/];
                    }
                    if ((name_1.length + email_1.length + userName_1.length + password_1.length) > 2000) {
                        res.status(403).json({ ok: false, error: 'Too long to store!' });
                        return [2 /*return*/];
                    }
                    if (!validator.isEmail(email_1)) {
                        res.status(200).json({ ok: false, error: 'Not a valid email address!' });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, checkUserName(userName_1)];
                case 1:
                    isUnameValid = _a.sent();
                    if (!isUnameValid) {
                        res.status(200).json({ ok: false, error: 'Username already taken!' });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, checkEmail(email_1)];
                case 2:
                    isEmailValid = _a.sent();
                    if (!isEmailValid) {
                        res.status(200).json({ ok: false, error: 'Email address already exist, please login!' });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, bcrypt.genSalt(12, function (err, salt) {
                            if (err) {
                                res.status(501).json({ ok: false, error: 'Internal Error!' });
                                return;
                            }
                            bcrypt.hash(password_1, salt, function (err2, hashedPass) {
                                if (err2) {
                                    res.status(501).json({ ok: false, error: 'Internal Error!' });
                                    return;
                                }
                                var nEmail = validator.normalizeEmail(email_1, {
                                    all_lowercase: true, gmail_convert_googlemaildotcom: true
                                });
                                var newUser = {
                                    name: name_1,
                                    userName: userName_1.toLowerCase(),
                                    email: nEmail,
                                    password: hashedPass,
                                    regDate: new Date()
                                };
                                new User(newUser).save().then(function (user) {
                                    return res.status(200).json({
                                        ok: true
                                    });
                                });
                            });
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.log(error_3);
                    res.status(403).json({ ok: false });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.authRegister = authRegister;
function authHandleError(error, req, res, next) {
    res.status(401).json({
        Error: 'Authentcation Error',
        ErrorDesc: error.message ? error.message : 'User not authenticated'
    });
}
exports.authHandleError = authHandleError;
