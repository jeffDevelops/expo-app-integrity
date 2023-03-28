import * as Integrity from 'integrity'
import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{Integrity.hello()}</Text>

      <Text>
        AppAttest isSupported: {Integrity.isSupported() ? 'Yes' : 'No'}
      </Text>
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
