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
}

module.exports = AuthController;