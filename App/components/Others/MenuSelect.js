import React, {useContext, useEffect, useState} from 'react';
import GlassContainer from '../UI/Glassmorphism/GlassContainer';
import {Flex, Button, Divider} from 'native-base';
import {StyleSheet, Text, View} from 'react-native';
import {UIContext} from '../../store/context/ui-context';
import {UserContext} from '../../store/context/user-context';
import {ModulesContext} from '../../store/context/modules-context';
import Colors from '../../util/Colors';

export default function MenuSelect() {
  const uiCtx = useContext(UIContext);
  const userCtx = useContext(UserContext);
  const modulesCtx = useContext(ModulesContext);

  return (
    <View style={styles.segmentView}>
      <GlassContainer>
        <Flex direction="row" justify="space-evenly" h="60" w="full">
          <Button
            disabled={modulesCtx.recepciones}
            onPress={() => uiCtx.setSelectedModule('Recepciones')}
            size="sm"
            variant={uiCtx.selectedModule == 'Recepciones' ? 'ghost' : 'ghost'}>
            <Text
              style={{
                fontWeight:
                  uiCtx.selectedModule == 'Recepciones' ? 'bold' : 'normal',
                color: modulesCtx.recepciones ? Colors.idleGrey : Colors.black,
                fontSize: uiCtx.selectedModule == 'Recepciones' ? 22 : 20,
              }}>
              Recepciones
            </Text>
          </Button>
          <Divider orientation="vertical" mx="3" />
          <Button
            disabled={modulesCtx.pklist}
            size="sm"
            variant={uiCtx.selectedModule == 'Picking' ? 'ghost' : 'ghost'}
            onPress={() => uiCtx.setSelectedModule('Picking')}>
            <Text
              style={{
                fontWeight:
                  uiCtx.selectedModule == 'Picking' ? 'bold' : 'normal',
                color: modulesCtx.pklist ? Colors.idleGrey : Colors.black,
                fontSize: uiCtx.selectedModule == 'Picking' ? 22 : 20,
              }}>
              Picking
            </Text>
          </Button>
          <Divider orientation="vertical" mx="3" />
          <Button
            disabled={modulesCtx.packing}
            size="sm"
            variant={uiCtx.selectedModule == 'Packing' ? 'ghost' : 'ghost'}
            onPress={() => uiCtx.setSelectedModule('Packing')}>
            <Text
              style={{
                fontWeight:
                  uiCtx.selectedModule == 'Packing' ? 'bold' : 'normal',
                color: modulesCtx.packing ? Colors.idleGrey : Colors.black,
                fontSize: uiCtx.selectedModule == 'Packing' ? 22 : 20,
              }}>
              Packing
            </Text>
          </Button>
          <Divider orientation="vertical" mx="3" />
          <Button
            disabled={modulesCtx.salidas}
            size="sm"
            variant={uiCtx.selectedModule == 'Salidas' ? 'ghost' : 'ghost'}
            onPress={() => uiCtx.setSelectedModule('Salidas')}>
            <Text
              style={{
                fontWeight:
                  uiCtx.selectedModule == 'Salidas' ? 'bold' : 'normal',
                color: modulesCtx.salidas ? Colors.idleGrey : Colors.black,
                fontSize: uiCtx.selectedModule == 'Salidas' ? 22 : 20,
              }}>
              Salidas
            </Text>
          </Button>
          <Divider orientation="vertical" mx="3" />
          <Button
            disabled={modulesCtx.ubicaciones}
            size="sm"
            variant={uiCtx.selectedModule == 'Ubicaciones' ? 'ghost' : 'ghost'}
            onPress={() => uiCtx.setSelectedModule('Ubicaciones')}>
            <Text
              style={{
                fontWeight:
                  uiCtx.selectedModule == 'Ubicaciones' ? 'bold' : 'normal',
                color: modulesCtx.ubicaciones ? Colors.idleGrey : Colors.black,
                fontSize: uiCtx.selectedModule == 'Ubicaciones' ? 22 : 20,
              }}>
              Ubicaciones
            </Text>
          </Button>
          <Divider orientation="vertical" mx="3" />
          <Button
            disabled={modulesCtx.inventario}
            size="sm"
            variant={uiCtx.selectedModule == 'Inventarios' ? 'ghost' : 'ghost'}
            onPress={() => uiCtx.setSelectedModule('Inventarios')}>
            <Text
              style={{
                fontWeight:
                  uiCtx.selectedModule == 'Inventarios' ? 'bold' : 'normal',
                color: modulesCtx.inventario ? Colors.idleGrey : Colors.black,
                fontSize: uiCtx.selectedModule == 'Inventarios' ? 22 : 20,
              }}>
              Inventarios
            </Text>
          </Button>
        </Flex>
      </GlassContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  segmentView: {
    width: '90%',
  },
});
