import React from 'react';
import GlassContainer from '../Glassmorphism/GlassContainer';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Colors from '../../../util/Colors';

export default function MenuIconButton(props) {
  const {icon, label, onPress, disabled} = props;
  return (
    <GlassContainer>
      <Button variant="ghost" size="lg" disabled={disabled} onPress={onPress}>
        <View style={styles.iconButton}>
          <FontAwesomeIcon icon={icon} size={50} color={Colors.black} />
          <Text style={styles.label}>{label}</Text>
        </View>
      </Button>
    </GlassContainer>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 150,
    height: 150,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  label: {paddingTop: 10, color: Colors.black, fontSize: 18},
});
