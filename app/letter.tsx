import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { HeartBackground } from '@/components/heart-background';
import { RetroWindow } from '@/src/components/RetroWindow';

export default function LetterScreen() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [imageError, setImageError] = useState(false);

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
            {imageError ? (
              <View style={styles.missingImage}>
                <Text style={styles.missingImageText}>Carta no encontrada</Text>
              </View>
            ) : (
              <Image
                source={require('../assets/letter.png')}
                resizeMode="contain"
                style={styles.letterImage}
                onError={() => setImageError(true)}
              />
            )}
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
    justifyContent: 'center',
  },
  letterImage: {
    width: '100%',
    height: 260,
  },
  missingImage: {
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingImageText: {
    color: '#ffffff',
    fontWeight: '600',
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
