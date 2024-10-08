/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 15:04:21
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-05 23:51:49
 * @FilePath: /YLC/src/api/userApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { handleApiError } from './apiUtils';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '获取用户列表失败');
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '删除用户失败');
  }
};

export const getUserNameById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '获取用户名失败');
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/info/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '获取用户信息失败');
  }
};

// 其他用户相关的 API