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
}

module.exports = AuthController;