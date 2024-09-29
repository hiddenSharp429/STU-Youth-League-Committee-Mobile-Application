import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { getMyActivities, getMyActivitiesCount } from '../api/activityApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ActivityItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.activityItem} onPress={() => onPress(item)}>
    <View>
      <Text style={styles.activityName}>活动名称：{item.activity_name}</Text>
      <Text style={styles.eventTime}>开始时间：{new Date(item.start_date).toLocaleDateString()}</Text>
      <Text style={styles.eventTime}>结束时间：{new Date(item.end_date).toLocaleDateString()}</Text>
      <Text style={styles.eventDetail}>组织：{item.organization}</Text>
      <Text style={styles.eventDetail}>负责人：{item.responsible_name}</Text>
    </View>
    {item.status === 3 && (
      <View style={styles.state_3}>
        <Text style={styles.stateContent}>已提交</Text>
      </View>
    )}
    {item.status === 4 && (
      <View style={styles.state_4}>
        <Text style={styles.stateContent}>已归档</Text>
      </View>
    )}
  </TouchableOpacity>
);

const HistoryActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [userId, setUserId] = useState(null);
  const [needRefresh, setNeedRefresh] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        Alert.alert('错误', '用户未登录');
        navigation.navigate('Login');
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchActivities();
      fetchTotalCount();
    }
  }, [userId, currentPage]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = navigation.getState().routes.find(r => r.name === 'HistoryActivities')?.params;
      if (params?.needRefresh) {
        setNeedRefresh(true);
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (needRefresh && userId) {
      fetchActivities();
      fetchTotalCount();
      setNeedRefresh(false);
    }
  }, [needRefresh, userId]);

  const fetchActivities = async () => {
    try {
      const data = await getMyActivities(userId, [3, 4], currentPage, 4);
      setActivities(data.activities || []);
      if (data.activities.length === 0 && currentPage > 1) {
        setCurrentPage(prev => Math.max(prev - 1, 1));
      }
    } catch (error) {
      console.error('获取历史活动列表失败', error);
      Alert.alert('错误', '获取历史活动列表失败');
    }
  };

  const fetchTotalCount = async () => {
    try {
      const { total } = await getMyActivitiesCount(userId, [3, 4]);
      setTotalRecord(total);
      setTotalPage(Math.ceil(total / 4)); // 假设每页显示4条记录
    } catch (error) {
      console.error('获取总数失败', error);
    }
  };

  const handleActivityPress = (activity) => {
    navigation.navigate('EventDetail', { 
      activityId: activity.id,
      activity: activity,
      user: 'stu',
      type: 'history'
    });
  };

  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    } else {
      Alert.alert('提示', '已经到最后一页');
    }
  };

  const lastPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      Alert.alert('提示', '已经是第一页了');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>历史活动</Text>
          <Text style={styles.comment}>共{totalRecord}条记录</Text>
        </View>
        {activities.length === 0 ? (
          <View style={styles.noData}>
            <Image source={require('../../assets/icons/noData.png')} style={styles.noDataImage} />
            <Text style={styles.noDataText}>很抱歉，暂无历史活动记录哦</Text>
          </View>
        ) : (
          <FlatList
            data={activities}
            renderItem={({ item }) => (
              <ActivityItem 
                item={item} 
                onPress={handleActivityPress}
              />
            )}
            keyExtractor={item => item.id.toString()}
          />
        )}
        {activities.length > 0 && (
          <View style={styles.pagination}>
            <TouchableOpacity style={styles.pageButton} onPress={lastPage}>
              <Icon name="chevron-left" size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.currentPageButton}>
              <Text style={styles.currentPageText}>{currentPage}</Text>
            </View>
            <TouchableOpacity style={styles.pageButton} onPress={nextPage}>
              <Icon name="chevron-right" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <BottomTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (保持与 MyActivitiesPage 相同的样式)
  state_3: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#607D8B',
    padding: 10,
    borderTopLeftRadius: 0,   
    borderTopRightRadius: 15,   
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0 
  },
  state_4: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#7986CB',
    padding: 10,
    borderTopLeftRadius: 0,   
    borderTopRightRadius: 15,   
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0 
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  comment: {
    fontSize: 13,
    color: '#666',
  },
  noData: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noDataImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  activityItem: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTime: {
    color: '#666',
    fontSize: 14,
    marginBottom: 3,
  },
  eventDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
  stateContent: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  summarizeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderColor: '#43CF7C',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
  summarizeButtonText: {
    color: '#727885',
    fontSize: 12,
  },
  rejectReason: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    color: 'brown',
    fontSize: 12,
  },
  statusDot: {
    width: 11,
    height: 11,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  pageButton: {
    backgroundColor: '#ececea',
    width: 35,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  currentPageButton: {
    backgroundColor: '#666666',
    width: 35,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  currentPageText: {
    color: 'white',
  },
});

export default HistoryActivitiesPage;