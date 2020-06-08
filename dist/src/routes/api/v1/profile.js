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
const config_1 = __importDefault(require("config"));
const axios_1 = __importDefault(require("axios"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../../../middleware/auth"));
const Profile_1 = __importDefault(require("../../../models/Profile"));
const User_1 = __importDefault(require("../../../models/User"));
const Post_1 = __importDefault(require("../../../models/Post"));
const router = express_1.default.Router();
// @router  GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Profile_1.default.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}));
// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
// @ts-ignore
router.post('/', [
    auth_1.default,
    [
        express_validator_1.check('status', 'Status is required').not().isEmpty(),
        express_validator_1.check('skills', 'Skills is required').not().isEmpty()
    ]
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { company, location, website, bio, skills, status, githubusername, youtube, twitter, instagram, linkedin, facebook, } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company)
        profileFields.company = company;
    if (website)
        profileFields.website = website;
    if (location)
        profileFields.location = location;
    if (bio)
        profileFields.bio = bio;
    if (status)
        profileFields.status = status;
    if (githubusername)
        profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {};
    if (youtube)
        profileFields.social.youtube = youtube;
    if (twitter)
        profileFields.social.twitter = twitter;
    if (instagram)
        profileFields.social.instagram = instagram;
    if (linkedin)
        profileFields.social.linkedin = linkedin;
    if (facebook)
        profileFields.social.facebook = facebook;
    try {
        let profile = yield Profile_1.default.findOne({ user: req.user.id });
        if (profile) {
            // update
            profile = yield Profile_1.default
                .findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
            return res.json(profile);
        }
        // Create
        profile = new Profile_1.default(profileFields);
        yield profile.save();
        return res.json(profile);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
}));
// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield Profile_1.default.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}));
// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', ({ params: { user_id } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Profile_1.default.findOne({
            user: user_id
        }).populate('user', ['name', 'avatar']);
        if (!profile)
            return res.status(400).json({ msg: 'Profile not found' });
        return res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        return res.status(500).json({ msg: 'Server error' });
    }
}));
// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Remove post
        yield Post_1.default.deleteMany({ user: req.user.id });
        // Remove profile
        yield Profile_1.default.findOneAndRemove({ user: req.user.id });
        // Remove user
        yield User_1.default.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User deleted' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}));
// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
// @ts-ignore
router.put('/experience', [
    auth_1.default,
    [
        express_validator_1.check('title', 'Title is required').not().isEmpty(),
        express_validator_1.check('company', 'Company is required').not().isEmpty(),
        express_validator_1.check('from', 'From date is required and needs to be from the past')
            .not()
            .isEmpty()
            .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
    ]
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description, } = req.body;
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    };
    try {
        const profile = yield Profile_1.default.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        yield profile.save();
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}));
// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
router.delete('/experience/:exp_id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundProfile = yield Profile_1.default.findOne({ user: req.user.id });
        foundProfile.experience = foundProfile.experience.filter((exp) => exp._id.toString() !== req.params.exp_id);
        yield foundProfile.save();
        return res.status(200).json(foundProfile);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
}));
// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
// @ts-ignore
router.put('/education', [
    auth_1.default,
    [
        express_validator_1.check('school', 'School is required').not().isEmpty(),
        express_validator_1.check('degree', 'Degree is required').not().isEmpty(),
        express_validator_1.check('fieldofstudy', 'Field of study is required').not().isEmpty(),
        express_validator_1.check('from', 'From date is required and needs to be from the past')
            .not()
            .isEmpty()
    ]
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } = req.body;
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };
    try {
        const profile = yield Profile_1.default.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        yield profile.save();
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}));
// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete('/education/:edu_id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundProfile = yield Profile_1.default.findOne({ user: req.user.id });
        foundProfile.education = foundProfile.education.filter((edu) => edu._id.toString() !== req.params.edu_id);
        yield foundProfile.save();
        return res.status(200).json(foundProfile);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
}));
// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uri = encodeURI(`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config_1.default.get('githubClientID')}&client_secret=${config_1.default.get('githubClientSecret')}`);
        const headers = {
            'user-agent': 'node.js',
        };
        const gitHubResponse = yield axios_1.default.get(uri, { headers });
        return res.json(gitHubResponse.data);
    }
    catch (err) {
        console.error(err.message);
        return res.status(404).json({ msg: 'No Github profile found' });
    }
}));
exports.default = router;
//# sourceMappingURL=profile.js.map