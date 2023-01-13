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
import {UIContext} from '../../store/context/ui-context';
import {Box, Button, Divider, Menu, Pressable} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import GlassContainer from '../UI/Glassmorphism/GlassContainer';

export default function RecepcionesOptions() {
  const modulesCtx = useContext(ModulesContext);
  const uiCtx = useContext(UIContext);

  function goToPage(page) {
    console.log('Change Screen otps: ', page);
    uiCtx.setSelectedScreen(page);
  }

  return (
    <>
      <View style={styles.buttonRow}>
        <MenuIconButton
          disabled={modulesCtx.recepciones_orden_de_compra}
          icon={faClipboardList}
          label="Orden de compra"
          onPress={() => uiCtx.setSelectedScreen('/order-search')}
        />
        <MenuIconButton
          disabled={modulesCtx.recepciones_traspaso}
          icon={faArrowsLeftRightToLine}
          label="Traspaso"
          onPress={() => uiCtx.setSelectedScreen('/traspaso-search')}
        />
        <MenuIconButton
          disabled={modulesCtx.recepciones_rma}
          icon={faArrowRotateLeft}
          label="RMA"
          onPress={() => uiCtx.setSelectedScreen('/rma-search')}
        />
      </View>
      <View style={styles.buttonRow}>
        <Box alignItems="center">
          <Menu
            w="200"
            m={2}
            trigger={(triggerProps) => {
              return (
                <GlassContainer>
                  <Button variant="ghost" size="lg" {...triggerProps}>
                    <View style={styles.iconButton}>
                      <FontAwesomeIcon
                        icon={faPallet}
                        size={50}
                        color={Colors.black}
                      />
                      <Text style={styles.label}>Lotes</Text>
                    </View>
                  </Button>
                </GlassContainer>
              );
            }}>
            <Menu.Item onPress={() => goToPage('/lote-search')}>
              <Text>Lote</Text>
            </Menu.Item>
            <Divider mt="3" w="100%" />
            <Menu.Item>
              <Text>Parcial</Text>
            </Menu.Item>
          </Menu>
        </Box>
        <MenuIconButton
          disabled={modulesCtx.recepciones_remision}
          icon={faFolderOpen}
          label="Remisión"
          onPress={() => uiCtx.setSelectedScreen('/remisiones-search')}
        />
        <MenuIconButton
          disabled={modulesCtx.recepciones_asn}
          icon={faBoxArchive}
          label="ASN"
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
