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
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const arrowLeft = require("../../assets/images/arrow_left.png");
const chevronRight = require("../../assets/images/arrow_left.png"); // 필요시 아이콘 재활용
const BASE_URL = "http://172.18.38.26:8080";

// 서버 없을 때 사용할 기본 지역 172.30.1.66
const REGION_FALLBACK = [
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구",
];

export default function AdminAccountEditScreen() {
  const [adminId, setAdminId] = useState("");
  const [region, setRegion] = useState("");
  const [name, setName] = useState(""); // 표시만 (수정 불가)
  const [phone, setPhone] = useState(""); // 입력, 포맷팅
  const [regions, setRegions] = useState(REGION_FALLBACK);
  const [regionModalVisible, setRegionModalVisible] = useState(false);

  const router = useRouter();
  const onBack = () => router.back();

  // 휴대폰 포맷 (010-1234-5678)
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.startsWith("02")) {
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
      if (digits.length <= 9)
        return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
      return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(
        6,
        10
      )}`;
    } else {
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(
        7,
        11
      )}`;
    }
  };

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const storedId = await AsyncStorage.getItem("adminId");
        if (!storedId) return;

        const res = await axios.get(`${BASE_URL}/api/admin/${storedId}/info`);
        setAdminId(res.data.adminId);
        setRegion(res.data.region || "");
        setName(res.data.name || "");
        // 화면에는 하이픈 포함 포맷으로 보여주기
        setPhone(res.data.phone ? formatPhone(res.data.phone) : "");
      } catch (err) {
        console.error("❌ 관리자 정보 불러오기 실패:", err);
        Alert.alert("오류", "관리자 정보를 불러올 수 없습니다.");
      }
    };

    const fetchRegions = async () => {
      try {
        const r = await axios.get(`${BASE_URL}/api/regions`); // 있으면 사용
        if (Array.isArray(r.data) && r.data.length > 0) setRegions(r.data);
      } catch (_) {
        // 엔드포인트 없으면 fallback 유지
      }
    };

    fetchAdminInfo();
    fetchRegions();
  }, []);

  const onChangePhone = (txt) => setPhone(formatPhone(txt));

  const handleSave = async () => {
    try {
      if (!region) {
        Alert.alert("확인", "담당지역을 선택해주세요.");
        return;
      }

      // 전송 전 정규화
      const normalizedPhone = phone.replace(/\D/g, ""); // 숫자만
      const trimmedRegion = region.trim();

      if (!normalizedPhone || normalizedPhone.length < 10) {
        Alert.alert("확인", "휴대폰 번호를 올바르게 입력해주세요.");
        return;
      }

      // 서버가 phone 혹은 phoneNumber를 기대할 수 있어 둘 다 전송(하나는 무시될 수 있음)
      const payload = {
        region: trimmedRegion,
        phone: normalizedPhone,
        phoneNumber: normalizedPhone,
      };
      const url = `${BASE_URL}/api/admin/${adminId}/info`; // 조회와 동일 패턴로 저장
      console.log("🔵 요청 URL:", url, "바디:", payload);

      const res = await axios.put(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("🟢 수정 성공:", res.data);

      // 메인에서 지역 재조회에 활용
      await AsyncStorage.setItem("adminRegion", trimmedRegion);

      Alert.alert("완료", "관리자 정보가 변경되었습니다.");
      router.back();
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "알 수 없는 오류";
      console.error("❌ 관리자 정보 수정 실패:", err?.response || err);
      Alert.alert("오류", `변경 실패: ${serverMsg}`);
    }
  };

  const openRegionPicker = () => setRegionModalVisible(true);
  const closeRegionPicker = () => setRegionModalVisible(false);
  const selectRegion = (value) => {
    setRegion(value);
    closeRegionPicker();
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

        {/* 담당지역: 선택 모달 */}
        <View style={styles.row}>
          <Text style={styles.labelBold}>관리자 담당지역</Text>
          <Pressable style={styles.selectBox} onPress={openRegionPicker}>
            <Text
              style={[
                styles.selectText,
                region ? styles.selectTextFilled : styles.placeholder,
              ]}
            >
              {region || "담당지역 선택"}
            </Text>
            <Image
              source={chevronRight}
              style={[styles.arrowIcon, { transform: [{ rotate: "180deg" }] }]}
            />
          </Pressable>
        </View>

        {/* 휴대폰 번호 */}
        <View style={styles.formGroup}>
          <Text style={styles.labelBold}>휴대폰 번호</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.phoneValue}
              value={phone}
              onChangeText={onChangePhone}
              keyboardType="phone-pad"
              placeholder="휴대폰 번호 입력"
              maxLength={13}
            />
            <TouchableOpacity
              style={styles.certBtn}
              onPress={() =>
                Alert.alert("안내", "휴대폰 인증 기능은 추후 연동 예정입니다.")
              }
            >
              <Text style={styles.certBtnText}>인증</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.underline} />
        </View>

        {/* 저장 */}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>수정완료</Text>
        </TouchableOpacity>
      </View>

      {/* 지역 선택 모달 */}
      <Modal
        visible={regionModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeRegionPicker}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>담당지역 선택</Text>
              <TouchableOpacity onPress={closeRegionPicker}>
                <Text style={styles.modalClose}>닫기</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={regions}
              keyExtractor={(item, idx) => `${item}-${idx}`}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.regionItem}
                  onPress={() => selectRegion(item)}
                >
                  <Text style={styles.regionText}>{item}</Text>
                  {region === item && <Text style={styles.checkMark}>✓</Text>}
                </Pressable>
              )}
              contentContainerStyle={{ paddingBottom: 8 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F6F6", paddingTop: 65 },
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
  content: { flex: 1, marginHorizontal: 28, marginTop: 20 },
  row: { marginBottom: 24 },
  formGroup: { marginBottom: 18, marginTop: 18 },
  labelBold: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginBottom: 6,
  },
  valueGray: { color: "#888", fontSize: 15, marginBottom: 6 },
  selectBox: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: { fontSize: 15 },
  selectTextFilled: { color: "#222" },
  placeholder: { color: "#aaa" },
  readonlyUnderline: { height: 1, backgroundColor: "#ddd", marginTop: 5 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  phoneValue: { fontSize: 15, color: "#222", flex: 1, paddingVertical: 8 },
  certBtn: {
    backgroundColor: "#888",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 8,
  },
  certBtnText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  underline: { height: 1, backgroundColor: "#ddd", marginTop: 5 },
  button: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 40,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D5D5D5",
  },
  buttonText: { fontSize: 16, color: "#818181", fontWeight: "bold" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 10,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
  modalClose: { fontSize: 14, color: "#777" },
  separator: { height: 1, backgroundColor: "#f0f0f0", marginLeft: 20 },
  regionItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  regionText: { fontSize: 15, color: "#222" },
  checkMark: { fontSize: 16, color: "#4CAF50", marginLeft: 8 },
});
