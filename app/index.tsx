import { useRouter } from "expo-router";
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      {/* Fondo con corazones */}
      <View style={styles.bg}>
        <Text style={[styles.heart, { top: 80, left: 30 }]}>💗</Text>
        <Text style={[styles.heart, { top: 140, right: 40, opacity: 0.35 }]}>💞</Text>
        <Text style={[styles.heart, { bottom: 120, left: 60, opacity: 0.25 }]}>💕</Text>
        <Text style={[styles.heart, { bottom: 90, right: 55, opacity: 0.35 }]}>💓</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          <Text style={styles.titleGreen}>Valentine</Text>{" "}
          <Text style={styles.titleWhite}>Letter</Text>
        </Text>

        {/* Ventana retro */}
        <View style={styles.window}>
          <View style={styles.windowTop}>
            <View style={[styles.dot, { backgroundColor: "#f36d6d" }]} />
            <View style={[styles.dot, { backgroundColor: "#f3d36d" }]} />
            <View style={[styles.dot, { backgroundColor: "#7fe08a" }]} />
          </View>

          <View style={styles.windowBody}>
            {/* Imagen del sobre/carta */}
            <Image
              source={require("../assets/letter.png")}
              style={styles.envelopeImage}
              resizeMode="contain"
            />

            <Text style={styles.subtitle}>Una cartita retro para mi chiqui favorita.</Text>
          </View>
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/envelope")}
          accessibilityRole="button"
          accessibilityLabel="Abrir carta"
        >
          <Text style={styles.buttonText}>Abrir 💌</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#12353b",
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  heart: {
    position: "absolute",
    fontSize: 26,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    marginBottom: 18,
  },
  titleGreen: {
    color: "#8ee09a",
  },
  titleWhite: {
    color: "#ffffff",
  },
  window: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 18,
    backgroundColor: "#f7efe8",
    borderWidth: 3,
    borderColor: "#2b1d1d",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 8,
  },
  windowTop: {
    height: 44,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f0d1c8",
    borderBottomWidth: 3,
    borderBottomColor: "#2b1d1d",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#2b1d1d",
  },
  windowBody: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 14,
  },
  envelopeImage: {
    width: 220,
    height: 170,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#2b1d1d",
    fontWeight: "600",
  },
  button: {
    marginTop: 18,
    backgroundColor: "#f0c44b",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#2b1d1d",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2b1d1d",
  },
});

