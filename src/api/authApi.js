/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-26 20:14:02
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-28 23:15:32
 * @FilePath: /YLC/src/api/authApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { handleApiError } from './apiUtils';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export const loginUser = async (account, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { account, password });
    return response.data;
  } catch (error) {
    throw handleApiError(error, '登录失败');
  }
};

export const registerUser = async (account, password, name, type, inviteCode) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { account, password, name, type, inviteCode });
    return response.data;
  } catch (error) {
    throw handleApiError(error, '注册失败');
  }
};

// 其他认证相关的 API，如重置密码等