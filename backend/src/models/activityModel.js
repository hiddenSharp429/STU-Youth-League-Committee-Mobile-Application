/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:35:32
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-29 15:03:44
 * @FilePath: /YLC/backend/src/models/activityModel.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const db = require('../config/database');

class ActivityModel {
  static async createActivity(activityData) {
    const {
      activityName, startDate, endDate, activityPlace, area, organization,
      responsibleName, responsibleGrade, responsiblePhone, responsibleEmail,
      budgetTotal, budgetSelf, budgetApply, hasSponsor, sponsorCompany,
      sponsorForm, sponsorMoney, needBorrow, borrowerName, borrowerGrade,
      borrowerAge, borrowerPhone, borrowerMoney, needServiceFee, serviceObject,
      serviceMoney, participantCount, needUploadOA, remark, briefContent, userId, status
    } = activityData;

    // 转换日期格式
    const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
    const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);

    // 处理可选字段
    const processedData = {
      activity_name: activityName,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      activity_place: activityPlace,
      area: area,
      organization: organization,
      responsible_name: responsibleName,
      responsible_grade: responsibleGrade,
      responsible_phone: responsiblePhone,
      responsible_email: responsibleEmail,
      budget_total: budgetTotal || null,
      budget_self: budgetSelf || null,
      budget_apply: budgetApply || null,
      has_sponsor: hasSponsor,
      sponsor_company: sponsorCompany || null,
      sponsor_form: sponsorForm || null,
      sponsor_money: sponsorMoney || null,
      need_borrow: needBorrow,
      borrower_name: borrowerName || null,
      borrower_grade: borrowerGrade || null,
      borrower_age: borrowerAge || null,
      borrower_phone: borrowerPhone || null,
      borrower_money: borrowerMoney || null,
      need_service_fee: needServiceFee,
      service_object: serviceObject || null,
      service_money: serviceMoney || null,
      participant_count: participantCount || null,
      need_upload_oa: needUploadOA,
      remark: remark || null,
      brief_content: briefContent || null,
      userId: userId,
      status: status
    };

    const fields = Object.keys(processedData).filter(key => processedData[key] !== null);
    const values = fields.map(field => processedData[field]);
    const placeholders = fields.map(() => '?').join(', ');

    const query = `INSERT INTO activities (${fields.join(', ')}) VALUES (${placeholders})`;

    const [result] = await db.execute(query, values);

    return result.insertId;
  }

  static async getUserActivities(userId, status, offset, limit) {
    // 确保 offset 和 limit 是数字
    offset = parseInt(offset, 10);
    limit = parseInt(limit, 10);
    
    // status为数组，获取status最大值
    const maxStatus = Math.max(...status);
    const minStatus = Math.min(...status);

    // 添加一些错误检查
    if (isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0) {
      throw new Error('Invalid offset or limit');
    }

    // 首先获取总记录数
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM activities WHERE userId = ?',
      [userId]
    );
    const total = countResult[0].total;
    
    // 如果没有记录，直接返回空数组
    if (total === 0) {
      return [];
    }

    // 调整 offset，确保它不会超过总记录数
    offset = Math.min(offset, total);
    // 调整 limit，确保它不会超过总记录数
    limit = Math.min(limit, total - offset);

    
    // 使用模板字符串构建 SQL 查询
    const query = `SELECT * FROM activities WHERE userId = ? AND status >= ? AND status <= ? ORDER BY start_date DESC LIMIT ${limit} OFFSET ${offset}`;
    
    const [rows] = await db.execute(query, [userId, minStatus, maxStatus]);
    return rows;
  }
  
  static async getUserActivitiesCount(userId, status) {
    // status为数组，获取status最大值
    const maxStatus = Math.max(...status);
    const minStatus = Math.min(...status);
    const [rows] = await db.execute(
      'SELECT COUNT(*) as total FROM activities WHERE userId = ? AND status >= ? AND status <= ?',
      [userId, minStatus, maxStatus]
    );
    return rows[0].total;
  }

  static async updateActivity(id, activityData) {
    const updateData = { ...activityData };
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;

    // 处理日期格式
    if (updateData.start_date) {
      updateData.start_date = new Date(updateData.start_date).toISOString().slice(0, 10);
    }
    if (updateData.end_date) {
      updateData.end_date = new Date(updateData.end_date).toISOString().slice(0, 10);
    }

    let query;
    let values;

    if (updateData.status === 2) {
      // 被驳回的活动重新提交
      const fields = Object.keys(updateData);
      values = fields.map(field => updateData[field]);
      const placeholders = fields.map(field => `${field} = ?`).join(', ');
      query = `UPDATE activities SET ${placeholders}, status = 0 WHERE id = ?`;
    } else if (updateData.status === 1) {
      // 已通过的活动提交总结
      const summaryFields = [
        'practical_member', 'practical_total_money', 'practical_sponsorship', 'practical_ap_money',
        'satisfaction_survey_url', 'fund_details_url', 'activity_files_url', 'publicity_links', 'oa_links'
      ];

      const fieldsToUpdate = summaryFields.filter(field => updateData[field] !== undefined);
      values = fieldsToUpdate.map(field => updateData[field]);
      const placeholders = fieldsToUpdate.map(field => `${field.toLowerCase()} = ?`).join(', ');
      query = `UPDATE activities SET ${placeholders}, status = 3 WHERE id = ?`;
    } else {
      throw new Error('Invalid activity status for update');
    }

    values.push(id);

    try {
      const [result] = await db.execute(query, values);

      if (result.affectedRows === 0) {
        throw new Error('Activity not found or no changes made');
      }

      return { ...updateData, id };
    } catch (error) {
      console.error('SQL Error:', error);
      throw error;
    }
  }

  static async getActivityById(id) {
    const [rows] = await db.execute('SELECT * FROM activities WHERE id = ?', [id]);
    if (rows.length === 0) {
      throw new Error('Activity not found');
    }
    return rows[0];
  }
}

module.exports = ActivityModel;