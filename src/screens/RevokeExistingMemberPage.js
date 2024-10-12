import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getUsers, deleteUser } from '../api/userApi';
import globalStyles from '../config/globalStyles';

const UserItem = ({ item, onDelete }) => (
  <SwipeRow rightOpenValue={-65} disableRightSwipe>
    <View style={styles.rowBack}>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
        <FontAwesome name="trash" size={20} color="white" />
      </TouchableOpacity>
    </View>
    <View style={styles.rowFront}>
      <FontAwesome name="user-o" size={20} color="#666" style={styles.icon} />
      <View style={styles.userInfo}>
        <Text style={[styles.userName, globalStyles.text]}>{item.name}</Text>
        <Text style={[styles.userAccount, globalStyles.text]}>{item.account}</Text>
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
    case 0: return '用户端';
    case 3: return '不受限预约端';
    case 1: return '审批活动端';
    case 2: return '审批预约端';
    default: return '未知';
  }
};

const RevokeExistingMemberPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      Alert.alert('错误', '获取用户列表失败');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      Alert.alert('成功', '用户已删除');
    } catch (error) {
      Alert.alert('错误', '删除用户失败');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserItem item={item} onDelete={handleDelete} />}
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

export default RevokeExistingMemberPage;