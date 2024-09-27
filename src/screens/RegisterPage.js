import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useRoute, useNavigation } from '@react-navigation/native';
import { registerUser } from '../api/authApi';
import { checkInviteCode } from '../api/inviteCodeApi';

const RegisterScreen = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isCheck, setIsCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { type } = route.params;

  const getTitle = () => {
    switch(type) {
      case 0:
        return '用户端注册界面';
      case 1:
        return '审批活动端注册界面';
      case 2:
        return '审批预约端注册界面';
      default:
        return '注册界面';
    }
  };

  const handleRegister = async () => {
    if (!account || !password || !name || !isCheck) {
      Alert.alert('错误', '请填写所有信息并验证邀请码');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(account, password, name, type, inviteCode);
      Alert.alert('成功', '注册成功', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('错误', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkInviteCodeHandler = async () => {
    if (!inviteCode) {
      Alert.alert('错误', '请输入邀请码');
      return;
    }

    setIsLoading(true);
    try {
      await checkInviteCode(inviteCode, type);
      setIsCheck(true);
      Alert.alert('成功', '邀请码验证成功');
    } catch (error) {
      Alert.alert('错误', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleFont}>{getTitle()}</Text>
      </View>

      <Text style={styles.notice}>
        注：当前为注册页面，不收集您的个人信息，您只需要注册账号以及登录的密码（只作为登录该应用的密匙），如弹出已注册成功，确认账号密码姓名无误后，则可进入相应端口进行登录。
      </Text>

      <Text style={styles.headline}>注 册</Text>

      <Text style={styles.subTitle}>注册账号</Text>
      <Input
        placeholder="请输入账号（推荐使用校园网账号）"
        value={account}
        onChangeText={setAccount}
      />

      <Text style={styles.subTitle}>注册密码</Text>
      <Input
        placeholder="请输入密码"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.subTitle}>账号姓名</Text>
      <Input
        placeholder="请输入姓名"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.subTitle}>填写邀请码</Text>
      <Input
        placeholder="请输入邀请码"
        value={inviteCode}
        onChangeText={setInviteCode}
        rightIcon={
          <Button
            title="验证邀请码"
            onPress={checkInviteCodeHandler}
            type="clear"
            loading={isLoading}
          />
        }
      />

      <Button
        title="注册"
        onPress={handleRegister}
        buttonStyle={styles.registerButton}
        containerStyle={styles.buttonContainer}
        loading={isLoading}
        disabled={!isCheck || isLoading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(247, 248, 250)',
  },
  title: {
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  titleFont: {
    fontSize: 20,
    fontFamily: 'Segoe UI',
  },
  notice: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  headline: {
    fontSize: 50,
    textAlign: 'center',
    marginVertical: 20,
  },
  subTitle: {
    marginLeft: 10,
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: '#D43030',
    borderRadius: 10,
  },
  buttonContainer: {
    width: '88%',
    alignSelf: 'center',
    marginTop: 30,
  },
});

export default RegisterScreen;