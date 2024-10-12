/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-10-12 01:26:10
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-12 23:36:56
 * @FilePath: /YLC/src/api/apiConfig.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import getEnvVars from '../config/env';

// 这里我们可以设置当前环境，比如 'dev' 'staging' 'prod'
const currentEnv = 'prod';

const { API_URL } = getEnvVars(currentEnv);

export default API_URL;