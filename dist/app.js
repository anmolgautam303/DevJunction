"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import app from './src/App'
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const users_1 = __importDefault(require("./src/routes/api/v1/users"));
const auth_1 = __importDefault(require("./src/routes/api/v1/auth"));
const profile_1 = __importDefault(require("./src/routes/api/v1/profile"));
const posts_1 = __importDefault(require("./src/routes/api/v1/posts"));
const app = express_1.default();
// connect database
db_1.default();
// Init Middleware
app.use(express_1.default.json());
app.get('/', (req, res) => res.send('API running!'));
// Define Routes
// app.use('/api/v1/users', require('./src/routes/api/v1/users'));
app.use('/api/v1/users', users_1.default);
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/profile', profile_1.default);
app.use('/api/v1/posts', posts_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
//# sourceMappingURL=app.js.map