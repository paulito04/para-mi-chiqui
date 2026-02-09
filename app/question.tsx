// npx expo install expo-linear-gradient
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRootNavigationState, useRouter } from 'expo-router';

const MAX_YES_SCALE = 1.8;
const YES_SCALE_STEP = 0.08;
const NO_MIN_OPACITY = 0.6;
const NO_MESSAGES = [
  '¿Segura, mi chiqui?',
  'Piénsalo otra vez…',
  'No acepto ese ‘no’ 😌',
  'Última oportunidad 🙈',
  'Ok… pero mira el botón ‘Sí’ 👀',
  'Dale, di que sí 💖',
];
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PATTERN_ITEMS = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: Math.random() * (SCREEN_WIDTH - 40) + 8,
  top: Math.random() * (SCREEN_HEIGHT * 0.7) + 12,
  size: 10 + Math.random() * 8,
}));

type FloatingHeart = {
  id: number;
  left: number;
  top: number;
  size: number;
  translateY: Animated.Value;
  translateX: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  floatDuration: number;
  driftDistance: number;
};

export default function Question() {
  const router = useRouter();
  const rootState = useRootNavigationState();
  const yesScale = useRef(new Animated.Value(1)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const yesScaleValue = useRef(1);
  const heartAnimations = useRef<Animated.CompositeAnimation[]>([]);
  const [showYesMessage, setShowYesMessage] = useState(false);
  const [noMessageIndex, setNoMessageIndex] = useState(0);
  const [noOpacity, setNoOpacity] = useState(1);

  const hasResultRoute = Boolean(rootState?.routeNames?.includes('result'));

  const floatingHearts = useMemo<FloatingHeart[]>(() => {
    const heartCount = 8;
    return Array.from({ length: heartCount }, (_, index) => {
      const size = 14 + Math.random() * 10;
      return {
        id: index,
        left: Math.random() * (SCREEN_WIDTH - 80) + 20,
        top: SCREEN_HEIGHT * (0.55 + Math.random() * 0.2),
        size,
        translateY: new Animated.Value(0),
        translateX: new Animated.Value(0),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(1),
        floatDuration: 5000 + Math.random() * 3000,
        driftDistance: 8 + Math.random() * 10,
      };
    });
  }, []);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.03,
          duration: 1700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 1700,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [pulseScale]);

  useEffect(() => {
    heartAnimations.current = floatingHearts.map((heart) => {
      const floatDistance = 160 + Math.random() * 60;
      const halfDuration = heart.floatDuration / 2;
      const animation = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(heart.translateY, {
              toValue: -floatDistance,
              duration: heart.floatDuration,
              useNativeDriver: true,
            }),
            Animated.timing(heart.translateY, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(heart.translateX, {
              toValue: heart.driftDistance,
              duration: halfDuration,
              useNativeDriver: true,
            }),
            Animated.timing(heart.translateX, {
              toValue: -heart.driftDistance,
              duration: halfDuration,
              useNativeDriver: true,
            }),
            Animated.timing(heart.translateX, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(heart.opacity, {
              toValue: 0.18,
              duration: halfDuration,
              useNativeDriver: true,
            }),
            Animated.timing(heart.opacity, {
              toValue: 0,
              duration: halfDuration,
              useNativeDriver: true,
            }),
            Animated.timing(heart.opacity, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(heart.scale, {
              toValue: 1.02,
              duration: halfDuration,
              useNativeDriver: true,
            }),
            Animated.timing(heart.scale, {
              toValue: 1,
              duration: halfDuration,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      animation.start();
      return animation;
    });

    return () => {
      heartAnimations.current.forEach((animation) => animation.stop());
    };
  }, [floatingHearts]);

  const handleNoAttempt = useCallback(() => {
    setNoMessageIndex((prev) => (prev + 1) % NO_MESSAGES.length);
    setNoOpacity((prev) => Math.max(NO_MIN_OPACITY, prev - 0.06));

    const nextScale = Math.min(MAX_YES_SCALE, yesScaleValue.current + YES_SCALE_STEP);
    yesScaleValue.current = nextScale;
    Animated.spring(yesScale, {
      toValue: nextScale,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();
  }, [yesScale]);

  const handleYes = useCallback(() => {
    if (hasResultRoute) {
      router.push('/result');
      return;
    }

    setShowYesMessage(true);
  }, [hasResultRoute, router]);

  const handleYesPress = useCallback(() => {
    Vibration.vibrate(15);
    Animated.sequence([
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
    handleYes();
  }, [glowOpacity, handleYes]);

  const yesScaleCombined = useMemo(() => Animated.multiply(yesScale, pulseScale), [pulseScale, yesScale]);

  return (
    <LinearGradient colors={['#f9c8d4', '#f7c2a3', '#f7efe3']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.patternLayer} pointerEvents="none">
          {PATTERN_ITEMS.map((item) => (
            <Text
              key={`pattern-${item.id}`}
              style={[
                styles.patternHeart,
                { left: item.left, top: item.top, fontSize: item.size },
              ]}
            >
              ♥
            </Text>
          ))}
        </View>

        <View style={styles.floatingHearts} pointerEvents="none">
          {floatingHearts.map((heart) => (
            <Animated.Text
              key={`heart-${heart.id}`}
              style={[
                styles.floatingHeart,
                {
                  left: heart.left,
                  top: heart.top,
                  fontSize: heart.size,
                  opacity: heart.opacity,
                  transform: [
                    { translateX: heart.translateX },
                    { translateY: heart.translateY },
                    { scale: heart.scale },
                  ],
                },
              ]}
            >
              ♥
            </Animated.Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>¿Quieres ser mi San Valentín, mi Chiqui?</Text>

          <Image
            source={require('../assets/illustrations/kawaii.png')}
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text style={styles.subMessage}>{NO_MESSAGES[noMessageIndex]}</Text>

          <View style={styles.buttonArena}>
            <Animated.View style={[styles.yesButtonWrapper, { transform: [{ scale: yesScaleCombined }] }]}>
              <Pressable style={styles.yesButton} onPress={handleYesPress}>
                <LinearGradient
                  colors={['#f8a5c2', '#f47c7c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.yesButtonGradient}
                >
                  <View style={styles.yesButtonShine} pointerEvents="none" />
                  <Animated.View style={[styles.yesButtonGlow, { opacity: glowOpacity }]} pointerEvents="none" />
                  <Text style={styles.buttonText}>Sí</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>

            <Pressable style={[styles.noButton, { opacity: noOpacity }]} onPressIn={handleNoAttempt}>
              <Text style={styles.buttonText}>No</Text>
            </Pressable>
          </View>

          {showYesMessage ? <Text style={styles.successMessage}>¡Siiii! 💖</Text> : null}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },
  patternHeart: {
    position: 'absolute',
    color: '#ffffff',
  },
  floatingHearts: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingHeart: {
    position: 'absolute',
    color: '#f8a5c2',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    paddingVertical: 28,
    paddingHorizontal: 22,
    shadowColor: '#8a4f55',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  title: {
    textAlign: 'center',
    color: '#5a2f3b',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  illustration: {
    width: '100%',
    height: 140,
    marginBottom: 8,
  },
  subMessage: {
    textAlign: 'center',
    color: '#7a4b58',
    fontSize: 16,
    marginBottom: 16,
  },
  buttonArena: {
    width: '100%',
    minHeight: 96,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(247, 199, 199, 0.7)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  yesButtonWrapper: {
    zIndex: 2,
  },
  yesButton: {
    borderRadius: 20,
    shadowColor: '#f39cab',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  yesButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },
  yesButtonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  yesButtonGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  noButton: {
    backgroundColor: '#f5d8cc',
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#efc1b1',
    shadowColor: '#c08a7a',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: '#5a2f3b',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  successMessage: {
    marginTop: 18,
    textAlign: 'center',
    color: '#b06d7d',
    fontSize: 18,
    fontWeight: '600',
  },
});
