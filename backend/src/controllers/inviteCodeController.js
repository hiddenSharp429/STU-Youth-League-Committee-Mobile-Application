/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 21:16:05
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-27 21:17:56
 * @FilePath: /YLC/backend/src/controllers/inviteCodeController.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const InviteCodeService = require('../services/inviteCodeService');

class InviteCodeController {
  static async checkInviteCode(req, res) {
    try {
      const { inviteCode, type } = req.body;
      const result = await InviteCodeService.checkInviteCode(inviteCode, type);
      res.json(result);
    } catch (error) {
      console.error('Check invite code error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async createInviteCode(req, res) {
    try {
      const { code, name, type } = req.body;
      const result = await InviteCodeService.createInviteCode(code, name, type);
      res.json(result);
    } catch (error) {
      console.error('Create invite code error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getInviteCodes(req, res) {
    try {
      const inviteCodes = await InviteCodeService.getInviteCodes();
      res.json(inviteCodes);
    } catch (error) {
      console.error('Get invite codes error:', error);
      res.status(500).json({ success: false, message: '获取邀请码列表失败' });
    }
  }

  static async deleteInviteCode(req, res) {
    try {
      const { id } = req.params;
      await InviteCodeService.deleteInviteCode(id);
      res.json({ success: true, message: '邀请码已删除' });
    } catch (error) {
      console.error('Delete invite code error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = InviteCodeController;