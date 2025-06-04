import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [managerId, setManagerId] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    // TODO: 로그인 처리 로직
    //alert('로그인 시도!!!'); 
    router.push("/admin/admin_main");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.logoBox}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="관리자 번호"
          placeholderTextColor="#999"
          value={managerId}
          onChangeText={setManagerId}
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={onLogin}>
        <Text style={styles.loginBtnText}>로그인</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -50,
  },
  logoBox: {
    //marginTop: -50, // 이 값을 더 크게 하면 아래로, 더 작게 하면 위로!
    alignItems: 'center',
  },
  logo: {
    width: 110,
    height: 110,
  },
  inputBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30, 
  },
  input: {
    width: '100%',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'transparent',
    fontSize: 15,
    marginBottom: 16,
    color: '#333',
    paddingHorizontal: 6,
  },
  loginBtn: {
    width: '100%',
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 32,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5D5D5',
  },
  loginBtnText: {
    fontSize: 16,
    color: '#818181',
    fontWeight: 'bold',
  },
});
