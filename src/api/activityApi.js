/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:32:38
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-28 02:56:06
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

export const getMyActivities = async (userId, status, page, limit = 4) => {
  try {
    const response = await axios.get(`${API_URL}/activity/${userId}`, {
      params: { page, limit, status: status.join(',') }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, '获取活动列表失败');
  }
};

export const getMyActivitiesCount = async (userId, status) => {
  try {
    const response = await axios.get(`${API_URL}/activity/${userId}/count`, {
      params: { status: status.join(',') }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, '获取活动总数失败');
  }
};

export const updateActivity = async (activityData) => {
  try {
    const response = await axios.put(`${API_URL}/activity/${activityData.id}`, activityData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '更新活动失败');
  }
};

export const getActivityById = async (activityId) => {
  try {
    const response = await axios.get(`${API_URL}/activity/single/${activityId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '获取活动详情失败');
  }
};