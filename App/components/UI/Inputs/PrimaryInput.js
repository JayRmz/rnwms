import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-regular-svg-icons';
import {FormControl, Input, Pressable, Text} from 'native-base';
import React, {useState} from 'react';
import Colors from '../../../util/Colors';

export default function PrimaryInput({
  placeholder,
  label,
  onChange,
  max,
  inputRef,
  onSubmitEditing,
  value,
  type,
  color = Colors.white,
}) {
  const [show, setShow] = useState(type === 'text' ? true : false);
  return (
    <FormControl>
      {label && (
        <FormControl.Label>
          <Text color={color}>{label}</Text>
        </FormControl.Label>
      )}

      <Input
        variant="outline"
        borderColor={Colors.primary}
        placeholder={placeholder}
        onChange={onChange}
        maxLength={max}
        ref={inputRef}
        onEndEditing={onSubmitEditing}
        value={value}
        autoCapitalize="none"
        autoCorrect={false}
        color={color}
        colorScheme="primary.50"
        type={show ? 'text' : 'password'}
        InputRightElement={
          type === 'text' ? null : (
            <Pressable
              onPress={() => setShow(!show)}
              style={{marginHorizontal: 10}}>
              <FontAwesomeIcon
                icon={show ? faEyeSlash : faEye}
                color={Colors.white}
                size={20}
              />
            </Pressable>
          )
        }
      />
    </FormControl>
  );
}
