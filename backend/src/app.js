/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-26 19:56:09
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-29 12:06:05
 * @FilePath: /YLC/backend/src/app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const cors = require('cors');
const path = require('path'); // 添加这行
require('dotenv').config();

const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activity');
const inviteCodeRoutes = require('./routes/inviteCode');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

// 添加这行来设置静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/invite-codes', inviteCodeRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));