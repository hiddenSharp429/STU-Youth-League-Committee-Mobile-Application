/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:35:58
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-28 02:37:41
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

  static async getUserActivities(userId, status, page, limit) {
    // 确保 page 和 limit 是数字
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || isNaN(limit)) {
      throw new Error('Invalid page or limit');
    }

    const offset = Math.max((page - 1) * limit, 0); // 确保 offset 不会是负数
    const activities = await ActivityModel.getUserActivities(userId, status, offset, limit);
    return { activities };
  }
  
  static async getUserActivitiesCount(userId, status) {
    const total = await ActivityModel.getUserActivitiesCount(userId, status);
    return { total };
  }

  static async updateActivity(id, activityData) {
    try {
      const updatedActivity = await ActivityModel.updateActivity(id, activityData);
      return { success: true, message: '活动已更新', activity: updatedActivity };
    } catch (error) {
      console.error('Update activity error:', error);
      throw new Error('更新活动失败: ' + error.message);
    }
  }

  static async getActivityById(id) {
    try {
      const activity = await ActivityModel.getActivityById(id);
      return activity;
    } catch (error) {
      console.error('Get activity by id error:', error);
      throw new Error('获取活动详情失败: ' + error.message);
    }
  }
}

module.exports = ActivityService;