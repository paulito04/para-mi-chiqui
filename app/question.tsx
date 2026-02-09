// npx expo install expo-linear-gradient
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRootNavigationState, useRouter } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';

const MAX_YES_SCALE = 2.2;
const YES_SCALE_STEP = 0.08;
const NO_OPACITY_REDUCED = 0.7;
const NO_SCALE_REDUCED = 0.88;
const NO_SCALE_THRESHOLD = 1.6;
const CHOICE_BOX_WIDTH = 300;
const CHOICE_BOX_HEIGHT = 240;
const NO_BUTTON_WIDTH = 112;
const NO_BUTTON_HEIGHT = 44;
const defaultKawaiiImg = require('../assets/illustrations/kawaii.png');
const noImg = require('../assets/illustrations/No.png');
const siGif = require('../assets/illustrations/Si.gif');
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

const getRandomNoPosition = () => {
  const maxX = CHOICE_BOX_WIDTH - NO_BUTTON_WIDTH;
  const maxY = CHOICE_BOX_HEIGHT - NO_BUTTON_HEIGHT;
  return {
    x: Math.random() * maxX,
    y: Math.random() * maxY,
  };
};

export default function Question() {
  const router = useRouter();
  const rootState = useRootNavigationState();
  const yesScale = useRef(new Animated.Value(1)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  const yesScaleValue = useRef(1);
  const heartAnimations = useRef<Animated.CompositeAnimation[]>([]);
  const [showYesMessage, setShowYesMessage] = useState(false);
  const [noMessageIndex, setNoMessageIndex] = useState(0);
  const [noOpacity, setNoOpacity] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [noPos, setNoPos] = useState(() => getRandomNoPosition());
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [mainImage, setMainImage] = useState(defaultKawaiiImg);

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
    if (!celebrate) {
      return;
    }

    Animated.timing(celebrationAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [celebrate, celebrationAnim]);

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
    setMainImage(noImg);
    setNoPos(getRandomNoPosition());
    setNoCount((prev) => {
      const nextCount = prev + 1;
      const nextScale = Math.min(MAX_YES_SCALE, 1 + nextCount * YES_SCALE_STEP);
      yesScaleValue.current = nextScale;
      Animated.spring(yesScale, {
        toValue: nextScale,
        useNativeDriver: true,
        friction: 6,
        tension: 120,
      }).start();
      const reduceNoVisuals = nextScale > NO_SCALE_THRESHOLD;
      setNoOpacity(reduceNoVisuals ? NO_OPACITY_REDUCED : 1);
      setNoScale(reduceNoVisuals ? NO_SCALE_REDUCED : 1);
      return nextCount;
    });
  }, [yesScale]);

  const handleYes = useCallback(() => {
    setCelebrate(true);
    setMainImage(siGif);
    setAccepted(true);
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
  const celebrationOverlayColor = celebrationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 224, 242, 0)', 'rgba(255, 224, 242, 0.45)'],
  });
  const cardBackgroundColor = celebrationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.78)', 'rgba(255, 238, 251, 0.9)'],
  });

  return (
    <View style={styles.gradient}>
      <LinearGradient colors={['#f9c8d4', '#f7c2a3', '#f7efe3']} style={StyleSheet.absoluteFillObject} />
      <Animated.View
        pointerEvents="none"
        style={[styles.celebrationOverlay, { backgroundColor: celebrationOverlayColor }]}
      />
      <SafeAreaView style={styles.container}>
        {celebrate ? (
          <View style={styles.confettiLayer} pointerEvents="none">
            <ConfettiCannon count={140} origin={{ x: SCREEN_WIDTH / 2, y: 0 }} fadeOut />
          </View>
        ) : null}
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

        <Animated.View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <Text style={styles.title}>¿Quieres ser mi San Valentín, mi Chiqui?</Text>

          <ExpoImage source={mainImage} style={styles.illustration} contentFit="contain" />

          <Text style={styles.subMessage}>{NO_MESSAGES[noMessageIndex]}</Text>

          <View style={styles.choiceBox}>
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

            <Pressable
              style={[
                styles.noButton,
                { left: noPos.x, top: noPos.y, opacity: noOpacity, transform: [{ scale: noScale }] },
              ]}
              onPressIn={handleNoAttempt}
            >
              <Text style={styles.buttonText}>No</Text>
            </Pressable>
          </View>

          {showYesMessage || accepted ? <Text style={styles.successMessage}>¡Siiii! 💖</Text> : null}
          {accepted && !hasResultRoute ? (
            <Pressable style={styles.resetButton} onPress={() => router.replace('/')}>
              <Text style={styles.resetButtonText}>Volver</Text>
            </Pressable>
          ) : null}
        </Animated.View>
      </SafeAreaView>
    </View>
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
  celebrationOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
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
  choiceBox: {
    width: CHOICE_BOX_WIDTH,
    height: CHOICE_BOX_HEIGHT,
    alignSelf: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(247, 199, 199, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
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
    position: 'absolute',
    backgroundColor: '#f5d8cc',
    width: NO_BUTTON_WIDTH,
    height: NO_BUTTON_HEIGHT,
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#efc1b1',
    shadowColor: '#c08a7a',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
  resetButton: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#f5d8cc',
    borderWidth: 1,
    borderColor: '#efc1b1',
  },
  resetButtonText: {
    color: '#5a2f3b',
    fontSize: 15,
    fontWeight: '600',
  },
});
