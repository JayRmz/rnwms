import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {faClipboardList} from '@fortawesome/free-solid-svg-icons';
import MenuIconButton from '../UI/Buttons/MenuIconButton';
import {ModulesContext} from '../../store/context/modules-context';

export default function PackingOptions() {
  const modulesCtx = useContext(ModulesContext);

  return (
    <>
      <View style={styles.buttonRow}>
        <MenuIconButton
          disabled={modulesCtx.packing}
          icon={faClipboardList}
          label="Packing"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
