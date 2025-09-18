import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function LoginScreen() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    console.log("📦 로그인 요청 데이터:", { userId, password });
    try {
      const response = await axios.post(
        "http://172.30.1.53:8080/users/login" /*개인포트변경*/,
        {
          userId,
          password,
        }
      );

      const data = response.data;

      if (data.success) {
        console.log("✅ 로그인 성공:", data);

        const {
          userId,
          characterName,
          lives,
          totalRecycleCount,
          highestScore,
        } = data;

        // 로그인 성공 → 게임 메인 페이지로 이동 + 데이터 전달
        router.replace({
          pathname: "/user/gamemain",
          params: {
            userId,
            characterName,
            lives,
            recycleCount: totalRecycleCount,
            highestScore,
          },
        });

        Alert.alert("로그인 성공", `환영합니다, ${userId}님!`);
      } else {
        console.log("❌ 로그인 실패:", data.message);
        Alert.alert("로그인 실패", data.message);
      }
    } catch (error) {
      console.error("❌ 로그인 에러:", error.response?.data || error.message);
      Alert.alert("로그인 실패", "아이디 또는 비밀번호를 확인해 주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* logo_image */}
      <Image
        source={require("../../assets/images/login_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          style={styles.input}
          value={userId}
          onChangeText={setUserId}
        />

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/*
       <Pressable
          onPress={() => console.log("비밀번호 찾기")}
          style={({ pressed }) => pressed && { opacity: 0.8 }}
        >
          {({ pressed }) => (
            <Text style={[styles.forgot, pressed && styles.forgotPressed]}>
              비밀번호를 잊어버리셨나요?
            </Text>
          )}
        </Pressable>
      */}

        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>로그인</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/user/registration")}
          >
            <Text style={styles.buttonText}>회원가입</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE066",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 60,
    marginTop: 100,
  },

  inputContainer: {
    width: "80%",
    marginTop: 80,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    color: "#757575",
    marginTop: 14,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginTop: 10,
  },
  /*forgot: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
   
  },*/
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 24,
    height: 45,
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#BDBDBD",
  },
  buttonPressed: {
    fontWeight: "900",
    backgroundColor: "#ECECEC",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#757575",
  },
});
