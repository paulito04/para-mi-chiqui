import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const letterImage = require('../assets/letter.png');

const hearts = [
  { id: 1, size: 22, top: 90, left: 34, opacity: 0.35 },
  { id: 2, size: 26, top: 150, right: 36, opacity: 0.38 },
  { id: 3, size: 20, top: 240, left: 110, opacity: 0.3 },
  { id: 4, size: 30, top: 330, right: 70, opacity: 0.28 },
  { id: 5, size: 24, top: 520, left: 46, opacity: 0.32 },
  { id: 6, size: 28, top: 610, right: 32, opacity: 0.3 },
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
          <Text style={styles.subtitle}>Una cartita retro para mi chiqui favorita.</Text>
        </View>
      </View>

      <Pressable style={styles.button} onPress={() => console.log('ABRIR')}>
        <Text style={styles.buttonText}>Abrir 💌</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12363a',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 34,
  },
  heartsLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  heart: {
    position: 'absolute',
    color: '#5a3b59',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  titleAccent: {
    color: '#95e6a8',
  },
  titleMain: {
    color: '#ffffff',
  },
  window: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#2a1c1b',
    backgroundColor: '#f3e4dc',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  windowHeader: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f1cfc6',
    borderBottomWidth: 2,
    borderBottomColor: '#2a1c1b',
  },
  windowDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2a1c1b',
  },
  windowDotRed: {
    backgroundColor: '#f37a76',
  },
  windowDotYellow: {
    backgroundColor: '#f6d365',
  },
  windowDotGreen: {
    backgroundColor: '#78d391',
  },
  windowBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 26,
    gap: 16,
  },
  letterImage: {
    width: '100%',
    height: 190,
  },
  subtitle: {
    color: '#2c1d1c',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#f2c355',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 18,
    borderWidth: 2,
    borderColor: '#2a1c1b',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  buttonText: {
    color: '#2a1c1b',
    fontSize: 16,
    fontWeight: '700',
  },
});
