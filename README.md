<!--
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-24 11:58:33
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-13 00:35:03
 * @FilePath: /YLC/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# STU-团团活动管理系统

## 前言
由于微信小程序主体认证问题无法解决，而一个好的软件又需要不断迭代，所以就花了两周连夜开发了APP版本，目前APP版本已基本开发完毕，后端API也已基本开发完毕，欢迎大家star并提出宝贵意见，谢谢！

## 支持平台
- Android
- iOS(未测试)

## 技术栈

- 前端：React Native
- 后端：Node.js, Express
- 数据库：MySQL

## 项目概述

这是一个综合的活动管理系统，主要用于管理和审批各种活动和预约。系统包括教师和学生两个主要用户角色，提供活动创建、审批、查看和管理等功能。

## 主要功能

1. 活动管理
   - 创建新活动
   - 查看活动列表
   - 活动详情查看
   - 活动状态更新（审批、驳回、提交总结等）

2. 预约管理
   - 创建预约
   - 预约审批
   - 预约状态查看

3. 用户角色
   - 教师：可以审批活动和预约
   - 学生：可以创建活动和预约，提交活动总结(包括不受限预约用户)

4. 状态流程
   - 活动状态：待审核(0) -> 已通过(1) -> 已提交总结(3) -> 已结束(4)
   - 驳回状态：已驳回(2)

## 技术栈

- 前端：React Native
- 后端：Node.js, Express
- 数据库：MySQL

## 主要组件

1. TeacherActivityApprovalPage：教师活动审批页面
2. EventDetailPage：活动/预约详情页面
3. ActivityModel：活动数据模型
4. ActivityService：活动相关业务逻辑
5. ActivityController：活动相关API控制器

## 安装和运行

1. 克隆仓库
   ```
   git clone [仓库URL]
   ```

2. 安装依赖
   ```
   cd [项目目录]
   npm install
   ```

3. 运行后端服务器
   ```
   cd backend
   npm run dev
   ```

4. 运行前端应用（在新的终端窗口）
   ```
   cd [项目目录]
   npx react-native run-android  # 对于Android
   # 或
   npx react-native run-ios      # 对于iOS
   ```

## API 接口

- GET /api/activity/get/all：获取所有活动
- PUT /api/activity/:id/approve：审批通过活动
- PUT /api/activity/:id/reject：驳回活动
- GET /api/activity/:id：获取单个活动详情
- GET /api/appointment/get/all：获取所有预约
- PUT /api/appointment/:id/approve：审批通过预约
- PUT /api/appointment/:id/reject：驳回预约
- GET /api/appointment/:id：获取单个预约详情 
......


## 贡献指南

欢迎贡献代码，请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request


## 联系方式

@Author: [hiddenSharp429](https://github.com/hiddenSharp429)
@Email: z404878860@163.com
@WeChat: hiddensharp429