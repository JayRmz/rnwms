import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  faArrowRotateLeft,
  faArrowsLeftRightToLine,
  faBoxArchive,
  faClipboardList,
  faFolderOpen,
  faPallet,
} from '@fortawesome/free-solid-svg-icons';
import MenuIconButton from '../UI/Buttons/MenuIconButton';
import {ModulesContext} from '../../store/context/modules-context';

export default function SalidasOptions() {
  const modulesCtx = useContext(ModulesContext);
  return (
    <>
      <View style={styles.buttonRow}>
        <MenuIconButton
          disable={modulesCtx.salidas_medios_internos}
          icon={faClipboardList}
          label="Medios internos"
        />
        <MenuIconButton
          disabled={modulesCtx.salidas_medios_externos}
          icon={faArrowsLeftRightToLine}
          label="Medios Externos"
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
