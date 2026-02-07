import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.screen}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Portada</ThemedText>
        <ThemedText style={styles.subtitle}>Lista para una pregunta especial? 💌</ThemedText>
      </ThemedView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ir a la pregunta"
        style={styles.primaryButton}
        onPress={() => router.push('/question')}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Comenzar ✨
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
