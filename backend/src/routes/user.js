/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 21:09:18
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-05 23:52:46
 * @FilePath: /YLC/backend/src/routes/user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.delete('/:id', userController.deleteUser);
router.get('/:id', userController.getUserNameById);
router.get('/info/:id', userController.getUserById);
module.exports = router;