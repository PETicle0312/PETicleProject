import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";

export default function StartScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/user/login");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/peticle_userlogo.png")}
        style={styles.characterImage}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE066",
    justifyContent: "center",
    alignItems: "center",
  },
  characterImage: {
    width: 300,
  },
});
