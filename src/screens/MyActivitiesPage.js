import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import BottomTabNavigator from '../components/BottomTabNavigator';

const ActivityItem = ({ item, onPress, onSummarize }) => (
  <TouchableOpacity style={styles.activityItem} onPress={() => onPress(item._id)}>
    <View>
      <Text>活动名称：{item.a1_huodongName}</Text>
      <Text style={styles.eventTime}>活动开始时间：{item.a2_startTime}</Text>
    </View>
    {item.state === 0 && (
      <View style={styles.state_0}>
        <Text style={styles.stateContent}>审核中</Text>
      </View>
    )}
    {item.state === 1 && (
      <View style={styles.state_1}>
        <Text style={styles.stateContent}>已通过</Text>
        <TouchableOpacity style={styles.summarizeButton} onPress={() => onSummarize(item._id)}>
          <Text style={styles.summarizeButtonText}>活动总结</Text>
        </TouchableOpacity>
      </View>
    )}
    {item.state === 2 && (
      <View style={styles.state_2}>
        <Text style={styles.stateContent}>已驳回</Text>
        <Text style={styles.rejectReason}>驳回理由：{item.rejectReason}</Text>
      </View>
    )}
    <Image 
      source={item.state === 0 ? require('../../assets/icons/yellow.png') : 
             item.state === 1 ? require('../../assets/icons/green.png') : 
             require('../../assets/icons/red.png')} 
      style={styles.statusDot}
    />
  </TouchableOpacity>
);

const MyActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    fetchActivities();
    fetchTotalCount();
  }, [currentPage]);

  const fetchActivities = async () => {
    try {
      const data = await getMyActivities(currentPage);
      setActivities(data);
    } catch (error) {
      Alert.alert('错误', '获取活动列表失败');
    }
  };

  const fetchTotalCount = async () => {
    try {
      const { total } = await getUserInfo();
      setTotalRecord(total);
      setTotalPage(Math.ceil(total / 4));
    } catch (error) {
      console.error('获取总数失败', error);
    }
  };

  const handleActivityPress = (id) => {
    navigation.navigate('EventDetail', { id, user: 'stu', type: '1' });
  };

  const handleSummarize = (id) => {
    navigation.navigate('Summarize', { id });
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
          <Text style={styles.title}>我发起的活动</Text>
          <Text style={styles.comment}>共{totalRecord}条记录</Text>
        </View>
        {activities.length === 0 ? (
          <View style={styles.noData}>
            <Image source={require('../../assets/icons/noData.png')} style={styles.noDataImage} />
            <Text style={styles.noDataText}>很抱歉，暂无活动记录哦</Text>
          </View>
        ) : (
          <FlatList
            data={activities}
            renderItem={({ item }) => (
              <ActivityItem 
                item={item} 
                onPress={handleActivityPress}
                onSummarize={handleSummarize}
              />
            )}
            keyExtractor={item => item._id}
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
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    position: 'relative',
  },
  eventTime: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  state_0: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFA500',
    padding: 5,
    borderRadius: 5,
  },
  state_1: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
  },
  state_2: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#F44336',
    padding: 5,
    borderRadius: 5,
  },
  stateContent: {
    color: 'white',
    fontSize: 12,
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
    position: 'absolute',
    left: 15,
    bottom: 15,
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

export default MyActivitiesPage;