/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 *
 */

import {extendTheme, NativeBaseProvider} from 'native-base';
import React, {Component, useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import {NativeRouter, Route} from 'react-router-native';
import LoginScreen from './screens/Principal/Auth/LoginScreen';
import MenuScreen from './screens/Principal/Menu/MenuScreen';
import DetalleOrdenCompra from './screens/Principal/Recepciones/OrdenDeCompra/DetalleOrdenCompra';
import SearchOrdenCompra from './screens/Principal/Recepciones/OrdenDeCompra/SearchOrdenCompra';
import BusquedaTraspaso from './screens/Principal/Recepciones/Traspaso/BusquedaTraspaso';
import PrinterScreen from './screens/PrinterScreen';
import ModulesContextProvider from './store/context/modules-context';
import UIContextProvider, {UIContext} from './store/context/ui-context';
import UserContextProvider from './store/context/user-context';
import DetalleTraspaso from './screens/Principal/Recepciones/Traspaso/DetalleTraspaso';
import BusquedaRMA from './screens/Principal/Recepciones/RMA/BusquedaRMA';
import DetalleRMA from './screens/Principal/Recepciones/RMA/DetalleRMA';
import BusquedaLote from './screens/Principal/Recepciones/Lotes/BusquedaLote';
import DetalleLote from './screens/Principal/Recepciones/Lotes/DetalleLote';
import PrinterContextProvider from './store/context/printer-context';
import BusquedaRemisiones from './screens/Principal/Recepciones/Remisiones/BusquedaRemisiones';
import DetalleRemision from './screens/Principal/Recepciones/Remisiones/DetalleRemision';

// class TestPrint extends Component {
// render() {
function TestPrint() {
  const theme = extendTheme({
    colors: {
      // Add new color
      primary: {
        '50': '#aceb71',
        '100': '#98e054',
        '200': '#84d23a',
        '300': '#70b331',
        '400': '#5c9328',
        '500': '#517d28',
        '600': '#466727',
        '700': '#3a5224',
        '800': '#2f3f20',
        '900': '#232d1a',
      },
      // Redefining only one shade, rest of the color will remain same.
      amber: {
        400: '#d97706',
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <UserContextProvider>
          <UIContextProvider>
            <ModulesContextProvider>
              <PrinterContextProvider>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: '100%',
                  }}>
                  <NativeRouter>
                    <Route exact path="/" component={LoginScreen} />
                    <Route path="/main" component={MenuScreen} />
                    <Route path="/order-search" component={SearchOrdenCompra} />
                    <Route
                      path="/traspaso-search"
                      component={BusquedaTraspaso}
                    />
                    <Route path="/rma-search" component={BusquedaRMA} />
                    <Route
                      path="/remisiones-search"
                      component={BusquedaRemisiones}
                    />
                    <Route path="/lote-search" component={BusquedaLote} />
                    <Route path="/detalle-lote" component={DetalleLote} />
                    <Route
                      path="/detalle-traspaso"
                      component={DetalleTraspaso}
                    />
                    <Route path="/detalle-rma" component={DetalleRMA} />
                    <Route
                      path="/order-detail"
                      component={DetalleOrdenCompra}
                    />
                    <Route
                      path="/detalle-remision"
                      component={DetalleRemision}
                    />
                    <Route path="/print" component={PrinterScreen} />
                  </NativeRouter>
                </View>
              </PrinterContextProvider>
            </ModulesContextProvider>
          </UIContextProvider>
        </UserContextProvider>
      </View>
    </NativeBaseProvider>
  );
  // }
}

export default TestPrint;

const styles = StyleSheet.create({
  screen: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
