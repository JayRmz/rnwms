import React from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from '../../../util/Colors';

export default function GlassContainer({children, key}) {
  return (
    <View style={styles.container} key={key}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba( 255, 255, 255, 0.25 )',
    shadowColor: '#1F2687',
    shadowOpacity: 0.37,
    shadowOffset: {width: 0, height: 8},
    shadowRadius: 32,
    elevation: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    borderStyle: 'solid',
    margin: 8,
    paddingHorizontal: 10,
  },
});
