import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

const arrowLeft = require('../../assets/images/arrow_left.png');

//핸드폰 번호 자동 하이픈 함수
function formatPhoneNumber(value) {
  // 숫자만 남기기
  const numbers = value.replace(/\D/g, '');
  if (numbers.length < 4) return numbers;
  if (numbers.length < 8) {
    return `${numbers.slice(0,3)}-${numbers.slice(3)}`;
  }
  return `${numbers.slice(0,3)}-${numbers.slice(3,7)}-${numbers.slice(7,11)}`;
}

export default function AdminAccountEditScreen() {
  // state 추가
  const [phone, setPhone] = useState('010-0312-5678');
  const [certCode, setCertCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={arrowLeft} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>관리자 계정정보 변경</Text>
      </View>

      {/* 내용 */}
      <View style={styles.content}>
        {/* 관리자 번호 */}
        <View style={[styles.row, {marginTop:6}]}>
          <Text style={styles.labelBold}>관리자 번호</Text>
          <Text style={styles.valueGray}>ARHS152DD</Text>
        </View>
        {/* 담당지역 */}
        <View style={styles.row}>
          <Text style={styles.labelBold}>관리자 담당지역</Text>
          <Text style={styles.valueGray}>서울 종로구</Text>
        </View>
        {/* 이름 */}
        <View style={styles.row}>
          <Text style={styles.labelBold}>관리자 이름</Text>
          <Text style={styles.valueGray}>김○○</Text>
        </View>
      {/* --- 휴대폰 번호 + 인증 버튼 --- */}
      <View style={styles.formGroup}>
        <Text style={styles.labelBold}>휴대폰 번호</Text>
        <View style={styles.inputRow}>
      <TextInput
        style={styles.phoneValue}
        value={phone}
        onChangeText={txt => setPhone(formatPhoneNumber(txt))}
        keyboardType="phone-pad"
        placeholder="휴대폰 번호 입력"
        onFocus={() => {
          if (!isEditing) {
            setPhone('');
            setIsEditing(true);
          }
        }}
      />
          <TouchableOpacity style={styles.certBtn}>
            <Text style={styles.certBtnText}>인증</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.underline} />
      </View>

      {/* --- 인증번호 입력 + 확인 버튼 --- */}
      <View style={styles.formGroup}>
        <View style={styles.inputRow}>
        <TextInput
          style={styles.certInput}
          value={certCode}
          onChangeText={setCertCode}
          placeholder="인증번호 입력"
          placeholderTextColor="#BDBDBD"
          keyboardType="number-pad"
        />
          <TouchableOpacity style={styles.certBtn}>
            <Text style={styles.certBtnText}>확인</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.underline} />
      </View>

        {/* 수정완료 버튼 */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>수정완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ===== 스타일 =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
    paddingTop: 38,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom:16,
    justifyContent: 'space-between',
    borderBottomWidth:1,
    borderBottomColor:'#ddd',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#888',
    position:'absolute',
    top: -12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  content: {
    flex: 1,
    marginHorizontal: 28,
    marginTop: 10,
  },
  row: {
    marginBottom: 18,
  },
  formGroup: {
    marginBottom: 10,
    marginTop: 10,
  },
  labelBold: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between', // 굳이 필요 없음, 오른쪽 버튼만 marginLeft
  },
  valueGray: {
    color: '#888',
    fontSize: 15,
    marginBottom: 6,
  },
  phoneRow: {
    marginBottom: 14,
  },
  phoneValue: {
    fontSize: 15,
    color: '#888',
    flex: 1,
    paddingVertical: 4,
  },
  certInput: {
    fontSize: 15,
    color: '#222',
    flex: 1,
    paddingVertical: 4,
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  authBtn: {
    backgroundColor: '#BDBDBD',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 5,
    marginLeft: 6,
  },
  authBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  certBtn: {
    backgroundColor: '#888',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 5,
    marginLeft: 8,
  },
  certBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    paddingTop:4, paddingBottom:4
  },
  underline: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 5,
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 15,
    paddingVertical: 7,
    color: '#222',
  },
  checkBtn: {
    backgroundColor: '#BDBDBD',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 5,
    marginLeft: 8,
  },
  divider: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginVertical: 18,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 32,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5D5D5',
  },
  buttonText: {
    fontSize: 16,
    color: '#818181',
    fontWeight: 'bold',
  },
});

