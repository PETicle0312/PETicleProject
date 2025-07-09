import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from "react-native";

/*개인포트 변경 5개*/

export default function RegisterScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [name, setName] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [schoolResults, setSchoolResults] = useState([]);
  const [schoolId, setSchoolId] = useState(null); // schoolId 저장

  // 학교 검색 API 호출
  const fetchSchools = async (keyword) => {
    try {
      const response = await axios.get(
        `http://172.30.1.87:8080/api/school/search?keyword=${keyword}` /*개인포트변경*/
      );
      console.log("📦 학교 API 응답:", response.data); // ✅ 이 줄 추가
      setSchoolResults(response.data);
    } catch (error) {
      console.error("❌ 학교 검색 실패:", error);
    }
  };

  // 학번 인증 API 호출
  const verifyStudent = async () => {
    console.log("인증 요청 →", { studentNumber });
    try {
      const response = await axios.post(
        "http://172.30.1.87:8080/api/school/verify" /*개인포트변경*/,
        { studentNumber }
      );
      Alert.alert("인증 성공", response.data);
    } catch (error) {
      console.error("❌ 학번 인증 실패:", error);
      Alert.alert("인증 실패", "입력한 정보가 올바르지 않습니다.");
    }
  };

  // 휴대폰 형식 인증
  const verifyPhoneNumber = async () => {
    console.log(phone);
    try {
      const response = await axios.post(
        "http://172.30.1.87:8080/users/verify-phone" /*개인포트변경*/,
        { phoneNumber: phone }
      );
      Alert.alert("인증 성공", response.data);
    } catch (error) {
      console.error("❌ 휴대폰 인증 실패:", error);
      Alert.alert("인증 실패", "휴대폰 번호 형식이 올바르지 않습니다.");
    }
  };

  // 학교 검색이 있을 때마다 API 호출
  useEffect(() => {
    if (schoolSearch.trim().length > 0) {
      fetchSchools(schoolSearch.trim());
    } else {
      setSchoolResults([]);
    }
  }, [schoolSearch]);

  // 아이디 중복 확인 함수
  const checkIdDuplicate = async () => {
    const idPattern = /^[a-zA-Z0-9]{6,12}$/;
    if (!idPattern.test(userId)) {
      Alert.alert(
        "잘못된 아이디",
        "아이디는 6-12자의 영문, 숫자만 사용 가능합니다."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://172.30.1.87:8080/users/check-id" /*개인포트변경*/,
        // 아이디 중복 확인 API URL
        { userId: userId }
      );

      if (response.data === "사용 가능한 아이디입니다.") {
        console.log("✅ 아이디 중복 확인 성공:", response.data);
        Alert.alert("아이디 확인", "사용 가능한 아이디입니다.");
      } else {
        Alert.alert("아이디 중복", "이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("❌ 아이디 확인 실패:", error);
      Alert.alert("아이디 확인 실패", "아이디 확인 중 문제가 발생했습니다.");
    }
  };

  // 회원가입 처리 함수
  const handleRegister = async () => {
    // 비밀번호 확인
    console.log("✅ 비밀번호:", password); // 비밀번호 출력
    console.log("✅ 비밀번호 확인:", confirmPassword); // 비밀번호 확인 출력

    if (password !== confirmPassword) {
      Alert.alert("비밀번호 불일치", "비밀번호가 일치하지 않습니다.");
      return;
    }

    // 🔥 schoolId 확인 로그
    console.log("🔥 최종 등록 schoolId:", schoolId);

    // API 호출
    try {
      const response = await axios.post(
        "http://172.30.1.87:8080/users/register" /*개인포트변경*/,
        {
          userId,
          password,
          confirmPassword, // ← 이 필드 꼭 들어가야 함!
          phone,
          name,
          studentNumber,
          schoolId,
          charName: "default",
          imageUrl: "",
        }
      );
      console.log("✅ 회원가입 성공:", response.data);
      Alert.alert("가입 성공", "회원가입이 완료되었습니다!", [
        { text: "확인", onPress: () => router.replace("/user/login") },
      ]);
    } catch (error) {
      console.error("❌ 회원가입 실패:", error);
      Alert.alert("오류", "회원가입 중 문제가 발생했습니다.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>회원가입</Text>

            {/* 학교 선택 */}
            <Text style={styles.label}>학교를 선택해 주세요</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputFlex}
                value={schoolName}
                editable={false}
              />
              <Pressable
                onPress={() => setModalVisible(true)}
                style={({ pressed }) => [
                  styles.buttonSmall,
                  pressed && styles.buttonSmallPressed,
                ]}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.buttonText,
                      pressed && styles.buttonTextPressed,
                    ]}
                  >
                    학교검색하기
                  </Text>
                )}
              </Pressable>
            </View>

            {/* 학교 검색 모달 */}
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Pressable
                    style={styles.modalCloseButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={28} color="#999" />
                  </Pressable>

                  <View style={styles.modalSearchRow}>
                    <TextInput
                      style={styles.modalSearchInput}
                      placeholder="학교를 입력해 주세요"
                      value={schoolSearch}
                      onChangeText={setSchoolSearch}
                      placeholderTextColor="#aaa"
                    />
                    <Ionicons name="search" size={22} color="#999" />
                  </View>

                  <FlatList
                    data={schoolResults}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <Pressable
                        style={styles.schoolItem}
                        onPress={() => {
                          console.log("✅ 선택한 학교 item:", item);
                          setSchoolName(item.schoolName); // 사용자에게 보여줄 이름
                          setSchoolId(item.schoolId); // 백엔드에 보낼 schoolId
                          setModalVisible(false);
                        }}
                      >
                        <Text style={styles.schoolItemText}>
                          {" "}
                          {item.schoolName}
                        </Text>
                      </Pressable>
                    )}
                  />
                </View>
              </View>
            </Modal>

            {/* 학번 */}
            <Text style={styles.label}>학번을 입력해 주세요</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputFlex}
                keyboardType="numeric"
                value={studentNumber}
                onChangeText={setStudentNumber}
              />
              <Pressable
                onPress={verifyStudent}
                style={({ pressed }) => [
                  styles.buttonSmall,
                  pressed && styles.buttonSmallPressed,
                ]}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.buttonText,
                      pressed && styles.buttonTextPressed,
                    ]}
                  >
                    학번인증하기
                  </Text>
                )}
              </Pressable>
            </View>

            {/* 이름 */}
            <Text style={styles.label}>이름</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputFlex}
                placeholder="이름을 입력해 주세요"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* 휴대폰 번호 */}
            <Text style={styles.label}>휴대폰 번호</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputFlex}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <Pressable
                onPress={verifyPhoneNumber}
                style={({ pressed }) => [
                  styles.buttonSmall,
                  pressed && styles.buttonSmallPressed,
                ]}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.buttonText,
                      pressed && styles.buttonTextPressed,
                    ]}
                  >
                    인증하기
                  </Text>
                )}
              </Pressable>
            </View>

            {/* 아이디 */}
            <Text style={styles.label}>아이디</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.inputFlex}
                placeholder="아이디를 입력해 주세요"
                value={userId}
                onChangeText={setUserId}
              />

              <Pressable
                onPress={checkIdDuplicate} // 여기에 아이디 중복 확인 함수 연결
                style={({ pressed }) => [
                  styles.buttonSmall,
                  pressed && styles.buttonSmallPressed,
                ]}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.buttonText,
                      pressed && styles.buttonTextPressed,
                    ]}
                  >
                    중복확인
                  </Text>
                )}
              </Pressable>
            </View>

            {/* 비밀번호 */}
            <Text style={styles.label}>비밀번호</Text>
            <View style={[styles.row, { position: "relative" }]}>
              <TextInput
                style={[styles.inputFlex, { paddingRight: 40 }]}
                placeholder="비밀번호를 입력해 주세요"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={22}
                  color="#999"
                />
              </Pressable>
            </View>

            <View style={styles.row}>
              <TextInput
                style={styles.inputFlex}
                placeholder="비밀번호를 다시 한번 입력해 주세요"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            <Text style={styles.hint}>
              6~20자 / 영문, 대문자, 소문자, 숫자, 특수문자 중 2가지 이상 조합
            </Text>

            {/* 가입하기 */}
            <Pressable
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.buttonSmall,
                pressed && styles.buttonSmallPressed,
              ]}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.submitText,
                    pressed && styles.buttonTextPressed,
                  ]}
                >
                  가입하기
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const BASE_HEIGHT = 48;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 18,
    marginBottom: 6,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  inputFlex: {
    flex: 1,
    height: BASE_HEIGHT,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  buttonSmall: {
    height: BASE_HEIGHT,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  buttonSmallPressed: { backgroundColor: "#ccc" },
  buttonText: { fontSize: 15, color: "#333", fontWeight: "500" },
  buttonTextPressed: { color: "#333" },
  hint: { fontSize: 12, color: "#999", marginTop: 4, marginBottom: 12 },
  submitText: { fontSize: 16, fontWeight: "600", color: "#333" },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flex: 0.6,
  },
  modalCloseButton: { position: "absolute", top: 12, right: 12, zIndex: 10 },
  modalSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 40,
    marginBottom: 16,
  },
  modalSearchInput: { flex: 1, fontSize: 16, paddingRight: 8 },
  schoolItem: { paddingVertical: 12 },
  schoolItemText: { fontSize: 17, color: "#333" },
  eyeIcon: { position: "absolute", right: 14, top: 13 },
});
