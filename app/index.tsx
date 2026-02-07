import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { HeartBackground } from '@/components/heart-background';
import { RetroWindow } from '@/components/retro-window';
import { valentineData } from '@/src/data/valentine';

export default function HomeScreen() {
  const router = useRouter();
  const [titleFirst, titleSecond] = valentineData.titulo.split(' ');

  return (
    <SafeAreaView style={styles.screen}>
      <HeartBackground />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, styles.titleGreen]}>{titleFirst}</Text>
          <Text style={[styles.title, styles.titleWhite]}>{titleSecond}</Text>
        </View>

        <RetroWindow style={styles.window} contentStyle={styles.windowContent}>
          <Text style={styles.windowEmoji}>💟</Text>
          <Text style={styles.windowText}>Una cartita retro para mi chiqui favorita.</Text>
        </RetroWindow>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir carta"
          style={styles.primaryButton}
          onPress={() => router.push('/question')}>
          <Text style={styles.primaryButtonText}>Abrir 💌</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f2a33',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  titleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 1,
  },
  titleGreen: {
    color: '#7bd389',
  },
  titleWhite: {
    color: '#ffffff',
  },
  window: {
    width: '100%',
    maxWidth: 320,
  },
  windowContent: {
    alignItems: 'center',
    gap: 12,
  },
  windowEmoji: {
    fontSize: 44,
  },
  windowText: {
    textAlign: 'center',
    color: '#3a2c2a',
    fontSize: 16,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3a2c2a',
    backgroundColor: '#f2c94c',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d2d2d',
  },
});
