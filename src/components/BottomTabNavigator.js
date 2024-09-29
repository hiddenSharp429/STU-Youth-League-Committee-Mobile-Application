/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 19:14:09
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-29 23:10:05
 * @FilePath: /YLC/src/components/BottomTabNavigator.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const tabItems = [
  {
    name: 'MyActivities',
    text: '我的活动',
    icon: require('../../assets/icons/my-activities.png'),
    selectedIcon: require('../../assets/icons/my-activities-selected.png'),
  },
  {
    name: 'ApplyActivity',
    text: '活动申请',
    icon: require('../../assets/icons/activity-apply.png'),
    selectedIcon: require('../../assets/icons/activity-apply-selected.png'),
  },
  {
    name: 'HistoryActivities',
    text: '活动历史',
    icon: require('../../assets/icons/activity-history.png'),
    selectedIcon: require('../../assets/icons/activity-history-selected.png'),
  },
  {
    name: 'Appointment',
    text: '预约老师',
    icon: require('../../assets/icons/appointment-teacher.png'),
    selectedIcon: require('../../assets/icons/appointment-teacher-selected.png'),
  },
  {
    name: 'AppointmentHistory',
    text: '历史预约',
    icon: require('../../assets/icons/appointment-history.png'),
    selectedIcon: require('../../assets/icons/appointment-history-selected.png'),
  },
];

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      {tabItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.tabItem}
          onPress={() => navigateTo(item.name)}
        >
          <Image
            source={route.name === item.name ? item.selectedIcon : item.icon}
            style={styles.icon}
          />
          <Text style={[
            styles.tabText,
            route.name === item.name && styles.selectedTabText
          ]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabItem: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#C0C0C0',
  },
  selectedTabText: {
    color: '#000000',
  },
});

export default BottomTabNavigator;