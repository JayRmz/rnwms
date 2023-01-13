import {Heading, HStack, Spinner} from 'native-base';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Colors from '../../../util/Colors';

export default function Loader({message = 'Cargando...'}) {
  return (
    <HStack space={2} justifyContent="center">
      <Spinner
        accessibilityLabel="Loading posts"
        size="lg"
        color={Colors.primary50}
      />
      <Heading color={Colors.primary100} fontSize="md">
        {message}
      </Heading>
    </HStack>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
