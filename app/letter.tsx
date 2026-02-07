import { useEffect, useRef } from 'react';
import { Animated, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { HeartBackground } from '@/components/heart-background';
import { RetroWindow } from '@/components/retro-window';
import { valentineData } from '@/src/data/valentine';

export default function LetterScreen() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <SafeAreaView style={styles.screen}>
      <HeartBackground />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, styles.titleGreen]}>Valentine</Text>
          <Text style={[styles.title, styles.titleWhite]}>Letter</Text>
        </View>

        <Animated.View style={[styles.animatedWindow, { opacity, transform: [{ scale }] }]}>
          <RetroWindow contentStyle={styles.windowContent}>
            <Text style={styles.messageTitle}>{valentineData.mensaje}</Text>
            <Text style={styles.messageSubtitle}>Para {valentineData.nombreChiqui}</Text>
            <View style={styles.details}>
              <Text style={styles.detailLine}>Valentine Date: {valentineData.fecha}</Text>
              <Text style={styles.detailLine}>Hora: {valentineData.hora}</Text>
              <Text style={styles.detailLine}>Lugar: {valentineData.lugar}</Text>
              <Text style={styles.detailLine}>Dress code: {valentineData.dressCode}</Text>
            </View>
            <Text style={styles.heartEmoji}>💌</Text>
          </RetroWindow>
        </Animated.View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver al inicio"
          style={styles.secondaryButton}
          onPress={() => router.replace('/')}>
          <Text style={styles.secondaryButtonText}>Volver</Text>
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
    gap: 20,
  },
  titleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 1,
  },
  titleGreen: {
    color: '#7bd389',
  },
  titleWhite: {
    color: '#ffffff',
  },
  animatedWindow: {
    width: '100%',
    maxWidth: 380,
  },
  windowContent: {
    alignItems: 'center',
    gap: 12,
  },
  messageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3a2c2a',
  },
  messageSubtitle: {
    fontSize: 16,
    color: '#6f4f45',
  },
  details: {
    width: '100%',
    gap: 6,
    paddingVertical: 4,
  },
  detailLine: {
    fontSize: 14,
    color: '#3a2c2a',
  },
  heartEmoji: {
    fontSize: 36,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f7e3d5',
    backgroundColor: '#17343f',
  },
  secondaryButtonText: {
    color: '#f7e3d5',
    fontWeight: '600',
  },
});
