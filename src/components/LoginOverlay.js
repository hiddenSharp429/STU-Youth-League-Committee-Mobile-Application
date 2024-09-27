import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';

const LoginOverlay = ({ 
  account, 
  setAccount, 
  password, 
  setPassword, 
  onClose, 
  onLogin, 
  onRegister, 
  onRetrieve,
  loginType = 'user' // 新增 loginType 属性，默认为 'user'
}) => {
  const getTitle = () => {
    switch(loginType) {
      case 'user':
        return '用户登录';
      case 'activity':
        return '审批活动端登录';
      case 'appointment':
        return '审批预约端登录';
      default:
        return '登录';
    }
  };

  return (
    <View style={styles.loginOverlay}>
      <View style={styles.loginHead}>
        <Text style={styles.title}>{getTitle()}</Text>
        <TouchableOpacity style={styles.cross} onPress={onClose}>
          <Icon name="close" type="ionicon" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.loginBody}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Account</Text>
          <Input
            placeholder="输入账号"
            onChangeText={setAccount}
            value={account}
            containerStyle={styles.input}
            autoFocus
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <Input
            placeholder="输入密码"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            containerStyle={styles.input}
          />
        </View>
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={onRegister}>
            <Text style={styles.link}>注册账号</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRetrieve}>
            <Text style={styles.link}>忘记密码</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.loginFeet}>
        <Button
          title="登录"
          onPress={onLogin}
          buttonStyle={styles.loginButton}
          containerStyle={styles.loginButtonContainer}
        />
        <Text style={styles.clientSide}>
          {loginType === 'user' ? 'Client Side' : 'Admin Side'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginOverlay: {
    width: '100%',
    height: 550,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  loginHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D43030',
  },
  cross: {
    padding: 10,
  },
  loginBody: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 5,
  },
  input: {
    width: '100%',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  link: {
    color: '#D43030',
    fontSize: 14,
  },
  loginFeet: {
    alignItems: 'center',
    marginTop: 30,
  },
  loginButtonContainer: {
    width: '88%',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#D43030',
    borderRadius: 20,
    paddingVertical: 12,
  },
  clientSide: {
    fontSize: 24,
    color: 'gray',
    marginTop: 20,
  }
});

export default LoginOverlay;