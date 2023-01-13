import {
  Box,
  Button,
  HStack,
  Input,
  Modal,
  Spinner,
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
import PrimaryInput from '../../../../components/UI/Inputs/PrimaryInput';
import Colors from '../../../../util/Colors';
export default function DetalleTraspaso() {
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
  const [orderDetailInfo, setOrderDetailInfo] = useState({
    from: '',
    to: '',
    partidas: 0,
    recol: 0,
    pend: 0,
  });

  //Toast
  const toast = useToast();

  //Context
  const uiCtx = useContext(UIContext);
  const userCtx = useContext(UserContext);

  //Ref
  const skuRef = useRef();

  //Effect
  useEffect(() => {
    // getOrderDetail();
    getTraspasoDetail();
  }, []);

  useEffect(() => {
    fillDetailOrder();
  }, [articulos]);

  async function getTraspasoDetail() {
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
          `traspasos/folio/${uiCtx.screenProps.id}/traspasos_por_folio`,
        options,
      )
      .then((resp) => {
        setIsLoading(false);
        setLoaderMessage('Obteniendo detalle de traspaso');
        const serviceResp = resp.data;
        console.log('Traspaso: ', serviceResp);

        if (serviceResp.datos.length == 0 || !serviceResp.datos) {
          toastHandler(
            'warning',
            'El folio ingresado no tiene artículos pendientes por recibir.',
            'Imposible acceder',
          );
          goToPage('/traspaso-search');
          return;
        }

        setArticulos(serviceResp.datos.partidas);
        setTitle(`Folio  ${serviceResp.datos.folio}`);
        setFolio(serviceResp.datos.folio);
        setOrderDetailInfo((prevState) => {
          return {
            ...prevState,
            from: serviceResp.datos.nombre_almacen1,
            to: serviceResp.datos.nombre_almacen2,
            partidas: serviceResp.datos.partidas.length,
          };
        });
        newRecolected();
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
    setOrderDetailInfo((prevState) => {
      return {...prevState, recol: 0, pend: 0};
    });

    let total = 0;

    for (let i = 0; i < articulos.length; i++) {
      total += articulos[i].pedido;
      setOrderDetailInfo((prevState) => {
        return {
          ...prevState,
          recol: (prevState.recol += articulos[i].recibe),
          pend: total - prevState.recol,
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
    let orderData = {
      folio: +folio,
      articulos: [],
      clave_de_ubicacion: '',
      validar_sobrantes: 0,
    };

    console.log('DATA: ', orderData);

    let recibidos = 0;

    for (let i in articulos) {
      if (
        articulos[i].requiere_serie > 0 &&
        articulos[i].series.length < articulos[i].recibe &&
        articulos[i].recibe > 0
      ) {
        toastHandler(
          'warning',
          'Hay series pendientes por asignar',
          'No se pudo realizar la operación.',
        );
        return;
      }

      if (
        articulos[i].recibe < articulos[i].series.length &&
        articulos[i].recibe > 0
      ) {
        toastHandler(
          'warning',
          'Existen más series que artículos recibidos.',
          'No se pudo realizar la operación.',
        );
        return;
      }

      if (articulos[i].recibe > 0) {
        let artData = {
          obtiene_serie: articulos[i].obtiene_serie,
          indice: articulos[i].indice,
          descripcion_sku: articulos[i].descripcion_sku,
          requiere_serie: articulos[i].requiere_serie,
          series: articulos[i].series,
          parte: articulos[i].parte,
          pedido: articulos[i].pedido,
          recibe: articulos[i].recibe,
          upc: articulos[i].upc,
          inventario_por_tramo: articulos[i].inventario_por_tramo,
          sku: articulos[i].sku,
          po: articulos[i].po,
        };
        orderData.articulos.push(artData);
        recibidos += articulos[i].recibe;
      }
    }

    if (recibidos == 0) {
      toastHandler(
        'error',
        'Sin artículos por recibir.',
        'No se pudo realizar la operación.',
      );
      return;
    }

    applyOrderRequest(orderData);
  }

  async function applyOrderRequest(orderData) {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    setLoaderMessage('Recepcionando traspaso');
    await axios
      .post(Constants.API_URL + 'traspasos/recepcion', orderData, options)
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;
        console.log('Recepcion: ', serviceResp);

        if (serviceResp.codigo == 200) {
          //   receptionAlert(serviceResp.datos.folio);
          setConfirmationData(serviceResp.datos.folio);
          setConfirmationModal(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error de inicio de sesión',
        );
      });
  }

  function fillDetailOrder() {
    setOrderDetailInfo((prevState) => {
      return {...prevState, partidas: articulos.length};
    });

    for (let i in articulos) {
      setOrderDetailInfo((prevState) => {
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
    // getTraspasoDetail();
    goToPage('/traspaso-search');
  }

  function onChangeSku(e) {
    setSkuSearch(e.nativeEvent.text);
  }

  return uiCtx.selecetedScreen == '/detalle-traspaso' ? (
    <View style={styles.screen}>
      <Header />
      <View style={styles.screen}>
        <GlassContainer>
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

          <BreadcrumbTitle
            onPress={() => goToPage('/traspaso-search')}
            title={title}
            bread="WMS > Recepciones > Traspaso > "
          />

          <HStack alignItems="center" justifyContent="space-evenly" w="full">
            <HStack w="3/5" h="50" alignItems="center">
              <PrimaryInput
                placeholder="SKU, UPC, No. Parte"
                onChange={onChangeSku}
                inputRef={skuRef}
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
                  <Box w="1000" rounded="lg" overflow="hidden">
                    <HStack
                      mt={2}
                      justifyContent="space-between"
                      alignItems="center">
                      <VStack alignItems="center">
                        <Text fontSize="md">De: {orderDetailInfo.from}</Text>
                      </VStack>
                      <VStack alignItems="center">
                        <Text fontSize="md">A: {orderDetailInfo.to}</Text>
                      </VStack>
                      <VStack alignItems="center">
                        <Text fontSize="md">
                          Partida(s): {orderDetailInfo.partidas}
                        </Text>
                      </VStack>
                      <VStack alignItems="center">
                        <Text fontSize="md">
                          Recolectado: {orderDetailInfo.recol}
                        </Text>
                      </VStack>
                      <VStack alignItems="center">
                        <Text fontSize="md">
                          Pendiente: {orderDetailInfo.pend}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </GlassContainer>
              </View>
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

function ConfirmationModal({open, onClose, onAdd, confData}) {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [observaciones, setObservaciones] = useState('');

  function validEnteredText() {
    setShowError(false);
    setErrorMessage('');
    // setOrder((prevState) => {
    //   return {...prevState, observaciones: observaciones};
    // });
    orderData.observaciones = observaciones;
  }

  return (
    <Modal isOpen={open} onClose={onClose} safeAreaTop={true}>
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header> Recepción Exitosa</Modal.Header>
        <Modal.Body>
          <Text>Folio: {confData} </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
              Cancelar
            </Button>
            <Button onPress={onAdd} disabled={showError}>
              Aceptar
            </Button>
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
