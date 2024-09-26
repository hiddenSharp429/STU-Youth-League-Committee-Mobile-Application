import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Overlay, Divider, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../api/authApi';
import LoginOverlay from '../components/LoginOverlay';

const ChoicePage = () => {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState('');
  const [openid, setOpenid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {

  }, []);

  const goNext = () => {
    console.log('点击了审批端登录');
    navigation.navigate('NextChoice');
  };

  const goIndex = async () => {
    setShow(true);
    console.log('点击了用户登录');
    // 这里应该检查数据库中是否有对应的openid
    // 如果有，则自动登录
  };

  const onClickHide = () => {
    setShow(false);
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
      const response = await loginUser(account, password);
      await handleLoginSuccess(response);
      navigateToHome();
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

  const navigateToHome = () => {
    // 使用你的导航库（如 React Navigation）导航到主页
    // 例如：navigation.navigate('Home');
  };

  const handleLoginError = (error) => {
    console.error('Login error:', error);
    Alert.alert('登录失败', error.message);
  };

  const goRegister = () => {
    navigation.navigate('Register', { type: 0 });
  };

  const goRetrieve = () => {
    navigation.navigate('Retrieve');
  };

  const enterUserManagementPage = () => {
    // 实现管理员验证和页面跳转逻辑
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
          <Icon name="people" type="ionicon" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, {backgroundColor: '#FFFFFF'}]} onPress={goNext}>
          <Text style={[styles.buttonText, {color: 'black'}]}>审批端登录</Text>
          <Icon name="person" type="ionicon" size={24} color="black" />
        </TouchableOpacity>
      </View>


      <Text style={styles.versionTip}>v1.0</Text>

      <TouchableOpacity style={styles.githubButton} onPress={copyGitHubLink}>
        <Image source={require('../../assets/icons/GitHub.png')} style={styles.githubImage} />
      </TouchableOpacity>


      <TouchableOpacity style={styles.guideButton} onPress={lookGuide}>
        <Text style={styles.guideText}>手册及日志</Text>
        <Image source={require('../../assets/icons/guide.png')} style={styles.guideImage} />
      </TouchableOpacity>


      <TouchableOpacity style={styles.addUserButton} onPress={enterUserManagementPage}>
        <Text style={styles.addUserText}>添加用户</Text>
        <Image source={require('../../assets/icons/addUser.png')} style={styles.addUserImage} />
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
          onRegister={goRegister}
          onRetrieve={goRetrieve}
        />
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
  githubImage: {
    width: 50,
    height: 50,
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
  guideImage: {
    width: 70,
    height: 70,
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
  addUserImage: {
    width: 60,
    height: 60,
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
});

export default ChoicePage;