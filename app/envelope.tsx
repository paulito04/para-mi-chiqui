import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

const CHECKER_SIZE = 46;

type CheckerSquare = {
  id: number;
  left: number;
  top: number;
};

export default function EnvelopeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [isAnimating, setIsAnimating] = useState(false);
  const paperTranslate = useRef(new Animated.Value(0)).current;
  const paperScale = useRef(new Animated.Value(1)).current;

  const squares = useMemo<CheckerSquare[]>(() => {
    const columns = Math.ceil(width / CHECKER_SIZE);
    const rows = Math.ceil(height / CHECKER_SIZE);
    const items: CheckerSquare[] = [];
    let id = 0;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        if ((row + column) % 2 === 0) {
          items.push({
            id: id + 1,
            left: column * CHECKER_SIZE,
            top: row * CHECKER_SIZE,
          });
        }
        id += 1;
      }
    }

    return items;
  }, [height, width]);

  const handlePaperPress = () => {
    if (isAnimating) {
      return;
    }
    console.log('ENVELOPE_TAP');
    setIsAnimating(true);

    Animated.parallel([
      Animated.timing(paperTranslate, {
        toValue: -140,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(paperScale, {
        toValue: 1.08,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('PAPER_OUT_DONE');
      router.push('/question');
      paperTranslate.setValue(0);
      paperScale.setValue(1);
      setIsAnimating(false);
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.background}>
        {squares.map((square) => (
          <View
            key={square.id}
            style={[
              styles.checkerSquare,
              {
                left: square.left,
                top: square.top,
              },
            ]}
          />
        ))}
        <View style={styles.heartLayer} pointerEvents="none">
          <Text style={[styles.heart, styles.heartLarge]}>💗</Text>
          <Text style={[styles.heart, styles.heartSmall]}>💞</Text>
          <Text style={[styles.heart, styles.heartMedium]}>💕</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Toca el papel…</Text>

        <View style={styles.envelopeWrapper}>
          <Image
            source={require('../assets/envelope.png')}
            style={styles.envelopeImage}
            accessibilityLabel="Sobre"
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sacar el papel"
            onPress={handlePaperPress}
            disabled={isAnimating}
            style={styles.paperPressable}>
            <Animated.Image
              source={require('../assets/paper.png')}
              style={[
                styles.paperImage,
                {
                  transform: [
                    { translateX: -110 },
                    { translateY: paperTranslate },
                    { scale: paperScale },
                  ],
                },
              ]}
              accessibilityLabel="Papel"
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7c7d9',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f7c7d9',
  },
  checkerSquare: {
    position: 'absolute',
    width: CHECKER_SIZE,
    height: CHECKER_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  heartLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingVertical: 80,
    alignItems: 'flex-end',
    paddingHorizontal: 24,
  },
  heart: {
    opacity: 0.7,
  },
  heartLarge: {
    fontSize: 38,
    alignSelf: 'flex-start',
  },
  heartMedium: {
    fontSize: 32,
  },
  heartSmall: {
    fontSize: 24,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7a2f4d',
    marginBottom: 24,
  },
  envelopeWrapper: {
    position: 'relative',
    width: 320,
    height: 260,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  envelopeImage: {
    width: 320,
    height: 210,
    resizeMode: 'contain',
    zIndex: 1,
  },
  paperPressable: {
    position: 'absolute',
    left: '50%',
    top: 10,
    zIndex: 2,
  },
  paperImage: {
    width: 220,
    height: 160,
    resizeMode: 'contain',
    zIndex: 2,
  },
});
