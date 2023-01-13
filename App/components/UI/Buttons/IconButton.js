import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import Colors from '../../../util/Colors';
export default function IconButton({
  icon,
  size,
  color = Colors.black,
  onPress,
  disabled,
}) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.button,
        pressed ? styles.glassPressed : styles.glass,
        disabled && styles.disabled,
      ]}
      onPress={onPress}>
      <FontAwesomeIcon icon={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    padding: 2,
    // paddingVertical: 8,
    // paddingHorizontal: 16,
    backgroundColor: 'rgba( 255, 255, 255, 0.5 )',
    shadowColor: '#1F2687',
    shadowOpacity: 0.37,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    borderColor: Colors.white,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'solid',
    elevation: 2,
    height: 35,
  },
  glassPressed: {
    opacity: 0.26,
  },
  disabled: {
    borderColor: Colors.disabled,
  },
});
