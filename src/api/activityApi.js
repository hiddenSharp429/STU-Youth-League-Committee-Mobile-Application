/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:32:38
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-27 20:53:19
 * @FilePath: /YLC/src/api/activityApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { handleApiError } from './apiUtils';

const API_URL = 'http://localhost:3000/api';

export const addActivity = async (activityData) => {
  try {
    const response = await axios.post(`${API_URL}/activity`, activityData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '提交活动申请失败');
  }
};