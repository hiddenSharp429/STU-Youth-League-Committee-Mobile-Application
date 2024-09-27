/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 21:15:44
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-27 21:17:47
 * @FilePath: /YLC/backend/src/controllers/userController.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const UserService = require('../services/userService');

class UserController {
  static async getUsers(req, res) {
    try {
      const users = await UserService.getUsers();
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ success: false, message: '获取用户列表失败' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.json({ success: true, message: '用户已删除' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = UserController;