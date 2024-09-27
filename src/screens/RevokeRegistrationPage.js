/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-27 14:44:12
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-27 15:20:08
 * @FilePath: /YLC/src/screens/RevokeRegistrationPage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getInviteCodes, deleteInviteCode } from '../api/inviteCodeApi';

const InviteCodeItem = ({ item, onDelete }) => (
  <SwipeRow rightOpenValue={-65} disableRightSwipe>
    <View style={styles.rowBack}>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
        <FontAwesome name="trash" size={20} color="white" />
      </TouchableOpacity>
    </View>
    <View style={styles.rowFront}>
      <FontAwesome name="user-o" size={20} color="#666" style={styles.icon} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name || item.code}</Text>
        <Text style={styles.userAccount}>{item.code}</Text>
      </View>
      <View style={styles.tagContainer}>
        <Text style={[styles.tag, { backgroundColor: getTagColor(item.type) }]}>
          {getTagText(item.type)}
        </Text>
      </View>
    </View>
  </SwipeRow>
);

const getTagColor = (type) => {
  switch (type) {
    case 0: return '#7232dd';
    case 3: return '#72d2dd';
    case 1: return '#f2826a';
    case 2: return '#88d27d';
    default: return '#7232dd';
  }
};

const getTagText = (type) => {
  switch (type) {
    case 0: return '用户端未注册';
    case 3: return '不受限预约端未注册';
    case 1: return '审批活动端未注册';
    case 2: return '审批预约端未注册';
    default: return '未知';
  }
};

const RevokeRegistrationPage = () => {
  const [inviteCodes, setInviteCodes] = useState([]);

  useEffect(() => {
    fetchInviteCodes();
  }, []);

  const fetchInviteCodes = async () => {
    try {
      const fetchedInviteCodes = await getInviteCodes();
      setInviteCodes(fetchedInviteCodes);
    } catch (error) {
      Alert.alert('错误', '获取邀请码列表失败');
    }
  };

  const handleDelete = async (inviteCodeId) => {
    try {
      await deleteInviteCode(inviteCodeId);
      setInviteCodes(inviteCodes.filter(code => code.id !== inviteCodeId));
      Alert.alert('成功', '邀请码已删除');
    } catch (error) {
      Alert.alert('错误', '删除邀请码失败');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={inviteCodes}
        renderItem={({ item }) => <InviteCodeItem item={item} onDelete={handleDelete} />}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  rowFront: {
    backgroundColor: 'white',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    flexDirection: 'row',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  deleteBtn: {
    backgroundColor: 'brown',
    justifyContent: 'center',
    alignItems: 'center',
    width: 65,
    height: '100%',
  },
  icon: {
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userAccount: {
    fontSize: 14,
    color: '#666',
  },
  tagContainer: {
    marginLeft: 10,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    color: 'white',
    fontSize: 12,
  },
});

export default RevokeRegistrationPage;