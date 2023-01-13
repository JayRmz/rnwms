import {
  Box,
  Button,
  FlatList,
  HStack,
  Modal,
  Select,
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
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import Header from '../../../../components/UI/Header/Header';
import GlassContainer from '../../../../components/UI/Glassmorphism/GlassContainer';
import Loader from '../../../../components/UI/Loader/Loader';
import EditItemsModal from '../../../../components/UI/Modals/EditItemsModal';
import BreadcrumbTitle from '../../../../components/UI/Header/BreadcrumbTitle';
import ArticleCard from '../../../../components/UI/Cards/ArticleCard';
import Footer from '../../../../components/UI/Footer/Footer';
import ToastAlert from '../../../../components/UI/Toast/ToastAlert';
import ArticleDetailModal from '../../../../components/UI/Modals/ArticleDetailModal';
import PrimaryInput from '../../../../components/UI/Inputs/PrimaryInput';
import Colors from '../../../../util/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCheck,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import SelectDropdown from 'react-native-select-dropdown';

export default function DetalleLote() {
  //State
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');

  const [articulos, setArticulos] = useState([]);
  const [editItemsArticle, setEditItemsArticle] = useState([]);
  const [editItemsModal, setEditItemsModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({});
  const [detailItemsModal, setDetailItemsModal] = useState(false);
  const [detailItem, setDetailItem] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

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
    getLoteDetail();
    getAgentes();
  }, []);

  useEffect(() => {
    fillDetailOrder();
  }, [articulos]);

  async function getAgentes() {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    await axios
      .get(Constants.API_URL + `agentes`, options)
      .then((resp) => {
        setIsLoading(false);
        setLoaderMessage('Obteniendo Agentes');
        const serviceResp = resp.data;

        if (serviceResp.datos.length == 0 || !serviceResp.datos) {
          toastHandler('warning', 'No hay agentes', 'Imposible acceder');
          goToPage('/lote-search');
          return;
        }

        setAgentes(serviceResp.datos);
        console.log('Agentes: ', serviceResp.datos);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al obtener agentes',
        );
      });
  }

  async function getLoteDetail() {
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
        Constants.API_URL + `lotes/folio/${uiCtx.screenProps.id}/detalle`,
        options,
      )
      .then((resp) => {
        setIsLoading(false);
        setLoaderMessage('Obteniendo detalle de lote');
        const serviceResp = resp.data;

        if (serviceResp.datos.length == 0 || !serviceResp.datos) {
          toastHandler(
            'warning',
            'El folio ingresado no tiene artículos pendientes por recibir.',
            'Imposible acceder',
          );
          goToPage('/lote-search');
          return;
        }

        setArticulos(serviceResp.datos.partidas);
        setTitle(`Lote  ${uiCtx.screenProps.id}`);
        setFolio(uiCtx.screenProps.id);
        setOrderDetailInfo((prevState) => {
          return {
            ...prevState,
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
    console.log('NEW RECOLECTED');
    setOrderDetailInfo((prevState) => {
      return {...prevState, recol: 0};
    });

    for (let i = 0; i < articulos.length; i++) {
      setOrderDetailInfo((prevState) => {
        return {
          ...prevState,
          recol: (prevState.recol += articulos[i].recibe),
        };
      });

      console.log(orderDetailInfo.recol);
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

    articulo.recibe += 1;
    newRecolected();
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
    }
    newRecolected();
    setEditItemsArticle([]);
    setEditItemsModal(false);
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
    if (!selectedAgent) {
      toastHandler(
        'error',
        'Debes asignar un agente.',
        'No se pudo realizar la operación.',
      );
      return;
    }

    let orderData = {
      folio: folio,
      usuario: selectedAgent,
      faltantes: [],
    };

    console.log('DATA: ', orderData);

    let recibidos = 0;

    for (let i in articulos) {
      if (articulos[i].recibe > 0) {
        let artData = {
          indice: articulos[i].indice,
          cantidad_faltantes: articulos[i].recibe,
          numero_parte: articulos[i].parte,
          upc: articulos[i].upc,
          terminado: 0,
          descripcion: articulos[i].descripcion_sku,
          sku: articulos[i].sku,
          cantidad: articulos[i].pedido,
        };
        orderData.faltantes.push(artData);
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

    console.log('Order Data: ');

    console.log(orderData);
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
      .post(Constants.API_URL + 'lotes/recepcion', orderData, options)
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;
        console.log('Recepcion: ', serviceResp);

        if (serviceResp.codigo == 200) {
          //   receptionAlert(serviceResp.datos.folio);
          setConfirmationData(folio);
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
      }
    }

    newRecolected();
  }

  function reloadPage() {
    setConfirmationModal(false);
    setConfirmationData(null);
    // getLoteDetail();
    goToPage('/lote-search');
  }

  function onChangeSku(e) {
    setSkuSearch(e.nativeEvent.text);
  }

  return uiCtx.selecetedScreen == '/detalle-lote' ? (
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
            onPress={() => goToPage('/lote-search')}
            title={title}
            bread="WMS > Recepciones > Lotes > "
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
                      detailItem={detailItems.bind(null, art)}
                    />
                  ))}
                </ScrollView>

                <GlassContainer>
                  <Box w="100%" h="30" rounded="lg" overflow="hidden">
                    <HStack
                      mt={2}
                      justifyContent="space-between"
                      alignItems="center">
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
                      <VStack alignItems="center" w="1/3">
                        <SelectDropdown
                          dropdownIconPosition="right"
                          data={agentes}
                          defaultButtonText="Agente"
                          onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                            setSelectedAgent(selectedItem.id_agente);
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.nombre_agente;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item.nombre_agente;
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
