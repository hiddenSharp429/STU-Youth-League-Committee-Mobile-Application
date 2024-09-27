/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:35:58
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-27 21:02:05
 * @FilePath: /YLC/backend/src/services/activityService.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const ActivityModel = require('../models/activityModel');

class ActivityService {
  static async createActivity(activityData) {
    try {
      const activityId = await ActivityModel.createActivity(activityData);
      return { success: true, message: '活动申请已提交', activityId };
    } catch (error) {
      console.error('Create activity error:', error);
      if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        throw new Error(`字段值不正确: ${error.sqlMessage}`);
      }
      throw new Error('提交活动申请失败: ' + error.message);
    }
  }
}

module.exports = ActivityService;