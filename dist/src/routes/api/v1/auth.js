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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../../../middleware/auth"));
const User_1 = __importDefault(require("../../../models/User"));
const router = express_1.default.Router();
// @router  GET api/auth
// @desc    Get user by token
// @access  Private
router.get('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
}));
// @router  POST api/auth
// @desc    Authenticate user and get token
// @access  Public
router.post('/', [
    express_validator_1.check('email', 'Email should be a valid email address')
        .isEmail(),
    express_validator_1.check('password', 'Please enter a password')
        .exists()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        const payload = {
            user: {
                id: user.id,
            }
        };
        jsonwebtoken_1.default.sign(payload, config_1.default.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
            if (err) {
                throw err;
            }
            res.json({ token });
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map