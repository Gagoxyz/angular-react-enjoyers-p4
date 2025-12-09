import { Stack, Link, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, ImageBackground, StyleSheet, View, Pressable } from "react-native";
import { images } from "../assets/images/images";

import Ionicons from '@expo/vector-icons/Ionicons';


function CustomHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();

  const isHome = segments.length === 0 || segments[0] === "";
  // en expo-router "/" => segments = []

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <Image source={images.logo} style={styles.logo} />

      <Link href={"/"} style={styles.title}>Equipo Basket</Link>
      {/* Botón de retroceso solo cuando NO estás en la Home */}
      {!isHome && (
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-circle-sharp" size={40} color="white" />
        </Pressable>
      )}
    </View>
  );
}

export default function Layout() {
  return (
    <ImageBackground
      source={images.background}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.provider}>
        <Stack
          screenOptions={{
            header: () => <CustomHeader />,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </SafeAreaProvider>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  provider: {
    flex: 1,
  },

  header: {
    width: "100%",
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#E44D26",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    left: 16,
    bottom: 10,
    padding: 6,
  },

  backText: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
  },

  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
});
