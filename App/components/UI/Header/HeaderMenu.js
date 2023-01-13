import React, {useContext} from 'react';
import {Box, Button, Divider, Menu, Pressable} from 'native-base';
import {UserContext} from '../../../store/context/user-context';
import {ModulesContext} from '../../../store/context/modules-context';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {Text, TouchableOpacity} from 'react-native';
// import {Redirect} from 'react-router-native';
import {Link, Redirect} from 'react-router-native';
import {UIContext} from '../../../store/context/ui-context';
import Colors from '../../../util/Colors';

export default function HeaderMenu() {
  const userCtx = useContext(UserContext);
  const modulesCtx = useContext(ModulesContext);
  const uiCtx = useContext(UIContext);

  function goToPage(page) {
    uiCtx.setSelectedScreen(page);
  }

  return (
    <Box alignItems="center">
      <Menu
        w="190"
        h="90%"
        backgroundColor={Colors.whiteSmoke}
        trigger={(triggerProps) => {
          return (
            <Pressable {...triggerProps}>
              <FontAwesomeIcon icon={faBars} color={Colors.white} size={25} />
            </Pressable>
          );
        }}>
        {!modulesCtx.recepciones && (
          <>
            <Menu.Group title="Recepciones">
              <Menu.Item
                isDisabled={modulesCtx.recepciones_orden_de_compra}
                onPress={() => goToPage('/order-search')}>
                <Text>Orden de Compra</Text>
              </Menu.Item>
              <Menu.Item
                isDisabled={modulesCtx.recepciones_traspaso}
                onPress={() => goToPage('/traspaso-search')}>
                <Text>Traspaso</Text>
              </Menu.Item>
              <Menu.Item
                isDisabled={modulesCtx.recepciones_rma}
                onPress={() => goToPage('/rma-search')}>
                <Text>RMA</Text>
              </Menu.Item>
              <Menu.Item
                isDisabled={modulesCtx.recepciones_remision}
                onPress={() => goToPage('/remisiones-search')}>
                <Text>Remisión</Text>
              </Menu.Item>
              <Menu.Item
                isDisabled={modulesCtx.recepciones_asn}
                onPress={() => console.log('')}>
                <Text>ASN</Text>
              </Menu.Item>

              {!modulesCtx.recepciones_lotes && (
                <Menu.Group title="Lotes">
                  <Menu.Item
                    isDisabled={modulesCtx.recepciones_lotes_parcial}
                    onPress={() => console.log('')}>
                    <Text>Parcial</Text>
                  </Menu.Item>
                  <Menu.Item
                    isDisabled={modulesCtx.recepciones_lotes_lote}
                    onPress={() => goToPage('/lote-search')}>
                    <Text>Lote</Text>
                  </Menu.Item>
                </Menu.Group>
              )}
            </Menu.Group>
            <Divider mt="3" w="100%" />
          </>
        )}

        {!modulesCtx.pklist && (
          <>
            <Menu.Group title="Picking">
              <Menu.Item
                isDisabled={modulesCtx.pklist_pickings_asignados}
                onPress={() => console.log('')}>
                <Text>Pickings Asignados</Text>
              </Menu.Item>
              <Menu.Item
                isDisabled={modulesCtx.pklist_asigna_pickeadores}
                onPress={() => console.log('')}>
                <Text>Asigna Pickings</Text>
              </Menu.Item>
              <Menu.Item
                isDisabled={modulesCtx.pklist_montacargas_asignados}
                onPress={() => console.log('')}>
                <Text>Montacargas Asignados</Text>
              </Menu.Item>
              <Menu.Item
                isDisabled={modulesCtx.pklist_asigna_montacargas}
                onPress={() => console.log('')}>
                <Text>Asigna Montacargas</Text>
              </Menu.Item>
              <Menu.Item
                isDisabled={modulesCtx.pklist_seguimiento_picklist}
                onPress={() => console.log('')}>
                <Text>Seguimientos</Text>
              </Menu.Item>
              <Menu.Item
                isDisabled={modulesCtx.pklist_pendientes}
                onPress={() => console.log('')}>
                <Text>Pendientes</Text>
              </Menu.Item>
            </Menu.Group>
            <Divider mt="3" w="100%" />
          </>
        )}

        {!modulesCtx.packing && (
          <>
            <Menu.Group title="Packing">
              <Menu.Item
                isDisabled={modulesCtx.packing}
                onPress={() => console.log('')}>
                <Text>Packing</Text>
              </Menu.Item>
            </Menu.Group>
            <Divider mt="3" w="100%" />
          </>
        )}

        {!modulesCtx.salidas && (
          <>
            <Menu.Group title="Salidas">
              <Menu.Item
                isDisabled={modulesCtx.salidas_medios_internos}
                onPress={() => console.log('')}>
                <Text>Medios Internos</Text>
              </Menu.Item>
              <Menu.Item
                isDisabled={modulesCtx.salidas_medios_externos}
                onPress={() => console.log('')}>
                <Text>Medios Externos</Text>
              </Menu.Item>
            </Menu.Group>
            <Divider mt="3" w="100%" />
          </>
        )}

        {!modulesCtx.ubicaciones && (
          <>
            <Menu.Group title="Ubicaciones">
              <Menu.Item
                isDisabled={modulesCtx.ubicaciones_existencia}
                onPress={() => console.log('')}>
                <Text>Existencias</Text>
              </Menu.Item>

              <Menu.Item
                isDisabled={modulesCtx.ubicaciones_traspasos_internos}
                onPress={() => console.log('')}>
                <Text>Traspasos internos</Text>
              </Menu.Item>
              <Menu.Item
                isDisabled={modulesCtx.ubicaciones_temporales}
                onPress={() => console.log('')}>
                <Text>Temporales</Text>
              </Menu.Item>
              {!modulesCtx.ubicaciones_pendientes && (
                <Menu.Group title="Pendientes">
                  <Menu.Item
                    isDisabled={modulesCtx.ubicaciones_pendientes_documentos}
                    onPress={() => console.log('')}>
                    <Text>Documentos</Text>
                  </Menu.Item>
                  <Menu.Item
                    isDisabled={modulesCtx.ubicaciones_pendientes_tarimas}
                    onPress={() => console.log('')}>
                    <Text>Tarimas</Text>
                  </Menu.Item>
                  <Menu.Item
                    isDisabled={modulesCtx.ubicaciones_pendientes_articulos}
                    onPress={() => console.log('')}>
                    <Text>Artículos</Text>
                  </Menu.Item>
                </Menu.Group>
              )}
            </Menu.Group>
            <Divider mt="3" w="100%" />
          </>
        )}

        {!modulesCtx.inventario && (
          <Menu.Group title="Inventarios">
            <Menu.Item
              isDisabled={modulesCtx.inventario}
              onPress={() => console.log('')}>
              <Text>Inventarios</Text>
            </Menu.Item>
          </Menu.Group>
        )}
      </Menu>
    </Box>
  );
}
