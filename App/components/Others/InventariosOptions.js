import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from '../../store/context/user-context';
import {View, Text, StyleSheet} from 'react-native';
import {faClipboardList} from '@fortawesome/free-solid-svg-icons';
import MenuIconButton from '../UI/Buttons/MenuIconButton';
import {ModulesContext} from '../../store/context/modules-context';

export default function InventariosOptions() {
  const modulesCtx = useContext(ModulesContext);

  return (
    <>
      <View style={styles.buttonRow}>
        <MenuIconButton
          disabled={modulesCtx.inventario}
          icon={faClipboardList}
          label="Inventarios"
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
