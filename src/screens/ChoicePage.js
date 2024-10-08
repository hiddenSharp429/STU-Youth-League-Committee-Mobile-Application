import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Overlay, Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../api/authApi';
import LoginOverlay from '../components/LoginOverlay';
import PatternLock from '../components/PatternLock';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ChoicePage = () => {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApprovalOverlay, setShowApprovalOverlay] = useState(false);
  const [approvalType, setApprovalType] = useState('');
  const [showPatternLock, setShowPatternLock] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {

  }, []);

  const goNext = () => {
    console.log('点击了审批端登录');
    Alert.alert(
      '选择审批端类型',
      '请选择要登录的审批端类型',
      [
        {
          text: '审批活动端',
          onPress: () => {
            setApprovalType('activity');
            setShowApprovalOverlay(true);
          }
        },
        {
          text: '审批预约端',
          onPress: () => {
            setApprovalType('appointment');
            setShowApprovalOverlay(true);
          }
        },
        {
          text: '取消',
          style: 'cancel'
        }
      ]
    );
  };

  const handleApprovalLogin = async () => {
    // 这里实现审批端登录逻辑
    console.log(`Logging in to ${approvalType} approval system`);
    // 可以根据 approvalType 调用不同的登录 API
    // 预约端
    if (approvalType === 'appointment') {
      try {
        const response = await loginUser(account, password, 2);
        if (response.success) {
        navigation.navigate('TeacherAppointmentApproval');
      } else {
        Alert.alert('错误', response.message);
        }
      } catch (error) {
        handleLoginError(error);
      }
    }
    // 活动端
    else if (approvalType === 'activity') {
      try {
        const response = await loginUser(account, password, 1);
        if (response.success) {
          navigation.navigate('TeacherActivityApproval');
        } else {
          Alert.alert('错误', response.message);
        }
      } catch (error) {
        handleLoginError(error);
      }
    }
    setShowApprovalOverlay(false);
  };

  const goIndex = async () => {
    setShow(true);
    console.log('点击了用户登录');
  };

  const onClickHide = () => {
    setShow(false);
    setShowApprovalOverlay(false);
  };

  const handleRegister = (loginType) => {
    onClickHide();
    let type;
    switch(loginType) {
      case 'user':
        type = 0;
        break;
      case 'activity':
        type = 1;
        break;
      case 'appointment':
        type = 2;
        break;
      default:
        type = 0;
    }
    navigation.navigate('Register', { type });
  };

  const lookGuide = () => {
    Alert.alert(
      '选择指南',
      '',
      [
        {
          text: '团团活动管理操作手册',
          onPress: () => {
            Alert.alert(
              '团团活动管理操作手册',
              'https://docs.qq.com/doc/DYlpRa096eEFXemVU',
              [
                { text: '取消', style: 'cancel' },
                { text: '复制地址', onPress: () => {/* 实现复制功能 */} }
              ]
            );
          }
        },
        {
          text: '团团活动管理更新日志',
          onPress: () => {
            Alert.alert(
              '团团活动管理更新日志',
              'https://docs.qq.com/pdf/DYkhBdU9IWkNZSGdX?',
              [
                { text: '取消', style: 'cancel' },
                { text: '复制地址', onPress: () => {/* 实现复制功能 */} }
              ]
            );
          }
        },
        { text: '取消', style: 'cancel' }
      ]
    );
  };

  const enterIndex = async () => {
    if (!account || !password) {
      Alert.alert('错误', '请输入账号和密码');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(account, password, 0);
      await handleLoginSuccess(response);
      navigateToMyActivities();
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (data) => {
    if (data.success) {
      await AsyncStorage.setItem('userId', data.userId.toString());
      setShow(false); // 隐藏登录弹窗
    } else {
      throw new Error(data.message || '登录失败');
    }
  };

  const navigateToMyActivities = () => {
    navigation.navigate('MyActivities');
  };

  const handleLoginError = (error) => {
    console.error('Login error:', error);
    Alert.alert('登录失败', error.message);
  };


  const goRetrieve = () => {
    // 暂时不开放找回密码功能
    Alert.alert('告知', '找回密码功能暂未开放');
  };

  const enterUserManagementPage = () => {
    Alert.alert(
      '管理员验证',
      '请输入管理员图案密码',
      [
        {
          text: '取消',
          style: 'cancel'
        },
        {
          text: '确定',
          onPress: () => {
            setShowPatternLock(true);
          }
        }
      ]
    );
  };

  const copyGitHubLink = () => {
    Alert.alert(
      '告知',
      '本项目为开源项目，22年开始开发，目前作者已大四，至今仍在独自维护该项目，下附仓库链接，欢迎大家star并提出宝贵意见，谢谢！',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '复制链接', 
          onPress: () => {
            // 实现复制功能
            Alert.alert('链接已复制');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <Divider style={styles.divider} />
        <Text style={styles.dividerText}>团团活动管理</Text>
        <Divider style={styles.divider} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, {backgroundColor: '#D43030'}]} onPress={goIndex}>
          <Text style={[styles.buttonText, {color: 'white'}]}>用户端登录</Text>
          <FontAwesome name="users" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, {backgroundColor: '#FFFFFF'}]} onPress={goNext}>
          <Text style={[styles.buttonText, {color: 'black'}]}>审批端登录</Text>
          <FontAwesome name="user" size={24} color="black" />
        </TouchableOpacity>
      </View>


      <Text style={styles.versionTip}>v1.0</Text>

      <TouchableOpacity style={styles.githubButton} onPress={copyGitHubLink}>
        <FontAwesome name="github" size={50} color="black" />
      </TouchableOpacity>


      <TouchableOpacity style={styles.guideButton} onPress={lookGuide}>
        <Text style={styles.guideText}>手册及日志</Text>
        <FontAwesome name="book" size={70} color="brown" />
      </TouchableOpacity>


      <TouchableOpacity style={styles.addUserButton} onPress={enterUserManagementPage}>
        <Text style={styles.addUserText}>添加用户</Text>
        <FontAwesome name="user-plus" size={60} color="brown" />
      </TouchableOpacity>

      <View style={styles.footerDividerContainer}>
        <Divider style={styles.footerDivider} />
        <Text style={styles.footerText}>@Author:hiddenSharp429(ZiXian Zhu)</Text>
        <Divider style={styles.footerDivider} />
      </View>

      <Overlay isVisible={show} onBackdropPress={onClickHide} overlayStyle={styles.overlay}>
        <LoginOverlay 
          account={account}
          setAccount={setAccount}
          password={password}
          setPassword={setPassword}
          onClose={onClickHide}
          onLogin={enterIndex}
          onRegister={() => handleRegister('user')}
          onRetrieve={goRetrieve}
          loginType="user"
        />
      </Overlay>

      <Overlay isVisible={showApprovalOverlay} onBackdropPress={onClickHide} overlayStyle={styles.overlay}>
        <LoginOverlay 
          account={account}
          setAccount={setAccount}
          password={password}
          setPassword={setPassword}
          onClose={onClickHide}
          onLogin={handleApprovalLogin}
          onRegister={() => handleRegister(approvalType)}
          onRetrieve={goRetrieve}
          loginType={approvalType}
        />
      </Overlay>

      <Overlay 
        isVisible={showPatternLock} 
        onBackdropPress={() => setShowPatternLock(false)}
        overlayStyle={styles.patternLockOverlay}
      >
        <View style={styles.patternLockContainer}>
          <PatternLock
            onSuccess={() => {
              setShowPatternLock(false);
              navigation.navigate('UserManagement');
            }}
            onFailure={() => {
              Alert.alert('错误', '图案密码不正确');
              setShowPatternLock(false);
            }}
          />
        </View>
      </Overlay>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 50,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginTop: 180,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 225,
    height: 50,
    marginVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    marginRight: 10,
  },
  versionTip: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    fontSize: 15,
    color: 'gray',
  },
  githubButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  guideButton: {
    position: 'absolute',
    right: 20,
    bottom: 35,
    alignItems: 'center',
  },
  guideText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'brown',
  },
  addUserButton: {
    position: 'absolute',
    bottom: 35,
    left: 20,
  },
  addUserText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'brown',
  },
  footerDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '90%',
  },
  footerDivider: {
    flex: 1,
  },
  footerText: {
    paddingHorizontal: 10,
    fontSize: 12,
    color: 'gray',
  },
  overlay: {
    width: '90%',
    height: 'auto',
    borderRadius: 20,
    padding: 0,
  },
  patternLockOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  patternLockContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChoicePage;