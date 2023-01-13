import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../../store/context/user-context';
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

export default function UbicacionesOptions() {
  const modulesCtx = useContext(ModulesContext);

  return (
    <>
      <View style={styles.buttonRow}>
        <MenuIconButton
          disabled={modulesCtx.ubicaciones_existencia}
          icon={faClipboardList}
          label="Existencias"
        />
        <MenuIconButton
          disabled={modulesCtx.ubicaciones_pendientes}
          icon={faArrowsLeftRightToLine}
          label="Pendientes"
        />
      </View>
      <View style={styles.buttonRow}>
        <MenuIconButton
          disabled={modulesCtx.ubicaciones_traspasos_internos}
          icon={faPallet}
          label="Traspasos internos"
        />
        <MenuIconButton
          disabled={modulesCtx.ubicaciones_temporales}
          icon={faFolderOpen}
          label="Temporales"
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
