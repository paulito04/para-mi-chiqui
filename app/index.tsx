import { Animated, BackHandler, Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'expo';
import { useRouter } from 'expo-router';
// If expo-video isn't installed yet, run: npx expo install expo-video
import { VideoView, useVideoPlayer } from 'expo-video';

const letterImage = require('../assets/letter.png');
const cartaAsset = require('../assets/videos/Carta.mp4');
const snoopyFrames = [
  require('../assets/snoopy/1.png'),
  require('../assets/snoopy/2.png'),
  require('../assets/snoopy/3.png'),
  require('../assets/snoopy/4.png'),
  require('../assets/snoopy/5.png'),
  require('../assets/snoopy/6.png'),
  require('../assets/snoopy/7.png'),
  require('../assets/snoopy/8.png'),
];

const hearts = [
  { id: 1, size: 18, top: 70, left: 26, opacity: 0.18, drift: 8, duration: 6200, delay: 0 },
  { id: 2, size: 22, top: 150, right: 40, opacity: 0.2, drift: 10, duration: 6800, delay: 400 },
  { id: 3, size: 16, top: 250, left: 120, opacity: 0.16, drift: 6, duration: 5400, delay: 800 },
  { id: 4, size: 24, top: 330, right: 70, opacity: 0.18, drift: 12, duration: 7200, delay: 1200 },
  { id: 5, size: 18, top: 520, left: 50, opacity: 0.17, drift: 9, duration: 6400, delay: 600 },
  { id: 6, size: 20, top: 610, right: 32, opacity: 0.18, drift: 7, duration: 6000, delay: 1000 },
];

export default function Index() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const heartAnims = useRef(hearts.map(() => new Animated.Value(0))).current;
  const [snoopyFrameIndex, setSnoopyFrameIndex] = useState(0);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const hasHandledVideoEnd = useRef(false);
  const router = useRouter();
  const player = useVideoPlayer(cartaAsset, (playerInstance) => {
    playerInstance.loop = false;
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const heartLoops = hearts.map((heart, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(heartAnims[index], {
            toValue: 1,
            duration: heart.duration,
            delay: heart.delay,
            useNativeDriver: true,
          }),
          Animated.timing(heartAnims[index], {
            toValue: 0,
            duration: heart.duration,
            useNativeDriver: true,
          }),
        ])
      )
    );

    heartLoops.forEach((loop) => loop.start());

    return () => {
      heartLoops.forEach((loop) => loop.stop());
      pulseAnim.stopAnimation();
    };
  }, [heartAnims, pulseAnim]);

  useEffect(() => {
    const frameCount = snoopyFrames.length;
    const intervalId = setInterval(() => {
      setSnoopyFrameIndex((prev) => (prev + 1) % frameCount);
    }, 140);

    return () => clearInterval(intervalId);
  }, []);

  const resetVideo = useCallback(() => {
    setIsVideoVisible(false);
    player.pause();
    player.currentTime = 0;
  }, [player]);

  const handleVideoEnd = useCallback(() => {
    if (hasHandledVideoEnd.current) {
      return;
    }

    hasHandledVideoEnd.current = true;
    resetVideo();
    router.push('/question');
  }, [resetVideo, router]);

  useEffect(() => {
    if (isVideoVisible) {
      hasHandledVideoEnd.current = false;
      player.currentTime = 0;
      player.play();
      return;
    }

    player.pause();
    player.currentTime = 0;
  }, [isVideoVisible, player]);

  useEventListener(player, 'timeUpdate', (event: { currentTime?: number }) => {
    if (!isVideoVisible || hasHandledVideoEnd.current) {
      return;
    }

    const duration = player.duration;
    const currentTime = event?.currentTime ?? player.currentTime;
    if (duration > 0 && currentTime >= duration) {
      handleVideoEnd();
    }
  });

  useEventListener(player, 'playToEnd', () => {
    if (!isVideoVisible || hasHandledVideoEnd.current) {
      return;
    }

    handleVideoEnd();
  });

  useEffect(() => {
    if (!isVideoVisible) {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, [isVideoVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGlowTop} pointerEvents="none" />
      <View style={styles.backgroundGlowBottom} pointerEvents="none" />
      <View style={styles.paperTexture} pointerEvents="none" />
      <View style={styles.heartsLayer} pointerEvents="none">
        {hearts.map((heart, index) => (
          <Animated.Text
            key={heart.id}
            style={[
              styles.heart,
              {
                fontSize: heart.size,
                top: heart.top,
                left: heart.left,
                right: heart.right,
                opacity: heart.opacity,
                transform: [
                  {
                    translateY: heartAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -heart.drift],
                    }),
                  },
                  {
                    translateX: heartAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, heart.drift],
                    }),
                  },
                ],
              },
            ]}
          >
            ♥
          </Animated.Text>
        ))}
      </View>

      <Text style={styles.title}>
        <Text style={styles.titleAccent}>Carta</Text>
        <Text style={styles.titleMain}> para ti</Text>
      </Text>

      <View style={styles.envelope}>
        <View style={styles.envelopeGlow} />
        <View style={styles.envelopeBody}>
          <Image source={letterImage} style={styles.letterImage} resizeMode="contain" />
          <Text style={styles.subtitle}>Una cartita retro para mi chiqui favorita.</Text>
        </View>
      </View>

      <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.actionRow}>
          <Image
            source={snoopyFrames[snoopyFrameIndex]}
            style={styles.snoopy}
            pointerEvents="none"
            resizeMode="contain"
          />
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => setIsVideoVisible(true)}
          >
            <Text style={styles.buttonText}>Abrir 💌</Text>
          </Pressable>
          <Image
            source={snoopyFrames[snoopyFrameIndex]}
            style={[styles.snoopy, styles.snoopyFlipped]}
            pointerEvents="none"
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <Modal
        visible={isVideoVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={() => {}}
      >
        <View style={styles.videoModalContainer}>
          <VideoView player={player} style={styles.video} contentFit="contain" />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7eee6',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 34,
    justifyContent: 'center',
  },
  heartsLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  heart: {
    position: 'absolute',
    color: '#b4798c',
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -120,
    left: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#f7d9c7',
    opacity: 0.6,
  },
  backgroundGlowBottom: {
    position: 'absolute',
    bottom: -160,
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
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 26,
    textAlign: 'center',
  },
  titleAccent: {
    color: '#b06d6d',
  },
  titleMain: {
    color: '#4a2e2d',
  },
  envelope: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: '#fff7f0',
    shadowColor: '#3c1e1a',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
    padding: 3,
  },
  envelopeGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    backgroundColor: '#ffe8dc',
    opacity: 0.7,
  },
  envelopeBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2c7b8',
    backgroundColor: '#fffaf6',
  },
  letterImage: {
    width: '100%',
    height: 170,
  },
  subtitle: {
    color: '#6a4540',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  snoopy: {
    width: 64,
    height: 64,
  },
  snoopyFlipped: {
    transform: [{ scaleX: -1 }],
  },
  buttonWrapper: {
    marginTop: 24,
  },
  button: {
    backgroundColor: '#f4c7b4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d9a998',
    shadowColor: '#b26f6a',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#5a2f2d',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
