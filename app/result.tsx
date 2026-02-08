import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ResultScreen() {
  const router = useRouter();
  const { answer } = useLocalSearchParams<{ answer?: string }>();

  const isYes = answer === 'yes';

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>{isYes ? '¡Sabía que dirías que sí! 💖' : 'Gracias por ser sincera.'}</Text>
        <Text style={styles.subtitle}>
          {isYes
            ? 'Prometo un día lleno de abrazos, cartas y muchas sonrisas.'
            : 'Lo importante es que sigamos siendo tú y yo.'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver al inicio"
          onPress={() => router.replace('/')}
          style={styles.button}>
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8c9d8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff8f1',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e0b7a5',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7a2f4d',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#3a2c2a',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7a2f4d',
    backgroundColor: '#f7d5e3',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#7a2f4d',
    fontWeight: '700',
  },
});
