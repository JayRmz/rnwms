import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import Colors from '../../../util/Colors';

export default function LinkButton({onPress, label, itsPressed, disabled}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        itsPressed ? null : pressed ? styles.pressed : styles.button,
      ]}>
      <Text
        style={[
          styles.button,
          itsPressed && styles.pressed,
          disabled && styles.disabled,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
    padding: 5,
    color: Colors.white,
  },
  pressed: {
    opacity: 0.4,
    padding: 5,
  },
  disabled: {
    color: Colors.disabled,
  },
});
