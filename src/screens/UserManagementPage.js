/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-27 07:50:38
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-27 14:48:04
 * @FilePath: /YLC/src/screens/UserManagementPage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const GridItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.gridItem} onPress={onPress}>
    <FontAwesome name={icon} size={24} color="brown" />
    <Text style={styles.gridItemText}>{text}</Text>
  </TouchableOpacity>
);

const UserManagement = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <View style={styles.grid}>
          <GridItem
            icon="user-plus"
            text="添加用户端成员"
            onPress={() => navigation.navigate('AddUser')}
          />
          <GridItem
            icon="undo"
            text="撤销成员现有资格"
            onPress={() => navigation.navigate('RevokeExistingMember')}
          />
          <GridItem
            icon="user-secret"
            text="添加审批端成员"
            onPress={() => navigation.navigate('AddAdmin')}
          />
          <GridItem
            icon="ellipsis-h"
            text="撤销成员注册资格"
            onPress={() => navigation.navigate('RevokeRegistration')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  gridItemText: {
    marginTop: 10,
    textAlign: 'center',
  },
});

export default UserManagement;