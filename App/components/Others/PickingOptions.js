import React, {useContext, useEffect, useState} from 'react';
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

export default function PickingOptions() {
  const modulesCtx = useContext(ModulesContext);

  return (
    <>
      <View style={styles.buttonRow}>
        <MenuIconButton
          disabled={modulesCtx.pklist_pickings_asignados}
          icon={faClipboardList}
          label="Picking asignados"
        />
        <MenuIconButton
          icon={faArrowsLeftRightToLine}
          label="Asignar Pickings"
          disabled={modulesCtx.pklist_asigna_pickeadores}
        />
        <MenuIconButton
          disabled={modulesCtx.pklist_montacargas_asignados}
          icon={faArrowRotateLeft}
          label="Montcargas Asignado"
        />
      </View>
      <View style={styles.buttonRow}>
        <MenuIconButton
          disabled={modulesCtx.pklist_asigna_montacargas}
          icon={faPallet}
          label="Asignar Montacargas"
        />
        <MenuIconButton
          disabled={modulesCtx.pklist_seguimiento_picklist}
          icon={faFolderOpen}
          label="Seguimientos"
        />
        <MenuIconButton
          disabled={modulesCtx.pklist_pendientes}
          icon={faBoxArchive}
          label="Penidentes"
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
