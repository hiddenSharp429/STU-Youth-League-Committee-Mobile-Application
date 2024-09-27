/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:35:32
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-27 21:01:37
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
      serviceMoney, participantCount, needUploadOA, remark, briefContent
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
      brief_content: briefContent || null
    };

    const fields = Object.keys(processedData).filter(key => processedData[key] !== null);
    const values = fields.map(field => processedData[field]);
    const placeholders = fields.map(() => '?').join(', ');

    const query = `INSERT INTO activities (${fields.join(', ')}) VALUES (${placeholders})`;

    const [result] = await db.execute(query, values);

    return result.insertId;
  }
}

module.exports = ActivityModel;