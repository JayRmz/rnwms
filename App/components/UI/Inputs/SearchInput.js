import {FormControl, Input, Button} from 'native-base';
import React from 'react';
import Colors from '../../../util/Colors';

export default function SearchInput({
  placeholder,
  label,
  onChange,
  max,
  inputRef,
  onSubmitEditing,
  value,
  type,
  onPress,
}) {
  return (
    <FormControl>
      <Input
        variant="outline"
        placeholder={placeholder}
        onChange={onChange}
        maxLength={max}
        ref={inputRef}
        onSubmitEditing={onSubmitEditing}
        onEndEditing={onSubmitEditing}
        value={value}
        autoCapitalize="none"
        autoCorrect={false}
        color={Colors.black}
        colorScheme="primary.50"
        type={type}
        InputRightElement={
          <Button
            size="md"
            rounded="none"
            w="1/6"
            h="full"
            onPress={onSubmitEditing}>
            {label}
          </Button>
        }
      />
    </FormControl>
  );
}
