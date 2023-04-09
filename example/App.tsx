import * as Integrity from 'expo-app-integrity'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const serverAttestationChallenge = 'serverAttestationChallenge'
const cloudProjectNumber = 1066543603178

export default function App() {
  const [attestation, setAttestation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const attestation = await Integrity.attestKey(
          serverAttestationChallenge,
          cloudProjectNumber,
        )
        setAttestation(attestation)
      } catch (error: any) {
        console.log({ error })
        setError(error.code)
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <>
        <Text>AppAttest attestation: {attestation ?? 'N/A'}</Text>

        {error && (
          <>
            <Text>AppAttest error:</Text>
            <Text>{error ?? 'N/A'}</Text>
          </>
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
