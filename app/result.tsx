import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ResultScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.screen}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Resultado</ThemedText>
        <ThemedText style={styles.subtitle}>¡Sabía que dirías que sí! 💖</ThemedText>
      </ThemedView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Volver al inicio"
        style={styles.primaryButton}
        onPress={() => router.replace('/')}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Volver a empezar ✨
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    gap: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  primaryButton: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    backgroundColor: '#FF5C8A',
  },
  buttonText: {
    color: '#fff',
  },
});
