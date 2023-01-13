import React, {useContext, useEffect, useRef, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import Footer from '../../../../components/UI/Footer/Footer';
import GlassContainer from '../../../../components/UI/Glassmorphism/GlassContainer';
import Header from '../../../../components/UI/Header/Header';
import {UIContext} from '../../../../store/context/ui-context';
import Colors from '../../../../util/Colors';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {Redirect} from 'react-router-native';
import {Input, Box, useToast, Row, Spinner, FlatList} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import OrderCard from '../../../../components/UI/Cards/OrderCard';
import Constants from '../../../../util/Constants';
import axios from 'axios';
import {UserContext} from '../../../../store/context/user-context';
import OrderFolioCard from '../../../../components/UI/Cards/OrderFolioCard';
import BreadcrumbTitle from '../../../../components/UI/Header/BreadcrumbTitle';
import ToastAlert from '../../../../components/UI/Toast/ToastAlert';
import SearchInput from '../../../../components/UI/Inputs/SearchInput';
import SelectDropdown from 'react-native-select-dropdown';

export default function SearchOrdenCompra() {
  //States
  const [almacenes, setAlmacenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedAlmacen, setSelectedAlmacen] = useState('');
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [ordenes, setOrdenes] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [ordenesPorFolio, setOrdenesPorFolio] = useState([]);
  const [folioOrden, setFolioOrden] = useState('');
  const [loaderMessage, setLoaderMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltereing, setIsFiltering] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  //Ref
  const folioRef = useRef();
  const almacenesRef = useRef({});
  const proveedoresRef = useRef({});

  //Context
  const uiCtx = useContext(UIContext);
  const userCtx = useContext(UserContext);

  //Toast
  const toast = useToast();

  function goToPage(screen) {
    if (screen == '/main') {
      uiCtx.backOnMenu(true);
    } else {
      uiCtx.setSelectedScreen(screen);
    }
  }

  useEffect(() => {
    toast.closeAll();
    getAlmacenes();
  }, [uiCtx.selecetedScreen]);

  useEffect(() => {
    if (selectedAlmacen != '' && selectedProveedor != '') getOrdersEffect();
  }, [selectedAlmacen, selectedProveedor]);

  function toastHandler(type = 'success', message = '', header = '') {
    const toastDetail = {
      title: header,
      variant: 'left-accent',
      description: message,
      isClosable: true,
      placement: 'top',
      status: type,
    };
    return toast.show({
      render: () => {
        return <ToastAlert id={Date()} {...toastDetail} />;
      },
    });
  }

  async function getOrdersEffect() {
    console.log(
      `GET ORDERS Almacen: ${selectedAlmacen} Proveedor: ${selectedProveedor}`,
    );

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    setLoaderMessage('Obteniendo ordenes');

    await axios
      .get(
        Constants.API_URL +
          `compras/almacen/${selectedAlmacen}/proveedor/${selectedProveedor}/ordenes_pendientes`,
        options,
      )
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;
        if (serviceResp.codigo == 200) {
          setOrdenes(serviceResp.datos);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al obtener Ordenes',
        );
      });
  }

  async function getAlmacenes() {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    setLoaderMessage('Obteniendo Almacenes');
    await axios
      .get(Constants.API_URL + 'catalogos/almacenes', options)
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;
        if (serviceResp.codigo == 200) {
          setAlmacenes(serviceResp.datos);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al obtener Almacenes',
        );
      });
  }

  function resetStates() {
    setSelectedProveedor('');
    setOrdenes([]);
    setOrdenesPorFolio([]);
    setFolioOrden('');
  }
  function setProveedor(proveedor) {
    setSelectedProveedor(proveedor);
  }

  async function getProveedores(almacen) {
    setSelectedAlmacen(almacen);
    resetStates();
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    setLoaderMessage('Obteniendo Proveedores');
    await axios
      .get(
        Constants.API_URL +
          `compras/almacen/${almacen}/recepciones_pendientes/proveedores`,
        options,
      )
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;
        if (serviceResp.codigo == 200) {
          console.log('Proveedores: ', serviceResp.datos);
          setProveedores(serviceResp.datos);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al obtener Proveedores',
        );
      });
  }

  async function searchOrder(orderID) {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    setLoaderMessage('Obteniendo Compra');
    await axios
      .get(Constants.API_URL + `compras/compra/${orderID}`, options)
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;
        if (serviceResp.datos.length > 0) {
          const scrnPrps = {
            id: serviceResp.datos[0].id_orden_compra,
          };
          uiCtx.setScreenProps(scrnPrps);
          goToPage('/order-detail');
        } else {
          toastHandler(
            'warning',
            'El folio ingresado no tiene artículos pendientes por recibir.',
            'Imposible acceder',
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al obtener Orden.',
        );
      });
  }

  async function getOrdenPorFolio() {
    console.log(folioOrden);
    almacenesRef.current.reset();
    proveedoresRef.current.reset();
    if (folioOrden.trim() == '') {
      toastHandler(
        'warning',
        'Es necesario ingresar un folio válido',
        'Imposible realizar acción',
      );
      return;
    }
    setOrdenes([]);
    setSelectedAlmacen('');
    setSelectedProveedor('');
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    setLoaderMessage('Obteniendo Compra');
    await axios
      .get(Constants.API_URL + `compras/folio/${folioOrden}`, options)
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;

        if (serviceResp.datos.length > 1) {
          console.log('Show orders');
          console.log('DATA:', serviceResp.datos);
          setOrdenesPorFolio(serviceResp.datos);
          folioRef.current.blur();
        } else if (serviceResp.datos.length == 1) {
          const scrnPrps = {
            id: serviceResp.datos[0].id_compra,
          };

          uiCtx.setScreenProps(scrnPrps);
          goToPage('/order-detail');
        } else {
          toastHandler(
            'warning',
            'El folio ingresado no tiene artículos pendientes por recibir.',
            'Imposible acceder',
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al obtener Orden',
        );
      });
  }

  function onChangeFolio(e) {
    setFolioOrden(e.nativeEvent.text);
  }

  function filterOrders(e) {
    setFilteredOrders([]);
    if (e.trim() == '') {
      setIsFiltering(false);
      return;
    } else {
      setIsFiltering(true);
    }

    const filtered = [];
    for (var i in ordenes) {
      if (JSON.stringify(ordenes[i]).toLowerCase().includes(e.toLowerCase())) {
        filtered.push(ordenes[i]);
        console.log('FILTERED: ', filtered);
      }
    }
    setFilteredOrders(filtered);
  }

  function refreshOrdenes() {
    setRefreshing(true);
    getOrdersEffect();
    setRefreshing(false);
  }

  return uiCtx.selecetedScreen == '/order-search' ? (
    <View style={styles.screen}>
      <Header />
      <View style={styles.screen}>
        <GlassContainer>
          <BreadcrumbTitle
            onPress={() => goToPage('/main')}
            title="Orden de Compra"
            bread="WMS > Recepciones > "
          />
          <View style={[styles.isRow, styles.folioContainer]}>
            <SearchInput
              placeholder="Orden de compra"
              onChange={onChangeFolio}
              inputRef={folioRef}
              onSubmitEditing={getOrdenPorFolio}
              value={folioOrden}
              type="text"
              label="Buscar"
              onPress={getOrdenPorFolio}
            />
          </View>

          <Row mt={3} alignItems="center" justifyContent="center">
            <Box px={2} h="35" width="33%">
              <SelectDropdown
                ref={almacenesRef}
                dropdownIconPosition="right"
                data={almacenes}
                defaultButtonText="Almacén"
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  getProveedores(selectedItem.id);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.nombre;
                }}
                rowTextForSelection={(item, index) => {
                  return item.nombre;
                }}
                buttonStyle={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255,255,255,0.5}',
                  borderColor: Colors.white,
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesomeIcon
                      icon={isOpened ? faChevronUp : faChevronDown}
                    />
                  );
                }}
              />
            </Box>
            <Box px={2} h="35" width="33%">
              {selectedAlmacen != '' && proveedores.length > 0 && (
                <SelectDropdown
                  ref={proveedoresRef}
                  disabled={selectedAlmacen ? false : true}
                  dropdownIconPosition="right"
                  data={proveedores}
                  defaultButtonText="Proveedor"
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                    setSelectedProveedor(selectedItem.id);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.razon_social;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.razon_social;
                  }}
                  buttonStyle={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.5}',
                    borderColor: selectedAlmacen
                      ? Colors.white
                      : Colors.lightGrey,
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <FontAwesomeIcon
                        icon={isOpened ? faChevronUp : faChevronDown}
                      />
                    );
                  }}
                />
              )}
              {selectedAlmacen != '' && proveedores.length == 0 && (
                <SelectDropdown
                  ref={proveedoresRef}
                  disabled={true}
                  dropdownIconPosition="right"
                  data={proveedores}
                  defaultButtonText={
                    !isLoading ? 'Sin proveedores' : 'Proveedor'
                  }
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                    setSelectedProveedor(selectedItem.id);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.razon_social;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.razon_social;
                  }}
                  buttonStyle={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.5}',
                    borderColor: Colors.lightGrey,
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <FontAwesomeIcon
                        icon={isOpened ? faChevronUp : faChevronDown}
                      />
                    );
                  }}
                />
              )}
              {!selectedAlmacen && (
                <SelectDropdown
                  ref={proveedoresRef}
                  disabled={true}
                  dropdownIconPosition="right"
                  data={proveedores}
                  defaultButtonText="Proveedor"
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                    setSelectedProveedor(selectedItem.id);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.razon_social;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.razon_social;
                  }}
                  buttonStyle={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.5}',
                    borderColor: Colors.lightGrey,
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <FontAwesomeIcon
                        icon={isOpened ? faChevronUp : faChevronDown}
                      />
                    );
                  }}
                />
              )}
            </Box>
            <Box px={2} h="36" width="33%" mb="-1">
              <Input
                placeholder="Filtrar"
                placeholderTextColor={Colors.black}
                onChangeText={filterOrders}
              />
            </Box>
          </Row>
          {isLoading && <Spinner m={5} size="lg" />}

          <View style={styles.scrollContainer}>
            {isFiltereing && (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refreshOrdenes}
                  />
                }
                data={filteredOrders}
                renderItem={({item}) => (
                  <OrderCard
                    key={item.id}
                    order={item}
                    onPress={searchOrder.bind(null, item.id)}
                  />
                )}
              />
            )}
            {!isFiltereing && (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refreshOrdenes}
                  />
                }
                data={ordenes}
                renderItem={({item}) => (
                  <OrderCard
                    key={item.id}
                    order={item}
                    onPress={searchOrder.bind(null, item.id)}
                  />
                )}
              />
            )}

            {ordenesPorFolio.length > 0 && (
              <FlatList
                data={ordenesPorFolio}
                renderItem={({item}) => (
                  <OrderFolioCard
                    key={item.id}
                    order={item}
                    onPress={searchOrder.bind(null, item.id_compra)}
                  />
                )}
              />
            )}
          </View>
        </GlassContainer>
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
    backgroundColor: Colors.bgWhite,
  },
  isRow: {
    flexDirection: 'row',
  },
  folioContainer: {
    // alignContent: 'center',
    margin: 10,
  },
  selectContainers: {
    justifyContent: 'space-around',
  },
  scrollContainer: {
    height: '70%',
    paddingTop: 10,
    margin: 5,
    width: '100%',
    // flexDirection: 'row',
  },
});
