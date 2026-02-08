import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const letterImage = require('../assets/letter.png');

const hearts = [
  { id: 1, size: 18, top: 80, left: 24, opacity: 0.35 },
  { id: 2, size: 28, top: 140, right: 30, opacity: 0.4 },
  { id: 3, size: 22, top: 220, left: 80, opacity: 0.3 },
  { id: 4, size: 34, top: 300, right: 70, opacity: 0.28 },
  { id: 5, size: 20, top: 420, left: 40, opacity: 0.35 },
  { id: 6, size: 26, top: 520, right: 20, opacity: 0.32 },
];

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartsLayer} pointerEvents="none">
        {hearts.map((heart) => (
          <Text
            key={heart.id}
            style={[
              styles.heart,
              {
                fontSize: heart.size,
                top: heart.top,
                left: heart.left,
                right: heart.right,
                opacity: heart.opacity,
              },
            ]}
          >
            ♥
          </Text>
        ))}
      </View>

      <Text style={styles.title}>
        <Text style={styles.titleAccent}>Valentine </Text>
        <Text style={styles.titleMain}>Letter</Text>
      </Text>

      <View style={styles.window}>
        <View style={styles.windowHeader}>
          <View style={[styles.windowDot, styles.windowDotRed]} />
          <View style={[styles.windowDot, styles.windowDotYellow]} />
          <View style={[styles.windowDot, styles.windowDotGreen]} />
        </View>
        <View style={styles.windowBody}>
          <Image source={letterImage} style={styles.letterImage} resizeMode="contain" />
        </View>
      </View>

      <Text style={styles.subtitle}>Una cartita retro para mi chiqui favorita.</Text>

      <Pressable style={styles.button} onPress={() => console.log('ABRIR')}>
        <Text style={styles.buttonText}>Abrir 💌</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b2d22',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  heartsLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  heart: {
    position: 'absolute',
    color: '#3d7a63',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 28,
    textAlign: 'center',
  },
  titleAccent: {
    color: '#4ade80',
  },
  titleMain: {
    color: '#ffffff',
  },
  window: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#b7e0cc',
    backgroundColor: '#123328',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  windowHeader: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1b4234',
  },
  windowDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  windowDotRed: {
    backgroundColor: '#ff6b6b',
  },
  windowDotYellow: {
    backgroundColor: '#ffd166',
  },
  windowDotGreen: {
    backgroundColor: '#6ee7b7',
  },
  windowBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  letterImage: {
    width: '100%',
    height: 210,
  },
  subtitle: {
    color: '#e6f5ed',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 999,
  },
  buttonText: {
    color: '#0b2d22',
    fontSize: 16,
    fontWeight: '700',
  },
});
