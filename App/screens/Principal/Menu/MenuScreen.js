import {useToast} from 'native-base';
import React, {useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Redirect} from 'react-router-native';
import InventariosOptions from '../../../components/Others/InventariosOptions';
import MenuSelect from '../../../components/Others/MenuSelect';
import PackingOptions from '../../../components/Others/PackingOptions';
import PickingOptions from '../../../components/Others/PickingOptions';
import RecepcionesOptions from '../../../components/Others/RecepcionesOptions';
import SalidasOptions from '../../../components/Others/SalidasOptions';
import UbicacionesOptions from '../../../components/Others/UbicacionesOptions';
import Footer from '../../../components/UI/Footer/Footer';
import Header from '../../../components/UI/Header/Header';
import Toast from '../../../components/UI/Toast/Toast';
import {UIContext} from '../../../store/context/ui-context';
import {UserContext} from '../../../store/context/user-context';
import Colors from '../../../util/Colors';

export default function MenuScreen() {
  const uiCtx = useContext(UIContext);

  return uiCtx.isOnMenuScreen ? (
    <View style={styles.screen}>
      <Header />
      <View style={styles.screenContainer}>
        <MenuSelect />
        {uiCtx.selectedModule == 'Recepciones' && <RecepcionesOptions />}
        {uiCtx.selectedModule == 'Picking' && <PickingOptions />}
        {uiCtx.selectedModule == 'Packing' && <PackingOptions />}
        {uiCtx.selectedModule == 'Salidas' && <SalidasOptions />}
        {uiCtx.selectedModule == 'Ubicaciones' && <UbicacionesOptions />}
        {uiCtx.selectedModule == 'Inventarios' && <InventariosOptions />}
      </View>
      <Footer />
    </View>
  ) : (
    <Redirect to={uiCtx.selecetedScreen} />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.bgWhite,
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 15,
  },

  optionsTitle: {
    padding: 10,
  },
});
