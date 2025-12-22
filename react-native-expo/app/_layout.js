import { Stack, Link, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, ImageBackground, StyleSheet, View, Pressable, Alert } from "react-native";
import { useEffect } from "react";
import * as Notifications from 'expo-notifications';

import Ionicons from "@expo/vector-icons/Ionicons";
import messaging from "@react-native-firebase/messaging";

import { images } from "../assets/images/images";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Muestra la alerta visual
    shouldPlaySound: true, // Reproduce sonido
    shouldSetBadge: false,
  }),
});

function CustomHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();

  const isHome = segments.length === 0 || segments[0] === "";

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <Image source={images.logo} style={styles.logo} />

      <Link href={"/"} style={styles.title}>
        Equipo Basket
      </Link>

      {!isHome && (
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-circle-sharp" size={40} color="white" />
        </Pressable>
      )}
    </View>
  );
}

export default function Layout() {

  /* ---- Pedir permisos de notificaciones ---- */
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Notification permission granted:", authStatus);
    }
  };

  useEffect(() => {
    const initNotifications = async () => {
      // 1️⃣ Pedir permisos
      await requestUserPermission();

      // 2️⃣ Obtener token FCM
      const token = await messaging().getToken();
      console.log("FCM Token:", token);

      // 3️⃣ Suscribirse al topic
      await messaging().subscribeToTopic("players");
      console.log("Subscribed to topic: players");
    };

    initNotifications();

    /* ---- App abierta desde notificación (cerrada) ---- */
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Opened app from quit state:",
            remoteMessage.notification
          );
        }
      });

    /* ---- App en background y se abre ---- */
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Opened app from background:",
        remoteMessage.notification
      );
    });
    
    /* ---- Mensajes en background ---- */
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in background:", remoteMessage);
    });
    
    /* ---- Mensajes en foreground ---- */
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification?.title || "Nueva notificación",
        remoteMessage.notification?.body || ""
      );
    });

    return unsubscribe;
  }, []);

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
