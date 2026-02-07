import { useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const HEART_COUNT = 26;
const HEARTS = ['♥', '♡', '❤'];

type Heart = {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  rotation: number;
};

export function HeartBackground() {
  const { width, height } = useWindowDimensions();

  const hearts = useMemo<Heart[]>(() => {
    return Array.from({ length: HEART_COUNT }, (_, index) => ({
      id: index,
      left: Math.random() * width,
      top: Math.random() * height,
      size: 8 + Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.4,
      rotation: Math.random() * 40 - 20,
    }));
  }, [width, height]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {hearts.map((heart, index) => (
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
          {HEARTS[index % HEARTS.length]}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heart: {
    position: 'absolute',
    color: '#2c4a55',
  },
});
