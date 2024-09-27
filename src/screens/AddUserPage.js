/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-27 13:36:06
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-27 15:19:33
 * @FilePath: /YLC/src/screens/AddUserPage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createInviteCode } from '../api/inviteCodeApi';  // 添加这行导入

const CustomRadioButton = ({ label, value, selectedValue, onSelect }) => (
  <TouchableOpacity style={styles.radioItem} onPress={() => onSelect(value)}>
    <FontAwesome
      name={selectedValue === value ? 'check-circle' : 'circle-o'}
      size={24}
      color={selectedValue === value ? '#1989fa' : '#666'}
    />
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

const AddUserPage = () => {
  const [radio, setRadio] = useState('2');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const addUser = async () => {
    if (!code) {
      Alert.alert('错误', '请输入邀请码');
      return;
    }

    try {
      const type = radio === '1' ? 3 : 0;  // 3 表示开放不受限端口，0 表示不开放
      const response = await createInviteCode(code, name, type);
      
      if (response.success) {
        Alert.alert('成功', `邀请码 ${code} 已创建`);
        setCode('');
        setName('');
        setRadio('2');
      } else {
        Alert.alert('错误', response.message || '创建邀请码失败');
      }
    } catch (error) {
      console.error('Add user error:', error);
      Alert.alert('错误', error.message || '创建邀请码时发生错误');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>添加小程序用户端使用用户</Text>

      <Text style={styles.title}>是否为其开通不受限预约端口</Text>
      <View style={styles.radioContainer}>
        <CustomRadioButton
          label="确定为其开放不受限端口"
          value="1"
          selectedValue={radio}
          onSelect={setRadio}
        />
        <CustomRadioButton
          label="不为其开放不受限端口"
          value="2"
          selectedValue={radio}
          onSelect={setRadio}
        />
      </View>

      <Text style={styles.title}>用户ID (将作为邀请码)</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          onChangeText={setCode}
          value={code}
          placeholder="输入需要注册用户的wxID（将作为邀请码）"
        />
      </View>

      <Text style={styles.title}>备注姓名*（可选）</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="pencil" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="输入需要注册用户的姓名"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={addUser}>
        <FontAwesome name="plus" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>邀请用户</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: 'black',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  radioContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1989fa',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddUserPage;