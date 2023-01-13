import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import IconButton from '../Buttons/IconButton';

export default function BreadcrumbTitle({title, onPress, bread}) {
  return (
    <View style={[styles.isRow, styles.titleContainer]}>
      <IconButton
        icon={faArrowLeft}
        size={32}
        color={Colors.black}
        onPress={onPress}
      />
      <View style={[styles.isRow, styles.breadcrumContainer]}>
        <Text>{bread}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  isRow: {
    flexDirection: 'row',
  },
  titleContainer: {
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  breadcrumContainer: {
    alignContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  title: {
    fontSize: 25,
    color: Colors.black,
  },
});
