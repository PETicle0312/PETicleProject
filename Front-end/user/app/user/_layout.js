import { Slot, Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        animation: "fade",
        gestureEnabled: true,
        headerShown: false,
      }}
    >
      <Slot />
    </Stack>
  );
}
