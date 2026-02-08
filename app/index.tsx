import { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { HeartBackground } from '@/components/heart-background';
import { RetroWindow } from '@/components/retro-window';
import { valentineData } from '@/src/data/valentine';

export default function HomeScreen() {
  const router = useRouter();
  const [titleFirst, titleSecond] = valentineData.titulo.split(' ');
  const [isAnimating, setIsAnimating] = useState(false);
  const letterScale = useRef(new Animated.Value(1)).current;
  const restOpacity = useRef(new Animated.Value(1)).current;

  const handleOpen = () => {
    if (isAnimating) {
      return;
    }
    console.log('OPEN_PRESS');
    setIsAnimating(true);
    Animated.parallel([
      Animated.timing(letterScale, {
        toValue: 2.2,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(restOpacity, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/envelope');
      letterScale.setValue(1);
      restOpacity.setValue(1);
      setIsAnimating(false);
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <HeartBackground />
      <View style={styles.content}>
        <Animated.View style={[styles.titleRow, { opacity: restOpacity }]}>
          <Text style={[styles.title, styles.titleGreen]}>{titleFirst}</Text>
          <Text style={[styles.title, styles.titleWhite]}>{titleSecond}</Text>
        </Animated.View>

        <RetroWindow style={styles.window} contentStyle={styles.windowContent}>
          <Animated.View
            style={{
              transform: [{ scale: letterScale }],
            }}>
            <Image
              source={require('../assets/letter.png')}
              resizeMode="contain"
              style={styles.windowLetter}
            />
          </Animated.View>
          <Animated.Text style={[styles.windowText, { opacity: restOpacity }]}>
            Una cartita retro para mi chiqui favorita.
          </Animated.Text>
        </RetroWindow>

        <Animated.View style={{ opacity: restOpacity }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir carta"
            style={[styles.primaryButton, isAnimating && styles.primaryButtonDisabled]}
            onPress={handleOpen}
            disabled={isAnimating}>
            <Text style={styles.primaryButtonText}>Abrir 💌</Text>
          </Pressable>
        </Animated.View>
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
  windowLetter: {
    width: '100%',
    height: 160,
    maxWidth: 220,
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
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d2d2d',
  },
});
