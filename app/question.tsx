import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { HeartBackground } from '@/components/heart-background';
import { RetroWindow } from '@/components/retro-window';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function QuestionScreen() {
  const router = useRouter();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [noButtonSize, setNoButtonSize] = useState({ width: 0, height: 0 });
  const [noPosition, setNoPosition] = useState({ x: 24, y: 24 });
  const [attempts, setAttempts] = useState(0);
  const yesScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(yesScale, {
      toValue: 1 + attempts * 0.08,
      useNativeDriver: true,
      friction: 6,
    }).start();
  }, [attempts, yesScale]);

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const handleNoLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setNoButtonSize({ width, height });
  };

  const moveNoButton = () => {
    const padding = 8;
    const maxX = Math.max(0, containerSize.width - noButtonSize.width - padding);
    const maxY = Math.max(0, containerSize.height - noButtonSize.height - padding);
    const nextX = Math.round(Math.random() * maxX + padding / 2);
    const nextY = Math.round(Math.random() * maxY + padding / 2);
    setNoPosition({ x: nextX, y: nextY });
  };

  const handleNoAttempt = () => {
    setAttempts((current) => current + 1);
    if (containerSize.width > 0 && containerSize.height > 0) {
      moveNoButton();
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <HeartBackground />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, styles.titleGreen]}>Valentine</Text>
          <Text style={[styles.title, styles.titleWhite]}>Letter</Text>
        </View>

        <RetroWindow style={styles.window} contentStyle={styles.windowContent}>
          <Text style={styles.questionText}>¿Quieres ser mi San Valentine?</Text>
          <View style={styles.buttonArena} onLayout={handleContainerLayout}>
            <AnimatedPressable
              accessibilityRole="button"
              accessibilityLabel="Sí, aceptar"
              style={[styles.yesButton, { transform: [{ scale: yesScale }] }]}
              onPress={() => router.push('/letter')}>
              <Text style={styles.yesButtonText}>Sí 💞</Text>
            </AnimatedPressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="No, rechazar"
              onLayout={handleNoLayout}
              onPressIn={handleNoAttempt}
              onPress={handleNoAttempt}
              style={[
                styles.noButton,
                {
                  left: noPosition.x,
                  top: noPosition.y,
                },
              ]}>
              <Text style={styles.noButtonText}>No 🙈</Text>
            </Pressable>
          </View>
        </RetroWindow>
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
  window: {
    width: '100%',
    maxWidth: 360,
  },
  windowContent: {
    gap: 16,
  },
  questionText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#3a2c2a',
    fontWeight: '600',
  },
  buttonArena: {
    height: 200,
    borderRadius: 16,
    backgroundColor: '#f7d9cc',
    borderWidth: 2,
    borderColor: '#b88f80',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yesButton: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3a2c2a',
    backgroundColor: '#7bd389',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 3 },
    shadowRadius: 3,
    elevation: 3,
  },
  yesButtonText: {
    color: '#1f2a2e',
    fontWeight: '700',
    fontSize: 16,
  },
  noButton: {
    position: 'absolute',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3a2c2a',
    backgroundColor: '#ef6b6b',
  },
  noButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
