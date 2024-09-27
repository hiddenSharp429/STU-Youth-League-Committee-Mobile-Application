/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 21:09:33
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-27 21:12:56
 * @FilePath: /YLC/backend/src/routes/inviteCode.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const router = express.Router();
const inviteCodeController = require('../controllers/inviteCodeController');

router.post('/check', inviteCodeController.checkInviteCode);
router.post('/', inviteCodeController.createInviteCode);
router.get('/', inviteCodeController.getInviteCodes);
router.delete('/:id', inviteCodeController.deleteInviteCode);

module.exports = router;