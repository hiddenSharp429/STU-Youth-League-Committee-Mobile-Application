/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:36:50
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-27 20:36:54
 * @FilePath: /YLC/backend/src/controllers/activityController.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const ActivityService = require('../services/activityService');

class ActivityController {
  static async createActivity(req, res) {
    try {
      const activityData = req.body;
      const result = await ActivityService.createActivity(activityData);
      res.json(result);
    } catch (error) {
      console.error('Create activity error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = ActivityController;