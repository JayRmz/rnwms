import React, {useContext, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Redirect} from 'react-router-native';
import GlassContainer from '../../../../components/UI/Glassmorphism/GlassContainer';
import BreadcrumbTitle from '../../../../components/UI/Header/BreadcrumbTitle';
import Header from '../../../../components/UI/Header/Header';
import {UIContext} from '../../../../store/context/ui-context';
import Colors from '../../../../util/Colors';
import axios from 'axios';
import {UserContext} from '../../../../store/context/user-context';
import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Switch,
  VStack,
  Modal,
  Text,
  useToast,
  KeyboardAvoidingView,
  Spinner,
} from 'native-base';
import Footer from '../../../../components/UI/Footer/Footer';
import ToastAlert from '../../../../components/UI/Toast/ToastAlert';
import EditItemsModal from '../../../../components/UI/Modals/EditItemsModal';
import SeriesItemsModal from '../../../../components/UI/Modals/SeriesItemsModal';
import ArticleDetailModal from '../../../../components/UI/Modals/ArticleDetailModal';
import PrimaryInput from '../../../../components/UI/Inputs/PrimaryInput';
import RemisionArticleCard from '../../../../components/UI/Cards/RemisionArticleCard';

export default function DetalleRemision() {
  //State
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');

  const [articulos, setArticulos] = useState([]);
  const [editItemsArticle, setEditItemsArticle] = useState([]);
  const [editItemsModal, setEditItemsModal] = useState(false);
  const [seriesItemsArticle, setSeriesItemsArticle] = useState([]);
  const [seriesItemModal, setSeriesItemsModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({});
  const [detailItemsModal, setDetailItemsModal] = useState(false);
  const [detailItem, setDetailItem] = useState([]);

  const [title, setTitle] = useState('');
  const [folio, setFolio] = useState('');
  const [docto, setDocto] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [skuSearch, setSkuSearch] = useState('');

  //Toast
  const toast = useToast();

  const [remisionDetailInfo, setRemisionDetailInfo] = useState({
    recolectado: 0,
    unidades: 0,
    partidas: 0,
    almacen: '',
  });

  //Context
  const uiCtx = useContext(UIContext);
  const userCtx = useContext(UserContext);

  //Ref
  const skuRef = useRef();

  //Effect
  useEffect(() => {
    getOrderDetail();
    toast.closeAll();
    // skuRef.current.focus();
  }, []);

  useEffect(() => {
    fillDetailOrder();
  }, [articulos]);

  async function getOrderDetail() {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    await axios
      .get(Constants.API_URL + `remisiones/${uiCtx.screenProps.id}`, options)
      .then((resp) => {
        setIsLoading(false);
        setLoaderMessage('Obteniendo detalle de compra');
        const serviceResp = resp.data;
        console.log('ORDER: ', serviceResp);

        if (serviceResp.datos.length == 0) {
          toastHandler(
            'warning',
            'El folio ingresado no tiene artículos pendientes por recibir.',
            'Imposible acceder',
          );
          goToPage('/order-search');
          return;
        }

        setArticulos(serviceResp.datos.articulos);
        setTitle(`Folio: ${serviceResp.datos.folio}`);
        setFolio(serviceResp.datos.folio);
        setRemisionDetailInfo((prevState) => {
          return {
            ...prevState,
            partidas: serviceResp.datos.articulos.length,
            almacen: serviceResp.datos.almacen,
          };
        });
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al obtener Orden',
        );
      });
  }

  function newRecolected() {
    setRemisionDetailInfo((prevState) => {
      return {...prevState, recolectado: 0};
    });

    for (let i = 0; i < articulos.length; i++) {
      setRemisionDetailInfo((prevState) => {
        return {
          ...prevState,
          recolectado: (prevState.recolectado += articulos[i].recibe),
        };
      });
    }
  }

  function fillDetailOrder() {
    for (let i in articulos) {
      setRemisionDetailInfo((prevState) => {
        return {
          ...prevState,
          unidades: (prevState.unidades += articulos[i].solicitado),
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
        articulos[i].recibe = articulos[i].solicitado;
        if (articulos[i].requiere_serie != 0) {
          console.log('SERIES MODAL');
          setSeriesItemsModal(true);
          setSeriesItemsArticle(articulos[i]);
        }
      }
    }

    newRecolected();
  }

  function addBySKU() {
    const value = skuSearch.toLowerCase();

    console.log('sku VALUE: ', value);

    let founded = false;
    for (var i in articulos) {
      console.log(i);
      console.log('Checking on: ', articulos[i]);
      if (JSON.stringify(articulos[i]).toLowerCase().includes(value)) {
        founded = true;
        if (articulos[i].recibe < articulos[i].solicitado) {
          articulos[i].recibe += 1;

          if (articulos[i].requiere_serie != 0) {
            // this.seriesModal(articulos[i]);
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

    console.log('Did return from FOR');

    if (!founded) {
      toastHandler(
        'error',
        'No se ha podido agregar el artículo',
        'Artículo no encontrado.',
      );
      setSkuSearch('');
      return;
    }

    // skuRef.current.focus();
  }

  function addOneItem(articulo) {
    console.log('Add One Item');
    if (articulo.recibe == articulo.solicitado) {
      toastHandler(
        'error',
        'No se ha podido agregar el artículo',
        'La cantidad es mayor a la requerida.',
      );
      return;
    }

    if (articulo.requiere_serie != 0) {
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
    console.log('Edit Items');
    setEditItemsArticle(articulo);
    setEditItemsModal(true);
  }

  function detailItems(articulo) {
    setDetailItem(articulo);
    setDetailItemsModal(true);
  }

  function addItemsModal() {
    console.log('Add Items');
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
    console.log('DID ENTERED TOAST!');
    const toastDetail = {
      title: header,
      variant: 'left-accent',
      description: message,
      isClosable: true,
      placement: 'top',
      status: type,
      duration: type == 'success' ? 8000 : 5000,
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
    let orderData = {
      almacen: 0, // ?
      observaciones: 'recibido desde iPad',
      clave_ubicacion: 'A01',
      articulos: [],
    };

    let recibidos = 0;

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
          sku: articulos[i].sku,
          recibe: articulos[i].recibe,
          series: articulos[i].series,
        };
        orderData.articulos.push(artData);
        recibidos += articulos[i].recibe;
      }
    }

    console.log('ORDER DATA: ', orderData);

    if (recibidos == 0) {
      toastHandler(
        'error',
        'Sin artículos por recibir.',
        'No se pudo realizar la operación.',
      );
      return;
    }

    setConfirmationData(orderData);
    setConfirmationModal(true);
  }

  async function applyOrderRequest() {
    setConfirmationModal(false);

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    setLoaderMessage('Recepcionando orden');
    console.log(Constants.API_URL + `remisiones/${folio}/recepcion`);
    console.log(confirmationData);
    await axios
      .post(
        Constants.API_URL + `remisiones/${folio}/recepcion`,
        confirmationData,
        options,
      )
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;
        console.log('Remision - SERVICE RESP: ', serviceResp);
        if (serviceResp.codigo == 200) {
          console.log('Toast Hanlder?');
          toastHandler(
            'success',
            `Folio: ${serviceResp.datos.folio} Documento: ${serviceResp.datos.documento}`,
            'Remisión recepcionada correctamente',
          );
          setTimeout(function () {
            goToPage('/remisiones-search');
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err.response.data.mensaje);
        setIsLoading(false);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al recepcionar la remisión',
        );
      });
  }

  function onChangeSku(e) {
    setSkuSearch(e.nativeEvent.text);
  }

  return uiCtx.selecetedScreen == '/detalle-remision' ? (
    <View style={styles.screen}>
      <Header />
      <View style={styles.screen}>
        <GlassContainer>
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
                onClose={() => setConfirmationModal(false)}
                orderData={confirmationData}
                onAdd={applyOrderRequest}
              />
            )}

            {detailItemsModal && (
              <ArticleDetailModal
                open={detailItemsModal}
                onClose={() => setDetailItemsModal(false)}
                item={detailItem}
              />
            )}

            <BreadcrumbTitle
              onPress={() => goToPage('/remisiones-search')}
              title={title}
              bread="WMS > Recepciones > Remisiones > "
            />
            <HStack alignItems="center" justifyContent="space-evenly" w="full">
              <HStack w="3/5" h="50" alignItems="center">
                <PrimaryInput
                  placeholder="SKU, UPC, No. Parte"
                  onChange={onChangeSku}
                  onSubmitEditing={addBySKU}
                  value={skuSearch}
                  type="text"
                />
              </HStack>

              <HStack w="1/5" alignItems="center">
                <Switch
                  size="sm"
                  onToggle={() => toggleSelect()}
                  isChecked={selectAll}
                />
                <Text>Seleccionar Todo</Text>
              </HStack>
              <Button onPress={applyOrder} w="1/5" variant="outline">
                <Text>Aplicar</Text>
              </Button>
            </HStack>
            {isLoading && <Spinner m={5} size="lg" />}
            {articulos.length > 0 && (
              <>
                <View style={styles.scrollContainer}>
                  <ScrollView>
                    {articulos.map((art) => (
                      <RemisionArticleCard
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
                    <Box w="100%" rounded="lg" overflow="hidden">
                      <HStack
                        mt={2}
                        justifyContent="space-between"
                        alignItems="center">
                        <VStack alignItems="center">
                          <Text fontSize="md">
                            Almacén: {remisionDetailInfo.almacen}
                          </Text>
                        </VStack>
                        <VStack alignItems="center">
                          <Text fontSize="md">
                            Partida(s): {remisionDetailInfo.partidas}
                          </Text>
                        </VStack>
                        <VStack alignItems="center">
                          <Text fontSize="md">
                            Unidades: {remisionDetailInfo.unidades}
                          </Text>
                        </VStack>
                        <VStack alignItems="center">
                          <Text fontSize="md">
                            Recolectado: {remisionDetailInfo.recolectado}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  </GlassContainer>
                </View>
              </>
            )}
          </>
        </GlassContainer>
      </View>
      <Footer />
    </View>
  ) : (
    <Redirect to={uiCtx.selecetedScreen} />
  );
}

function ConfirmationModal({open, onClose, onAdd, orderData}) {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [observaciones, setObservaciones] = useState('');

  function validEnteredText() {
    setShowError(false);
    setErrorMessage('');
    orderData.observaciones = observaciones;
  }

  return (
    <Modal isOpen={open} onClose={onClose} safeAreaTop={true}>
      <KeyboardAvoidingView
        h={{
          base: '400px',
          lg: 'auto',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Modal.Content maxWidth="450">
          <Modal.CloseButton />
          <Modal.Header paddingRight={10}>
            ¿Deseas aplicar la recepción?
          </Modal.Header>
          <Modal.Body>
            <Text>Observaciones: </Text>
            <FormControl my={1} isInvalid={!showError}>
              <Input
                placeholder="Observaciones"
                type="text"
                value={observaciones}
                onChangeText={(text) => setObservaciones(text)}
                autoCorrect={false}
                onEndEditing={validEnteredText}
              />
              {showError && <Text m={2}>{errorMessage}</Text>}
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
                Cancelar
              </Button>
              <Button onPress={onAdd} disabled={showError}>
                Aplicar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </KeyboardAvoidingView>
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
