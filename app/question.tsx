import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const MIN_DISTANCE = 16;

type Position = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

type Rect = Position & Size;

type Heart = {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  rotation: number;
};

export default function QuestionScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [arenaSize, setArenaSize] = useState<Size>({ width: 0, height: 0 });
  const [noSize, setNoSize] = useState<Size>({ width: 0, height: 0 });
  const [yesRect, setYesRect] = useState<Rect>({ x: 0, y: 0, width: 0, height: 0 });
  const [noPosition, setNoPosition] = useState<Position>({ x: 32, y: 24 });
  const [attempts, setAttempts] = useState(0);
  const yesScale = useRef(new Animated.Value(1)).current;

  const hearts = useMemo<Heart[]>(() => {
    return Array.from({ length: 18 }, (_, index) => ({
      id: index,
      left: Math.random() * width,
      top: Math.random() * height,
      size: 16 + Math.random() * 18,
      opacity: 0.15 + Math.random() * 0.2,
      rotation: Math.random() * 40 - 20,
    }));
  }, [height, width]);

  useEffect(() => {
    Animated.spring(yesScale, {
      toValue: 1 + attempts * 0.06,
      useNativeDriver: true,
      friction: 6,
    }).start();
  }, [attempts, yesScale]);

  const handleArenaLayout = (event: LayoutChangeEvent) => {
    const { width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout;
    setArenaSize({ width: layoutWidth, height: layoutHeight });
  };

  const handleNoLayout = (event: LayoutChangeEvent) => {
    const { width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout;
    setNoSize({ width: layoutWidth, height: layoutHeight });
  };

  const handleYesLayout = (event: LayoutChangeEvent) => {
    const { x, y, width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout;
    setYesRect({ x, y, width: layoutWidth, height: layoutHeight });
  };

  const getRandomPosition = () => {
    const maxX = Math.max(0, arenaSize.width - noSize.width - MIN_DISTANCE);
    const maxY = Math.max(0, arenaSize.height - noSize.height - MIN_DISTANCE);
    return {
      x: Math.round(Math.random() * maxX),
      y: Math.round(Math.random() * maxY),
    };
  };

  const isColliding = (candidate: Position) => {
    if (!yesRect.width || !yesRect.height) {
      return false;
    }

    const candidateRect = {
      left: candidate.x - MIN_DISTANCE,
      right: candidate.x + noSize.width + MIN_DISTANCE,
      top: candidate.y - MIN_DISTANCE,
      bottom: candidate.y + noSize.height + MIN_DISTANCE,
    };

    const yesBounds = {
      left: yesRect.x,
      right: yesRect.x + yesRect.width,
      top: yesRect.y,
      bottom: yesRect.y + yesRect.height,
    };

    return !(
      candidateRect.right < yesBounds.left ||
      candidateRect.left > yesBounds.right ||
      candidateRect.bottom < yesBounds.top ||
      candidateRect.top > yesBounds.bottom
    );
  };

  const moveNoButton = () => {
    if (!arenaSize.width || !arenaSize.height) {
      return;
    }

    let candidate = getRandomPosition();
    let attemptsLeft = 12;

    while (isColliding(candidate) && attemptsLeft > 0) {
      candidate = getRandomPosition();
      attemptsLeft -= 1;
    }

    setNoPosition(candidate);
  };

  const handleNoAttempt = () => {
    setAttempts((current) => current + 1);
    moveNoButton();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.background}>
        {hearts.map((heart) => (
          <Text
            key={heart.id}
            style={[
              styles.heart,
              {
                left: heart.left,
                top: heart.top,
                fontSize: heart.size,
                opacity: heart.opacity,
                transform: [{ rotate: `${heart.rotation}deg` }],
              },
            ]}>
            ❤
          </Text>
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.paper}>
          <Text style={styles.paperTitle}>Para: Sara Michelle Serrano Herrera</Text>
          <Text style={styles.paperSubtitle}>De: Jean Paul Zapata Medina</Text>
          <Text style={styles.paperMessage}>
            “Hoy quiero preguntarte algo… ¿Quieres ser mi San Valentín?”
          </Text>
          <Text style={styles.paperPrompt}>Elige:</Text>
        </View>

        <View style={styles.buttonArena} onLayout={handleArenaLayout}>
          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel="Sí, aceptar"
            onLayout={handleYesLayout}
            style={[styles.yesButton, { transform: [{ scale: yesScale }], zIndex: 2 }]}
            onPress={() => router.push('/result?answer=yes')}>
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

        {attempts >= 8 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Aceptar no"
            style={styles.okButton}
            onPress={() => router.push('/result?answer=no')}>
            <Text style={styles.okButtonText}>Ok… 😭</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8c9d8',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f8c9d8',
  },
  heart: {
    position: 'absolute',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  paper: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff8f1',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e0b7a5',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 4,
    gap: 10,
  },
  paperTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7a2f4d',
  },
  paperSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7a2f4d',
  },
  paperMessage: {
    fontSize: 16,
    color: '#3a2c2a',
    lineHeight: 22,
  },
  paperPrompt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7a2f4d',
  },
  buttonArena: {
    width: '100%',
    maxWidth: 340,
    height: 200,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 2,
    borderColor: '#e0b7a5',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 24,
  },
  yesButton: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 14,
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
    zIndex: 1,
  },
  noButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  okButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7a2f4d',
    backgroundColor: '#fff8f1',
  },
  okButtonText: {
    color: '#7a2f4d',
    fontWeight: '700',
    fontSize: 15,
  },
});
