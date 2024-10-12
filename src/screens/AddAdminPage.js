import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createInviteCode } from '../api/inviteCodeApi';
import globalStyles from '../config/globalStyles';
const CustomRadioButton = ({ label, value, selectedValue, onSelect }) => (
  <TouchableOpacity style={styles.radioItem} onPress={() => onSelect(value)}>
    <FontAwesome
      name={selectedValue === value ? 'check-circle' : 'circle-o'}
      size={24}
      color={selectedValue === value ? '#1989fa' : '#666'}
    />
    <Text style={[styles.radioLabel, globalStyles.text]}>{label}</Text>
  </TouchableOpacity>
);

const AddAdminPage = () => {
  const [radio, setRadio] = useState('1');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const addUser = async () => {
    if (!code) {
      Alert.alert('错误', '请输入邀请码');
      return;
    }

    try {
      const type = radio === '1' ? 1 : 2;  // 1 表示审批活动端，2 表示审批预约端
      const response = await createInviteCode(code, name, type);
      
      if (response.success) {
        Alert.alert('成功', `邀请码 ${code} 已创建`);
        setCode('');
        setName('');
        setRadio('1');
      } else {
        Alert.alert('错误', response.message || '创建邀请码失败');
      }
    } catch (error) {
      console.error('Add admin error:', error);
      Alert.alert('错误', error.message || '创建邀请码时发生错误');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.noticeBar}>
        <FontAwesome name="info-circle" size={24} color="#1989fa" />
        <Text style={styles.noticeText}>
          请在下方先选择端口再输入你的注册时的账号。若有修改账号密码的需求可联系相关负责人。
        </Text>
      </View>

      <Text style={styles.header}>添加小程序审批端使用用户</Text>

      <Text style={[styles.title, globalStyles.text]}>选择其对应的审批端:</Text>
      <View style={styles.radioContainer}>
        <CustomRadioButton
          label="活动审批端"
          value="1"
          selectedValue={radio}
          onSelect={setRadio}
        />
        <CustomRadioButton
          label="预约审批端"
          value="2"
          selectedValue={radio}
          onSelect={setRadio}
        />
      </View>

      <Text style={[styles.title, globalStyles.text]}>用户ID (将作为邀请码)</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={[styles.input, globalStyles.textInput]}
          onChangeText={setCode}
          value={code}
          placeholder="输入需要注册用户的wxID（将作为邀请码）"
          placeholderTextColor={globalStyles.placeholderText.color}
        />
      </View>

      <Text style={[styles.title, globalStyles.text]}>备注姓名*（可选）</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="pencil" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="输入需要注册用户的姓名"
          placeholderTextColor={globalStyles.placeholderText.color}
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
  noticeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf9ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  noticeText: {
    color: '#1989fa',
    marginLeft: 10,
    flex: 1,
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
    color: '#000000',
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
    color: '#000000',
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

export default AddAdminPage;