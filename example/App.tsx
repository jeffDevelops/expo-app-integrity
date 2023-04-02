import * as Integrity from 'expo-app-integrity'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const serverAttestationChallenge = 'serverAttestationChallenge'
// const serverAssertionChallenge = 'serverAssertionChallenge'

export default function App() {
  const [attestation, setAttestation] = useState<string | null>(null)
  const [error, setError] = useState<unknown | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const attestation = await Integrity.attestKey(
          serverAttestationChallenge,
        )
        setAttestation(attestation)
      } catch (error) {
        setError(error)
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <>
        <Text>
          AppAttest isSupported: {Integrity.isSupported() ? 'Yes' : 'No'}
        </Text>
        <Text>AppAttest attestation: {attestation ?? 'N/A'}</Text>

        {error && (
          <Text>AppAttest error: {(error as Error)?.message ?? 'N/A'}</Text>
        )}
      </>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
