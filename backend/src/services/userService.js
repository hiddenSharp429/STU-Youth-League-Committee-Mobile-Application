/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 21:18:37
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-27 21:18:41
 * @FilePath: /YLC/backend/src/services/userService.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const UserModel = require('../models/userModel');

class UserService {
  static async getUsers() {
    return await UserModel.getAllUsers();
  }

  static async deleteUser(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error('用户不存在');
    }
    await UserModel.deleteUser(id);
  }
}

module.exports = UserService;