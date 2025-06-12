// app/user/_layout.js

import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        animation: "fade",
        gestureEnabled: true,
        headerShown: false,
      }}
    />
  );
}
