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
  onRetrieve 
}) => (
  <View style={styles.loginOverlay}>
    <View style={styles.loginHead}>
      <Image source={require('../../assets/icons/tuantuan.png')} style={styles.tuantuan} />
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
      <Text style={styles.clientSide}>Client Side</Text>
    </View>
  </View>
);

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
  tuantuan: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
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