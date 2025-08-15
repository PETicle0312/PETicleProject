import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* <StatusBar hidden={true} /> */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* ✅ 로그인 화면에서도 헤더 숨김 */}
        <Stack.Screen
          name="admin/admin_login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="admin/admin_main"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="admin/admin_details/[school]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="admin/admin_phonenumber"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="admin/admin_privacy"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="admin/alarm" options={{ headerShown: false }} />
        <Stack.Screen name="admin/pw_change" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* <StatusBar style="auto" /> */}
      {/*<StatusBar hidden={true} /> */}
    </ThemeProvider>
  );
}
