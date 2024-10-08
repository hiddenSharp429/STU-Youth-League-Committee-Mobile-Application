/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-26 19:55:27
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-02 03:47:32
 * @FilePath: /YLC/backend/src/controllers/authController.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const AuthService = require('../services/authService');

class AuthController {
  static async login(req, res) {
    try {
      const { account, password, type } = req.body;
      const result = await AuthService.login(account, password, type);

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