import React from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ 추가

// 아이콘 import (경로를 실제 폴더 구조에 맞게 조정하세요!)
const userIcon = require("../../assets/images/user_icon.png");
const keyIcon = require("../../assets/images/key_icon.png");
const arrowLeft = require("../../assets/images/arrow_left.png");

export default function AdminPrivacyScreen() {
  const router = useRouter();

  const onBack = () => {
    router.back();
  };
  const onPwd = () => {
    router.push("/admin/pw_change");
  };
  const onPhone = () => {
    router.push("/admin/admin_phonenumber");
  };

  // ✅ 로그아웃 핸들러 추가
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("adminId"); // 저장된 관리자 ID 제거
      // 필요하면 전체 초기화: await AsyncStorage.clear();
      console.log("✅ 로그아웃: adminId 삭제됨");
      router.replace("/admin/admin_login"); // 로그인 화면으로 이동
    } catch (e) {
      console.log("❌ 로그아웃 에러:", e);
      Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 네비게이션 바 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={{ width: 40, alignItems: "flex-start" }}
          onPress={onBack}
        >
          <Image source={arrowLeft} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>관리자 페이지</Text>
        <View style={{ width: 40 }} /> {/* 오른쪽 여백용 */}
      </View>

      {/* 관리자 정보 박스 */}
      <View style={styles.infoBox}>
        <View style={[styles.infoRow, { marginBottom: 15 }]}>
          <Text style={styles.infoLabel}>관리자 번호</Text>
          <Text style={styles.infoValue}>ARHS152DD</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>휴대폰 번호</Text>
          <Text style={styles.infoValue}>010-0312-5678</Text>
        </View>
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuBox}>
        {/* 비밀번호 변경 */}
        <TouchableOpacity
          onPress={onPwd}
          style={[
            styles.menuRow,
            { borderBottomWidth: 1, borderBottomColor: "#F1F1F1" },
          ]}
        >
          <Image source={keyIcon} style={styles.menuIcon} />
          <Text style={styles.menuText}>비밀번호 변경</Text>
          <Image
            source={arrowLeft}
            style={[styles.menuArrow, { transform: [{ rotate: "180deg" }] }]}
          />
        </TouchableOpacity>
        {/* 관리자 계정정보 변경 */}
        <TouchableOpacity onPress={onPhone} style={styles.menuRow}>
          <Image source={userIcon} style={styles.menuIcon} />
          <Text style={styles.menuText}>관리자 계정정보 변경</Text>
          <Image
            source={arrowLeft}
            style={[styles.menuArrow, { transform: [{ rotate: "180deg" }] }]}
          />
        </TouchableOpacity>
      </View>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

// === 스타일 ===
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
    justifyContent: "space-between",
    paddingBottom: 16,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    flex: 1,
  },

  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginHorizontal: 22,
    marginTop: 15,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: "#444",
    fontWeight: "400",
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: "#888",
    fontWeight: "400",
    textAlign: "right",
    position: "absolute",
    right: 0,
  },

  menuBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 22,
    marginBottom: 18,
    paddingVertical: 2,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginLeft: 2,
    resizeMode: "contain",
    tintColor: "#888",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#444",
    fontWeight: "400",
    marginLeft: 14,
  },
  menuArrow: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    tintColor: "#bbb",
  },

  logoutBtn: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 32,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D5D5D5",
    marginHorizontal: 22,
  },
  logoutText: {
    fontSize: 16,
    color: "#818181",
    fontWeight: "bold",
  },
});
