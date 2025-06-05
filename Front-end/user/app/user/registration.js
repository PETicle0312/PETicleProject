import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
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
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [schools] = useState([
    "중앙고등학교",
    "경기고등학교",
    "용산고등학교",
    "무학여자고등학교",
    "서울고등학교",
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>회원가입</Text>

        {/* 학교 입력 필드 */}
        <Text style={styles.label}>학교를 선택해 주세요</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="학교를 입력해 주세요"
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
                style={[styles.buttonText, pressed && styles.buttonTextPressed]}
              >
                학교검색하기
              </Text>
            )}
          </Pressable>
        </View>

        {/*학교검색 모달창 */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* 닫기 버튼 (오른쪽 위) */}
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={28} color="#999" />
              </Pressable>

              {/* 검색창 */}
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

              {/* 학교 리스트 */}
              <FlatList
                data={schools.filter((item) =>
                  item.includes(schoolSearch.trim())
                )}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.schoolItem}
                    onPress={() => {
                      console.log("선택된 학교:", item);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.schoolItemText}>{item}</Text>
                  </Pressable>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* 학번 입력 필드 */}
        <Text style={styles.label}>학번을 입력해 주세요</Text>
        <View style={styles.row}>
          <TextInput style={styles.inputFlex} keyboardType="numeric" />
          <Pressable
            onPress={() => Alert.alert("학번 확인", "학번이 인증되었습니다!")}
            style={({ pressed }) => [
              styles.buttonSmall,
              pressed && styles.buttonSmallPressed,
            ]}
          >
            {({ pressed }) => (
              <Text
                style={[styles.buttonText, pressed && styles.buttonTextPressed]}
              >
                학번인증하기
              </Text>
            )}
          </Pressable>

          {/*이름*/}
        </View>
        <Text style={styles.label}>이름</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="이름을 입력해 주세요"
          />
        </View>

        {/* 휴대폰 번호 */}
        <Text style={styles.label}>휴대폰 번호</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="휴대폰 번호"
            keyboardType="phone-pad"
          />
          <Pressable
            onPress={() => Alert.alert("인증 확인", "인증이 완료되었습니다!")}
            style={({ pressed }) => [
              styles.buttonSmall,
              pressed && styles.buttonSmallPressed,
            ]}
          >
            {({ pressed }) => (
              <Text
                style={[styles.buttonText, pressed && styles.buttonTextPressed]}
              >
                &ensp;&ensp;인증하기&nbsp;&ensp;
              </Text>
            )}
          </Pressable>
          {/*<Pressable
            onPress={() => Alert.alert("인증번호가 전송 되었습니다!")}
            style={({ pressed }) => [
              styles.buttonSmall,
              pressed && styles.buttonSmallPressed,
            ]}
          >
            {({ pressed }) => (
              <Text
                style={[styles.buttonText, pressed && styles.buttonTextPressed]}
              >
                인증번호받기
              </Text>
            )}
          </Pressable> */}
        </View>
        {/*<View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="인증번호를 입력하세요"
            keyboardType="number-pad"
          />
          <Pressable
            onPress={() => Alert.alert("인증 확인", "인증이 완료되었습니다!")}
            style={({ pressed }) => [
              styles.buttonSmall,
              pressed && styles.buttonSmallPressed,
            ]}
          >
            {({ pressed }) => (
              <Text
                style={[styles.buttonText, pressed && styles.buttonTextPressed]}
              >
                &ensp;&ensp;인증하기&nbsp;&ensp;
              </Text>
            )}
          </Pressable>
        </View>*/}

        {/* 아이디 */}
        <Text style={styles.label}>아이디</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="아이디를 입력해 주세요"
          />
          <Pressable
            onPress={() => {
              const inputId = "testuser"; // 실제론 TextInput의 state값
              const existingIds = ["testuser", "user123", "admin"]; // 예시 DB

              if (existingIds.includes(inputId)) {
                Alert.alert("중복된 아이디", "이미 사용 중인 아이디입니다.", [
                  { text: "확인", onPress: () => console.log("확인 눌림") },
                  { text: "취소", style: "cancel" },
                ]);
              } else {
                Alert.alert("사용 가능", "사용 가능한 아이디입니다.");
              }
            }}
            style={({ pressed }) => [
              styles.buttonSmall,
              pressed && styles.buttonSmallPressed,
            ]}
          >
            {({ pressed }) => (
              <Text
                style={[styles.buttonText, pressed && styles.buttonTextPressed]}
              >
                &ensp;&ensp;중복확인&nbsp;&ensp;
              </Text>
            )}
          </Pressable>
        </View>

        {/* 비밀번호 */}
        <Text style={styles.label}>비밀번호</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="비밀번호를 입력해 주세요"
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="비밀번호를 다시 한번 입력해 주세요"
          />
        </View>
        <Text style={styles.hint}>
          6~20자 / 영문, 대문자, 소문자, 숫자, 특수문자 중 2가지 이상 조합
        </Text>

        {/* 가입하기 */}
        <Pressable
          onPress={() =>
            Alert.alert("축하드립니다", "PETicle 가입이 완료되었습니다!", [
              {
                text: "확인",
                onPress: () => router.replace("/user/login"),
              },
            ])
          }
          style={({ pressed }) => [
            styles.buttonSmall,
            pressed && styles.buttonSmallPressed,
          ]}
        >
          {({ pressed }) => (
            <Text
              style={[styles.submitText, pressed && styles.buttonTextPressed]}
            >
              가입하기
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const BASE_HEIGHT = 48;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputschool: {
    flex: 0.73,
    height: BASE_HEIGHT,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  inputFlex: {
    flex: 1,
    height: BASE_HEIGHT,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  buttonSmall: {
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  buttonSmallPressed: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    marginBottom: 12,
  },

  buttonTextPressed: {
    color: "#333",
  },
  submitButton: {
    height: BASE_HEIGHT,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  /* 학교 모달(바텀시트) */
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    padding: 20,
    flex: 0.6,
  },
  modalCloseButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
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
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
    paddingRight: 8,
  },
  schoolItem: {
    paddingVertical: 12,
  },
  schoolItemText: {
    fontSize: 17,
    color: "#333",
  },
});
