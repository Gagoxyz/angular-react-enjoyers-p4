import { Stack, Link, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, ImageBackground, StyleSheet, View, Pressable, Alert } from "react-native"; // <--- Agregué Alert aquí
import { useEffect } from "react"; // <--- Agregué useEffect
import messaging from "@react-native-firebase/messaging"; // <--- Importamos la librería de mensajería
import { images } from "../assets/images/images";
import Ionicons from '@expo/vector-icons/Ionicons';

function CustomHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();

  const isHome = segments.length === 0 || segments[0] === "";

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <Image source={images.logo} style={styles.logo} />

      <Link href={"/"} style={styles.title}>Equipo Basket</Link>
      
      {!isHome && (
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-circle-sharp" size={40} color="white" />
        </Pressable>
      )}
    </View>
  );
}

export default function Layout() {

  // --- 🔔 LÓGICA DE NOTIFICACIONES PUSH (Añadida) ---
  useEffect(() => {
    const setupNotifications = async () => {
      // 1. Pedir permiso al usuario (necesario en iOS y Android 13+)
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Estado de autorización:', authStatus);
        
        // 2. Suscribirse al tema "updates" para escuchar a la Cloud Function
        await messaging().subscribeToTopic('updates');
        console.log('✅ App suscrita al canal "updates"');
      }
    };

    setupNotifications();

    // 3. Escuchar mensajes cuando la App está abierta (Foreground)
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Mensaje recibido en primer plano:', remoteMessage);
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
    });

    return unsubscribe; // Limpiar suscripción al desmontar
  }, []);
  // ---------------------------------------------------

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