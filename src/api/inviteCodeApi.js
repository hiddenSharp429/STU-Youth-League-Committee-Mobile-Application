/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 15:04:33
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-12 01:30:41
 * @FilePath: /YLC/src/api/inviteCodeApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { handleApiError } from './apiUtils';
import API_URL from './apiConfig';

export const checkInviteCode = async (code, type) => {
  try {
    const response = await axios.post(`${API_URL}/invite-codes/check`, { code, type });
    return response.data;
  } catch (error) {
    throw handleApiError(error, '验证邀请码失败');
  }
};

export const createInviteCode = async (code, name, type) => {
  try {
    const response = await axios.post(`${API_URL}/invite-codes`, { code, name, type });
    return response.data;
  } catch (error) {
    throw handleApiError(error, '创建邀请码失败');
  }
};

export const getInviteCodes = async () => {
  try {
    const response = await axios.get(`${API_URL}/invite-codes`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '获取邀请码列表失败');
  }
};

export const deleteInviteCode = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/invite-codes/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '删除邀请码失败');
  }
};

// 其他邀请码相关的 API