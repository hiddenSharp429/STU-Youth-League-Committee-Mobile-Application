/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-10-11 19:13:00
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-12 23:55:15
 * @FilePath: /YLC/src/config/env.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Platform } from 'react-native';

const ENV = {
  dev: {
    API_URL: Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api',
  },
  staging: {
    API_URL: 'http://43.136.80.11:3000/api',
  },
  prod: {
    API_URL: 'http://43.136.80.11:3000/api',
  }
};

const getEnvVars = (env = 'dev') => {
  // 确保 env 是有效的键
  if (ENV.hasOwnProperty(env)) {
    return ENV[env];
  }
  // 如果提供的 env 无效，返回 dev 环境
  console.warn(`Invalid environment "${env}" specified, falling back to "dev".`);
  return ENV.dev;
};

export default getEnvVars;