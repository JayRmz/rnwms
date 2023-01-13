import {VStack, Text} from 'native-base';
import React from 'react';

export default function LabelDesc({
  style,
  label,
  desc,
  labelFontSize = 12,
  descFontSize = 14,
}) {
  return (
    <VStack m={1}>
      <Text fontWeight="bold" fontSize={labelFontSize}>
        {label}
      </Text>
      <Text fontSize={descFontSize}>{desc}</Text>
    </VStack>
  );
}
