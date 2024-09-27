/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:46:06
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-27 20:46:11
 * @FilePath: /YLC/backend/src/routes/activity.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.post('/', activityController.createActivity);

module.exports = router;