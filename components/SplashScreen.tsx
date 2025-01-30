import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/yello_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.bottomContainer}>
        <Text style={styles.versionText}>Version 1.0</Text>
        <Text style={styles.companyText}>Solution By Exfactor</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f90018',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  versionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 4,
  },
  companyText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
}); 