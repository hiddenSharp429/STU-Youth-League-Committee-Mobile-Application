/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-26 19:55:27
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-27 14:49:57
 * @FilePath: /YLC/backend/src/controllers/authController.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const AuthService = require('../services/authService');

class AuthController {
  static async login(req, res) {
    try {
      const { account, password } = req.body;
      const result = await AuthService.login(account, password);

      if (result.success) {
        res.json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: '服务器错误' });
    }
  }

  static async checkInviteCode(req, res) {
    try {
      const { inviteCode, type } = req.body;
      const result = await AuthService.checkInviteCode(inviteCode, type);
      res.json(result);
    } catch (error) {
      console.error('Check invite code error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async register(req, res) {
    try {
      const { account, password, name, type, inviteCode } = req.body;
      const result = await AuthService.register(account, password, name, type, inviteCode);
      res.json(result);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async createInviteCode(req, res) {
    try {
      const { code, name, type } = req.body;
      const result = await AuthService.createInviteCode(code, name, type);
      res.json(result);
    } catch (error) {
      console.error('Create invite code error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await AuthService.getUsers();
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ success: false, message: '获取用户列表失败' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await AuthService.deleteUser(id);
      res.json({ success: true, message: '用户已删除' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getInviteCodes(req, res) {
    try {
      const inviteCodes = await AuthService.getInviteCodes();
      res.json(inviteCodes);
    } catch (error) {
      console.error('Get invite codes error:', error);
      res.status(500).json({ success: false, message: '获取邀请码列表失败' });
    }
  }

  static async deleteInviteCode(req, res) {
    try {
      const { id } = req.params;
      await AuthService.deleteInviteCode(id);
      res.json({ success: true, message: '邀请码已删除' });
    } catch (error) {
      console.error('Delete invite code error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = AuthController;