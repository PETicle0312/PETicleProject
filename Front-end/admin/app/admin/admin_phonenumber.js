import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const arrowLeft = require("../../assets/images/arrow_left.png");
const BASE_URL = "http://192.168.123.106:8080"; // ✅ 서버 주소

export default function AdminAccountEditScreen() {
  // DB에서 가져올 값
  const [adminId, setAdminId] = useState("");
  const [region, setRegion] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("010-1111-1111"); // 기본값 (DB랑 아직 연결 X)

  const router = useRouter();
  const onBack = () => router.back();

  // ✅ DB에서 관리자 정보 불러오기
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const storedId = await AsyncStorage.getItem("adminId"); // 로그인한 관리자 ID
        if (!storedId) return;

        const res = await axios.get(`${BASE_URL}/api/admin/${storedId}/info`);
        setAdminId(res.data.adminId);
        setRegion(res.data.region);
        setName(res.data.name);
      } catch (err) {
        console.error("❌ 관리자 정보 불러오기 실패:", err);
        Alert.alert("오류", "관리자 정보를 불러올 수 없습니다.");
      }
    };

    fetchAdminInfo();
  }, []);

  // ✅ 수정 완료 → DB 업데이트
  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/api/admin/${adminId}/info`, {
        region: region,
        name: name,
      });
      Alert.alert("완료", "관리자 정보가 변경되었습니다.");
    } catch (err) {
      console.error("❌ 관리자 정보 수정 실패:", err);
      Alert.alert("오류", "변경 실패");
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={{ width: 40, alignItems: "flex-start" }}
          onPress={onBack}
        >
          <Image source={arrowLeft} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>관리자 계정정보 변경</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 내용 */}
      <View style={styles.content}>
        {/* 관리자 번호 */}
        <View style={[styles.row, { marginTop: 6 }]}>
          <Text style={styles.labelBold}>관리자 번호</Text>
          <Text style={styles.valueGray}>{adminId}</Text>
        </View>

        {/* 담당지역 */}
        <View style={styles.row}>
          <Text style={styles.labelBold}>관리자 담당지역</Text>
          <TextInput
            style={styles.input}
            value={region}
            onChangeText={setRegion}
          />
        </View>

        {/* 이름 */}
        <View style={styles.row}>
          <Text style={styles.labelBold}>관리자 이름</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        {/* 휴대폰 번호 (DB랑 아직 연결 X, 나중에 인증 기능 넣을 수 있음) */}
        <View style={styles.formGroup}>
          <Text style={styles.labelBold}>휴대폰 번호</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.phoneValue}
              value={phone}
              onChangeText={(txt) => setPhone(txt)}
              keyboardType="phone-pad"
              placeholder="휴대폰 번호 입력"
            />
            <TouchableOpacity style={styles.certBtn}>
              <Text style={styles.certBtnText}>인증</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.underline} />
        </View>

        {/* 수정완료 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
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
    backgroundColor: "#F8F6F6",
    paddingTop: 65,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: "#888",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
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
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginBottom: 3,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueGray: {
    color: "#888",
    fontSize: 15,
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 15,
    color: "#222",
    paddingVertical: 4,
  },
  phoneValue: {
    fontSize: 15,
    color: "#888",
    flex: 1,
    paddingVertical: 4,
  },
  certBtn: {
    backgroundColor: "#888",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 5,
    marginLeft: 8,
  },
  certBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    paddingTop: 4,
    paddingBottom: 4,
  },
  underline: {
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 32,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D5D5D5",
  },
  buttonText: {
    fontSize: 16,
    color: "#818181",
    fontWeight: "bold",
  },
});
