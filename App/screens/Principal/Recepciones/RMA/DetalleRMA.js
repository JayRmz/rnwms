import {
  Box,
  Button,
  HStack,
  Input,
  KeyboardAvoidingView,
  Modal,
  Select,
  Switch,
  Text,
  useToast,
  VStack,
} from 'native-base';
import {Redirect} from 'react-router-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {UIContext} from '../../../../store/context/ui-context';
import {UserContext} from '../../../../store/context/user-context';
import axios from 'axios';
import {ScrollView, StyleSheet, View} from 'react-native';
import Header from '../../../../components/UI/Header/Header';
import GlassContainer from '../../../../components/UI/Glassmorphism/GlassContainer';
import Loader from '../../../../components/UI/Loader/Loader';
import EditItemsModal from '../../../../components/UI/Modals/EditItemsModal';
import SeriesItemsModal from '../../../../components/UI/Modals/SeriesItemsModal';
import BreadcrumbTitle from '../../../../components/UI/Header/BreadcrumbTitle';
import ArticleCard from '../../../../components/UI/Cards/ArticleCard';
import Footer from '../../../../components/UI/Footer/Footer';
import ToastAlert from '../../../../components/UI/Toast/ToastAlert';
import ArticleDetailModal from '../../../../components/UI/Modals/ArticleDetailModal';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCheck,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import PrimaryInput from '../../../../components/UI/Inputs/PrimaryInput';
import Colors from '../../../../util/Colors';
import SelectDropdown from 'react-native-select-dropdown';

export default function DetalleRMA() {
  //State
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');

  const [articulos, setArticulos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [selectedAlmacen, setSelectedAlmacen] = useState(0);
  const [editItemsArticle, setEditItemsArticle] = useState([]);
  const [editItemsModal, setEditItemsModal] = useState(false);
  const [seriesItemsArticle, setSeriesItemsArticle] = useState([]);
  const [seriesItemModal, setSeriesItemsModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({});
  const [detailItemsModal, setDetailItemsModal] = useState(false);
  const [detailItem, setDetailItem] = useState([]);
  const [locationsModal, setLocationsModal] = useState(false);
  const [locationsStore, setLocationsStore] = useState([]);
  const [locationOrder, setLocationOrder] = useState([]);

  const [title, setTitle] = useState('');
  const [folio, setFolio] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [skuSearch, setSkuSearch] = useState('');
  const [tableDetailInfo, setTableDetailInfo] = useState({
    from: '',
    to: '',
    partidas: 0,
    recolectado: 0,
    unidades: 0,
  });
  const [guia, setGuia] = useState('');

  //Toast
  const toast = useToast();

  //Context
  const uiCtx = useContext(UIContext);
  const userCtx = useContext(UserContext);

  //Ref
  const skuRef = useRef();

  //Effect
  useEffect(() => {
    getRMADetail();
    toast.closeAll();
  }, []);

  useEffect(() => {
    fillTableDetail();
  }, [articulos]);

  async function getRMADetail() {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    await axios
      .get(
        Constants.API_URL +
          `rma/tipo/N/folio/${uiCtx.screenProps.id}/rma_por_folio`,
        options,
      )
      .then((resp) => {
        setIsLoading(false);
        setLoaderMessage('Obteniendo detalle de RMA');
        const serviceResp = resp.data;
        console.log('RMA: ', serviceResp);

        if (
          serviceResp.datos.productos.length == 0 ||
          !serviceResp.datos.productos
        ) {
          toastHandler(
            'warning',
            'El folio ingresado no tiene artículos pendientes por recibir.',
            'Imposible acceder',
          );
          goToPage('/rma-search');
          return;
        }

        setArticulos(serviceResp.datos.productos);
        setTitle(`RMA  ${serviceResp.datos.folio}`);
        setFolio(serviceResp.datos.folio);
        setSelectedAlmacen(serviceResp.datos.id_almacen);
        setTableDetailInfo((prevState) => {
          return {
            ...prevState,
            partidas: serviceResp.datos.productos.length,
          };
        });
        getAlmacenes();
        newRecolected();
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al obtener RMA',
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
    await axios
      .get(Constants.API_URL + `tiendas`, options)
      .then((resp) => {
        setIsLoading(false);

        const serviceResp = resp.data;
        setAlmacenes(serviceResp.datos);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al obtener Almacenes',
        );
      });
  }

  function addBySKU() {
    console.log('Add By sku');
    const value = skuSearch.toLowerCase();
    let founded = false;
    for (var i in articulos) {
      console.log(i);
      console.log('Checking on: ', articulos[i]);
      if (JSON.stringify(articulos[i]).toLowerCase().includes(value)) {
        founded = true;
        if (articulos[i].recibe < articulos[i].pedido) {
          articulos[i].recibe += 1;

          if (articulos[i].requiere_serie != 0) {
            // seriesModal(articulos[i]);
            console.log('OPEN SERIES MODAL');
            setSeriesItemsModal(true);
            setSeriesItemsArticle(articulos[i]);
          }
          newRecolected();

          setSkuSearch('');
          break;
        } else {
          toastHandler(
            'error',
            'No se ha podido agregar el artículo',
            'Artículo sobrepasa el pedido.',
          );
          setSkuSearch('');
          break;
        }
      }
    }

    if (!founded) {
      toastHandler(
        'error',
        'No se ha podido agregar el artículo',
        'Artículo no encontrado.',
      );
      setSkuSearch('');
      return;
    }

    skuRef.current.focus();
  }

  function newRecolected() {
    setTableDetailInfo((prevState) => {
      return {...prevState, recolectado: 0};
    });

    for (let i = 0; i < articulos.length; i++) {
      setTableDetailInfo((prevState) => {
        return {
          ...prevState,
          recolectado: (prevState.recolectado += articulos[i].recibe),
        };
      });
    }
  }

  function addOneItem(articulo) {
    if (articulo.recibe == articulo.pedido) {
      toastHandler(
        'error',
        'No se ha podido agregar el artículo',
        'La cantidad es mayor a la requerida.',
      );
      return;
    }

    if (articulo.requiere_serie != 0) {
      // seriesModal(articulo);
      console.log('SERIES MODAL');
      setSeriesItemsModal(true);
      setSeriesItemsArticle(articulo);
    }
    articulo.recibe += 1;
    newRecolected();
  }

  function seriesItems(articulo) {
    setSeriesItemsArticle(articulo);
    setSeriesItemsModal(true);
  }

  function editItems(articulo) {
    setEditItemsArticle(articulo);
    setEditItemsModal(true);
  }

  function detailItems(articulo) {
    setDetailItem(articulo);
    setDetailItemsModal(true);
  }

  function addItemsModal() {
    for (let i in articulos) {
      if (articulos[i].sku == editItemsArticle.sku) {
        articulos[i].recibe = editItemsArticle.recibe;
      }
      if (editItemsArticle.requiere_serie != 0) {
        console.log('Series MODAL');
        setSeriesItemsModal(true);
        setSeriesItemsArticle(articulos[i]);
      }
    }
    newRecolected();
    setEditItemsArticle([]);
    setEditItemsModal(false);
  }

  function addSeriesModal() {
    setSeriesItemsArticle([]);
    setSeriesItemsModal(false);
  }

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

  function goToPage(screen) {
    uiCtx.setSelectedScreen(screen);
  }

  function applyOrder() {
    //Recolectado
    if (tableDetailInfo.recolectado == 0) {
      toastHandler(
        'error',
        'Sin artículos por recibir.',
        'No se pudo realizar la operación.',
      );
      return;
    }
    //Tener No. guia
    if (guia.trim() == '' || guia == '') {
      toastHandler(
        'warning',
        'Ingrese No. de Guía.',
        'No se pudo realizar la operación.',
      );
      return;
    }

    //Tener un tienda
    if (selectedAlmacen == null || selectedAlmacen == undefined) {
      toastHandler(
        'warning',
        'Es necesario seleccionar una tienda.',
        'No se pudo realizar la operación.',
      );
      return;
    }

    let orderData = {
      tipo: 'N',
      id_ubicacion: 0, // ??
      id_almacen: selectedAlmacen,
      folio: folio,
      numero_guia: guia,

      articulos: [],
    };

    for (let i in articulos) {
      if (
        articulos[i].requiere_serie > 0 &&
        articulos[i].series.length < articulos[i].recibe
      ) {
        toastHandler(
          'warning',
          'Hay series pendientes por asignar',
          'No se pudo realizar la operación.',
        );
        return;
      }

      if (articulos[i].recibe < articulos[i].series.length) {
        toastHandler(
          'warning',
          'Existen más series que artículos recibidos.',
          'No se pudo realizar la operación.',
        );
        return;
      }

      if (articulos[i].recibe > 0) {
        let artData = {
          descripcion_sku: articulos[i].descripcion_sku, //?
          indice: articulos[i].indice,
          parte: articulos[i].parte,
          pedido: articulos[i].pedido,
          recibe: articulos[i].recibe,
          series: articulos[i].series,
          sku: articulos[i].sku,
          upc: articulos[i].upc,
        };
        orderData.articulos.push(artData);
      }
    }
    console.log('VER QUEPDO CON LAS UBICACIONES');
    setLocationOrder(orderData);
    for (let i in almacenes) {
      if (selectedAlmacen == almacenes[i].id_tienda) {
        console.log(almacenes[i]);
        if (almacenes[i].ubicacion == 1) {
          console.log('Mostrar Modal Ubicaciones');
          setLocationsStore(almacenes[i]);
          setLocationsModal(true);
        } else {
          applyOrderRequest();
        }
      }
    }
  }

  function closeLocationsModal() {
    setLocationsModal(false);
    console.log(locationOrder);
  }

  async function applyOrderRequest() {
    console.log('Apply: ', locationOrder);
    setLocationsModal(false);
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    setLoaderMessage('Recepcionando RMA');
    await axios
      .post(Constants.API_URL + 'rma/recepcion', locationOrder, options)
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;
        console.log('Recepcion: ', serviceResp);

        if (serviceResp.codigo == 200) {
          toastHandler('success', 'Recepcion de RMA correcta.', 'Correcto');
          // Recepcion:  {"codigo": 200, "datos": {"folio": 482, "garantias": [], "tipo": "A"}, "mensaje": "Ok"}
          setConfirmationModal(true);
          setConfirmationData({
            title: 'Recepción exitosa.',
            message: `Folio: ${serviceResp.datos.folio}`,
          });
          // getRMADetail();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al recepcionar RMA',
        );
      });
  }

  function fillTableDetail() {
    setTableDetailInfo((prevState) => {
      return {...prevState, partidas: articulos.length};
    });

    for (let i in articulos) {
      setTableDetailInfo((prevState) => {
        return {
          ...prevState,
          unidades: (prevState.unidades += articulos[i].pedido),
        };
      });
    }
  }

  function toggleSelect() {
    if (selectAll) {
      setSelectAll(false);
      for (let i = 0; i < articulos.length; i++) {
        articulos[i].recibe = 0;
      }
    } else {
      setSelectAll(true);
      for (let i = 0; i < articulos.length; i++) {
        articulos[i].recibe = articulos[i].pedido;
        if (articulos[i].requiere_serie != 0) {
          console.log('SERIES MODAL');
          setSeriesItemsModal(true);
          setSeriesItemsArticle(articulos[i]);
        }
      }
    }

    newRecolected();
  }

  function reloadPage() {
    setConfirmationModal(false);
    setConfirmationData(null);
    // getRMADetail();
    goToPage('/rma-search');
  }

  function onChangeSku(e) {
    setSkuSearch(e.nativeEvent.text);
  }

  return uiCtx.selecetedScreen == '/detalle-rma' ? (
    <View style={styles.screen}>
      <Header />
      <View style={styles.screen}>
        <GlassContainer>
          {isLoading ? (
            <Loader message={loaderMessage} />
          ) : (
            <>
              {editItemsModal && (
                <EditItemsModal
                  open={editItemsModal}
                  onClose={() => setEditItemsModal(false)}
                  articulo={editItemsArticle}
                  onAdd={addItemsModal}
                />
              )}

              {seriesItemModal && (
                <SeriesItemsModal
                  open={seriesItemModal}
                  onClose={() => setSeriesItemsModal(false)}
                  articulo={seriesItemsArticle}
                  onAdd={addSeriesModal}
                />
              )}

              {confirmationModal && (
                <ConfirmationModal
                  open={confirmationModal}
                  onClose={reloadPage}
                  confData={confirmationData}
                  onAdd={reloadPage}
                />
              )}

              {detailItemsModal && (
                <ArticleDetailModal
                  open={detailItemsModal}
                  onClose={() => setDetailItemsModal(false)}
                  item={detailItem}
                />
              )}

              {locationsModal && (
                <LocationsModal
                  open={locationsModal}
                  store={locationsStore}
                  locationOrder={locationOrder}
                  onClose={closeLocationsModal}
                  onApply={applyOrderRequest}
                />
              )}

              <BreadcrumbTitle
                onPress={() => goToPage('/rma-search')}
                title={title}
                bread="WMS > Recepciones > RMA > "
              />

              <HStack
                alignItems="center"
                justifyContent="space-evenly"
                h="50"
                w="full">
                <HStack w="2/5" m={2} p={2} alignItems="center">
                  <PrimaryInput
                    placeholder="SKU, UPC, No. Parte"
                    onChange={onChangeSku}
                    inputRef={skuRef}
                    onSubmitEditing={addBySKU}
                    value={skuSearch}
                    type="text"
                  />
                </HStack>

                <HStack w="1/5" m={2} p={2} alignItems="center">
                  <Switch
                    size="sm"
                    onToggle={() => toggleSelect()}
                    isChecked={selectAll}
                  />
                  <Text>Seleccionar Todo</Text>
                </HStack>
                <HStack alignItems="center" w="1/5" m={2} p={2}>
                  <Input
                    placeholder="No. Guia*"
                    placeholderTextColor={Colors.black}
                    ref={skuRef}
                    value={guia}
                    onChangeText={(text) => setGuia(text)}
                  />
                </HStack>
                <Button
                  onPress={applyOrder}
                  w="1/5"
                  m={2}
                  p={2}
                  borderColor={Colors.primary}
                  alignContent="center"
                  justifyContent="center"
                  variant="outline">
                  <Text>Aplicar</Text>
                </Button>
              </HStack>

              {articulos.length > 0 && (
                <>
                  <View style={styles.scrollContainer}>
                    <ScrollView>
                      {articulos.map((art) => (
                        <ArticleCard
                          article={art}
                          key={art.sku}
                          addOneItem={addOneItem.bind(null, art)}
                          editItems={editItems.bind(null, art)}
                          seriesItems={seriesItems.bind(null, art)}
                          detailItem={detailItems.bind(null, art)}
                        />
                      ))}
                    </ScrollView>
                    <GlassContainer>
                      <Box w="full" rounded="lg" overflow="hidden">
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          h={30}>
                          <VStack alignItems="center" w="1/4">
                            <SelectDropdown
                              dropdownIconPosition="right"
                              data={almacenes}
                              defaultButtonText="Almacén"
                              onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index);
                                setSelectedAlmacen(selectedItem.id_tienda);
                              }}
                              buttonTextAfterSelection={(
                                selectedItem,
                                index,
                              ) => {
                                return selectedItem.nombre_tienda;
                              }}
                              rowTextForSelection={(item, index) => {
                                return item.nombre_tienda;
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
                                    icon={
                                      isOpened ? faChevronUp : faChevronDown
                                    }
                                  />
                                );
                              }}
                            />
                          </VStack>
                          <VStack alignItems="center" w="1/4">
                            <Text fontSize="md">
                              Partida(s): {tableDetailInfo.partidas}
                            </Text>
                          </VStack>
                          <VStack alignItems="center" w="1/4">
                            <Text fontSize="md">
                              Unidad(es): {tableDetailInfo.unidades}
                            </Text>
                          </VStack>
                          <VStack alignItems="center" w="1/4">
                            <Text fontSize="md">
                              Recolectado: {tableDetailInfo.recolectado}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    </GlassContainer>
                  </View>
                </>
              )}
            </>
          )}
        </GlassContainer>
      </View>

      <Footer />
    </View>
  ) : (
    <Redirect to={uiCtx.selecetedScreen} />
  );
}

function LocationsModal({open, onClose, store, locationOrder, onApply}) {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [locClave, setLocClave] = useState('');
  const locRef = useRef();
  const userCtx = useContext(UserContext);
  const toast = useToast();

  useEffect(() => {
    console.log(locationOrder);
    async function getStoreLocations() {
      const options = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: userCtx.token,
        },
      };
      await axios
        .get(
          Constants.API_URL + `ubicaciones/id_almacen/${store.id_tienda}`,
          options,
        )
        .then((resp) => {
          const serviceResp = resp.data;
          console.log('Locations: ', serviceResp);
          if (serviceResp.codigo == 200) {
            const loadedLocations = serviceResp.datos;
            let newLocation = {
              clave: 'NU',
              id_ubicacion: 'NU',
              descripcion: 'Nueva Ubicación',
            };
            loadedLocations.push(newLocation);
            setUbicaciones(serviceResp.datos);
          }
        })
        .catch((err) => {
          // setIsLoading(false);
          console.error(err);
        });
    }

    getStoreLocations();
  }, []);

  function onChangeClave(e) {
    setLocClave(e.nativeEvent.text);
  }

  function addLocation() {
    if (selectedLocation == 'NU') {
      verifyNewLocationOnStore();
      return;
    } else {
      locationOrder.id_ubicacion = selectedLocation;
      console.log(locationOrder);
      onApply();
    }
  }

  async function verifyNewLocationOnStore() {
    if (locClave.trim() == '') {
      console.log('La clave no puede estar vacía');
      toastHandler(
        'error',
        'La clave no puede estar vacía',
        'No se pudo realizar la acción',
      );
      return;
    }

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    //
    await axios
      .get(
        Constants.API_URL +
          `ubicaciones/clave_ubicacion/${locClave}/id_almacen/${store.id_tienda}/ubicaciones_por_clave`,
        options,
      )
      .then((resp) => {
        serviceResp = resp.data;
        console.log('Checking location on Store: ', serviceResp);

        if (serviceResp.codigo == 200) {
          const id = serviceResp.datos.id_ubicacion;
          if (id == -1) {
            createNewLocationRequest(id);
          }
        }
      })
      .catch((err) => {
        // setIsLoading(false);
        console.error(err);
      });
  }

  async function createNewLocationRequest(id) {
    let data = {
      transito: 0,
      id_almacen: store.id_tienda,
      clave_ubicacion: locClave,
    };

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    console.log('Adding new Location to Store: ');
    console.log('Data: ', data);
    console.log('Optinos: ', options);
    await axios
      .post(Constants.API_URL + `ubicaciones`, data, options)
      .then((resp) => {
        serviceResp = resp.data;

        if (serviceResp.codigo == 200) {
          console.log('Return to orderRequest');
          locationOrder.id_ubicacion = serviceResp.datos.id_ubicacion;
          //  this.applyOrderRequest(orderData);
          onApply();
        }
      })
      .catch((err) => {
        // setIsLoading(false);
        console.error(err);
      });
  }

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

  return (
    <Modal isOpen={open} onClose={onClose} avoidKeyboard>
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header>
          Seleccionar Ubicación: {store.nombre_tienda}
        </Modal.Header>
        <Modal.Body>
          <Box h="35" mb={5}>
            <SelectDropdown
              dropdownIconPosition="right"
              data={ubicaciones}
              defaultButtonText="Ubicación"
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setSelectedLocation(selectedItem.id_ubicacion);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return `${selectedItem.clave} - ${selectedItem.descripcion}`;
              }}
              rowTextForSelection={(item, index) => {
                return `${item.clave} - ${item.descripcion}`;
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
          {selectedLocation == 'NU' && (
            <PrimaryInput
              placeholder="Clave de nueva ubicación"
              onChange={onChangeClave}
              inputRef={locRef}
              onSubmitEditing={addLocation}
              value={locClave}
              type="text"
              color={Colors.black}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={selectedLocation == 0} onPress={addLocation}>
            Aplicar
          </Button>
        </Modal.Footer>
      </Modal.Content>
      \
    </Modal>
  );
}

function ConfirmationModal({open, onClose, onAdd, confData}) {
  return (
    <Modal isOpen={open} onClose={onAdd} safeAreaTop={true}>
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header> Recepción Exitosa</Modal.Header>
        <Modal.Body>
          <Text>{confData.message} </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button onPress={onAdd}>Aceptar</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  scrollContainer: {
    height: '82%',
    paddingTop: 10,
    margin: 5,
    width: '100%',
    // flexDirection: 'row',
  },
});
