import { StyleSheet, Text, View } from 'react-native';

import * as Integrity from 'integrity';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{Integrity.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
