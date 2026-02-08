import { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { HeartBackground } from '@/components/heart-background';
import { RetroWindow } from '@/src/components/RetroWindow';

export default function LetterScreen() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const letterOpacity = useRef(new Animated.Value(1)).current;
  const paperOpacity = useRef(new Animated.Value(0)).current;
  const [imageError, setImageError] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const letterTransform = useMemo(
    () => [{ scale }, { translateY }],
    [scale, translateY],
  );

  const handleOpenLetter = () => {
    if (isOpening || isOpened) {
      router.replace('/');
      return;
    }

    setIsOpening(true);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.12,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -10,
          duration: 420,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(letterOpacity, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(paperOpacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsOpened(true);
      setIsOpening(false);
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <HeartBackground />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, styles.titleGreen]}>Valentine</Text>
          <Text style={[styles.title, styles.titleWhite]}>Letter</Text>
        </View>

        <Animated.View style={[styles.animatedWindow, { transform: letterTransform }]}>
          <RetroWindow contentStyle={styles.windowContent}>
            {imageError ? (
              <View style={styles.missingImage}>
                <Text style={styles.missingImageText}>Carta no encontrada</Text>
              </View>
            ) : (
              <View style={styles.imageStack}>
                {!isOpened && (
                  <Animated.Image
                    source={require('../assets/letter.png')}
                    resizeMode="contain"
                    style={[styles.letterImage, { opacity: letterOpacity }]}
                    onError={() => setImageError(true)}
                  />
                )}
                {(isOpening || isOpened) && (
                  <Animated.Image
                    source={require('../assets/paper.png')}
                    resizeMode="contain"
                    style={[styles.letterImage, { opacity: paperOpacity }]}
                    onError={() => setImageError(true)}
                  />
                )}
              </View>
            )}
          </RetroWindow>
        </Animated.View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isOpened ? 'Continuar' : 'Abrir carta'}
          style={styles.secondaryButton}
          onPress={handleOpenLetter}>
          <Text style={styles.secondaryButtonText}>{isOpened ? 'Continuar' : 'Abrir carta'}</Text>
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
  imageStack: {
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterImage: {
    width: '100%',
    height: 260,
    position: 'absolute',
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
