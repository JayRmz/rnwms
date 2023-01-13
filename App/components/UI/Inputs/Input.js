import {faEye, faEyeSlash} from '@fortawesome/free-regular-svg-icons';
import {faCode} from '@fortawesome/free-solid-svg-icons';
import React, {useRef, useState} from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';
import Colors from '../../../util/Colors';
import IconButton from '../Buttons/IconButton';
import PrimaryButton from '../Buttons/PrimaryButton';
import {Input} from 'native-base';
export default function CustomInput({
  type,
  value,
  onChange,
  placeholder,
  label,
  max,
  onSubmitEditing,
  inputRef,
}) {
  const [seePass, setSeePass] = useState(false);
  function passwordHandler() {
    setSeePass(!seePass);
  }

  function inputChanged(text) {
    onChange(text);
  }

  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.input}>
        <TextInput
          placeholder={placeholder}
          style={styles.inputView}
          placeholderTextColor="#fff"
          autoCapitalize="none"
          secureTextEntry={type == 'pass' ? seePass : false}
          value={value}
          maxLength={max}
          onChangeText={inputChanged}
          ref={inputRef}
          onSubmitEditing={onSubmitEditing}
          onEndEditing={onSubmitEditing}
          autoCorrect={false}
        />
        {type == 'pass' && (
          <IconButton
            icon={seePass ? faEye : faEyeSlash}
            onPress={passwordHandler}
          />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    width: '90%',
    padding: 10,
    flexDirection: 'column',
  },
  input: {
    flexDirection: 'row',
  },
  inputView: {
    flex: 1,
    borderColor: Colors.borderPrimary,
    borderWidth: 2,
    borderRadius: 20,
    height: 35,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    alignItems: 'center',
    color: Colors.white,
  },
  label: {
    color: Colors.white,
    fontSize: 14,
  },
});
