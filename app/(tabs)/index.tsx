import { useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const NO_MESSAGES = ['¿Segura? 😅', 'No tan rápido 😏', 'Piénsalo bien 💖', 'No me engañas 🙈', 'Última oportunidad ✨'];

export default function HomeScreen() {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [noButtonSize, setNoButtonSize] = useState({ width: 0, height: 0 });
  const [noPosition, setNoPosition] = useState({ x: 20, y: 20 });
  const [message, setMessage] = useState(NO_MESSAGES[0]);
  const [attempts, setAttempts] = useState(0);

  const yesScale = useMemo(() => 1 + attempts * 0.08, [attempts]);

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const handleNoLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setNoButtonSize({ width, height });
  };

  const getNextMessage = () => {
    const options = NO_MESSAGES.filter((option) => option !== message);
    return options[Math.floor(Math.random() * options.length)] ?? message;
  };

  const moveNoButton = () => {
    const maxX = Math.max(0, containerSize.width - noButtonSize.width);
    const maxY = Math.max(0, containerSize.height - noButtonSize.height);
    const nextX = Math.round(Math.random() * maxX);
    const nextY = Math.round(Math.random() * maxY);
    setNoPosition({ x: nextX, y: nextY });
  };

  const handleNoAttempt = () => {
    setMessage(getNextMessage());
    setAttempts((current) => current + 1);
    if (containerSize.width > 0 && containerSize.height > 0) {
      moveNoButton();
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Pregunta</ThemedText>
        <ThemedText style={styles.subtitle}>¿Quieres ser mi chiqui? 💘</ThemedText>
      </ThemedView>

      <ThemedView style={styles.messageContainer}>
        <ThemedText type="subtitle">{message}</ThemedText>
      </ThemedView>

      <View style={styles.buttonArena} onLayout={handleContainerLayout}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sí, aceptar"
          style={[styles.yesButton, { transform: [{ scale: yesScale }] }]}
          onPress={() => {}}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Sí 💘
          </ThemedText>
        </Pressable>

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
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            No 🙈
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  messageContainer: {
    alignItems: 'center',
  },
  buttonArena: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 192, 203, 0.2)',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yesButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: '#FF5C8A',
    alignSelf: 'center',
    zIndex: 1,
  },
  noButton: {
    position: 'absolute',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: '#fff',
  },
});
