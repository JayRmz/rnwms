import {faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {HStack, Text} from 'native-base';
import React from 'react';
export default function IconFlag({
  isChecked,
  flag,
  style,
  iconSize = 10,
  flagFontSize = 12,
}) {
  return (
    <HStack alignItems="center">
      <FontAwesomeIcon
        size={iconSize}
        icon={isChecked == 1 ? faCheck : faXmark}
      />
      <Text fontSize={flagFontSize} fontWeight="bold">
        {flag}
      </Text>
    </HStack>
  );
}
