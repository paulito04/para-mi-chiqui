import { Animated, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRootNavigationState, useRouter } from 'expo-router';

const MAX_YES_SCALE = 1.35;

export default function Question() {
  const router = useRouter();
  const rootState = useRootNavigationState();
  const yesScale = useRef(new Animated.Value(1)).current;
  const yesScaleValue = useRef(1);
  const hasPositionedNo = useRef(false);
  const [showYesMessage, setShowYesMessage] = useState(false);
  const [arenaSize, setArenaSize] = useState({ width: 0, height: 0 });
  const [noSize, setNoSize] = useState({ width: 0, height: 0 });
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  const hasResultRoute = Boolean(rootState?.routeNames?.includes('result'));

  const positionNoButton = useCallback(
    (x: number, y: number) => {
      setNoPosition({ x, y });
    },
    [setNoPosition]
  );

  useEffect(() => {
    if (hasPositionedNo.current || arenaSize.width === 0 || arenaSize.height === 0) {
      return;
    }

    if (noSize.width === 0 || noSize.height === 0) {
      return;
    }

    const centerX = Math.max(0, (arenaSize.width - noSize.width) / 2);
    const centerY = Math.max(0, (arenaSize.height - noSize.height) / 2);
    positionNoButton(centerX, centerY);
    hasPositionedNo.current = true;
  }, [arenaSize, noSize, positionNoButton]);

  const handleNoAttempt = useCallback(() => {
    if (arenaSize.width === 0 || arenaSize.height === 0 || noSize.width === 0 || noSize.height === 0) {
      return;
    }

    const maxX = Math.max(0, arenaSize.width - noSize.width);
    const maxY = Math.max(0, arenaSize.height - noSize.height);
    const nextX = Math.random() * maxX;
    const nextY = Math.random() * maxY;
    positionNoButton(nextX, nextY);

    const nextScale = Math.min(MAX_YES_SCALE, yesScaleValue.current + 0.06);
    yesScaleValue.current = nextScale;
    Animated.spring(yesScale, {
      toValue: nextScale,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();
  }, [arenaSize, noSize, positionNoButton, yesScale]);

  const handleYes = useCallback(() => {
    if (hasResultRoute) {
      router.push('/result');
      return;
    }

    setShowYesMessage(true);
  }, [hasResultRoute, router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGlowTop} pointerEvents="none" />
      <View style={styles.backgroundGlowBottom} pointerEvents="none" />
      <View style={styles.paperTexture} pointerEvents="none" />

      <View style={styles.card}>
        <Text style={styles.title}>¿Quieres ser mi San Valentín?</Text>

        <View
          style={styles.buttonArena}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setArenaSize({ width, height });
          }}
        >
          <Animated.View style={[styles.yesButtonWrapper, { transform: [{ scale: yesScale }] }]}>
            <Pressable style={({ pressed }) => [styles.button, styles.yesButton, pressed && styles.buttonPressed]} onPress={handleYes}>
              <Text style={styles.buttonText}>Sí</Text>
            </Pressable>
          </Animated.View>

          <Pressable
            style={[
              styles.button,
              styles.noButton,
              {
                transform: [{ translateX: noPosition.x }, { translateY: noPosition.y }],
              },
            ]}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setNoSize({ width, height });
            }}
            onPressIn={handleNoAttempt}
          >
            <Text style={styles.buttonText}>No</Text>
          </Pressable>
        </View>

        {showYesMessage ? <Text style={styles.successMessage}>¡Siiii! 💖</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7eee6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -140,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#f7d9c7',
    opacity: 0.55,
  },
  backgroundGlowBottom: {
    position: 'absolute',
    bottom: -180,
    right: -80,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: '#f2c7b5',
    opacity: 0.45,
  },
  paperTexture: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f9f1ea',
    opacity: 0.4,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    backgroundColor: '#fff7f0',
    paddingVertical: 28,
    paddingHorizontal: 22,
    shadowColor: '#3c1e1a',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2c7b8',
  },
  title: {
    textAlign: 'center',
    color: '#4a2e2d',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  buttonArena: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    backgroundColor: '#fffaf6',
    borderWidth: 1,
    borderColor: '#ecd5c8',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  yesButtonWrapper: {
    zIndex: 2,
  },
  button: {
    backgroundColor: '#f4c7b4',
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d9a998',
    shadowColor: '#b26f6a',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  yesButton: {
    backgroundColor: '#f6c7c8',
  },
  noButton: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    color: '#5a2f2d',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  successMessage: {
    marginTop: 18,
    textAlign: 'center',
    color: '#b06d6d',
    fontSize: 18,
    fontWeight: '600',
  },
});
