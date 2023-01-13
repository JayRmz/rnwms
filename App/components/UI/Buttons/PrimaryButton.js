import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Colors from '../../../util/Colors';

export default function PrimaryButton({title, onPress, disabled}) {
  return (
    <Pressable
      disabled={disabled}
      style={({pressed}) => [
        styles.button,
        pressed ? styles.glassPressed : styles.glass,
        disabled && styles.disabled,
      ]}
      onPress={onPress}>
      <View>
        <Text style={[disabled ? styles.labelDisabled : styles.label]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    shadowColor: '#1F2687',
    shadowOpacity: 0.37,
    shadowOffset: {width: 0, height: 8},
    shadowRadius: 32,
    borderColor: Colors.borderPrimary,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: 'solid',
    elevation: 6,
    width: '90%',
  },
  glass: {
    // opacity: 0.7,
  },
  glassPressed: {
    opacity: 0.26,
  },
  disabled: {
    borderColor: Colors.disabled,
  },
  labelDisabled: {
    color: Colors.disabled,
  },
});
