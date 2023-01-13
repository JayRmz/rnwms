import {
  faBars,
  faCheck,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Input,
  Menu,
  Modal,
  Pressable,
  ScrollView,
  Spinner,
  Switch,
  Text,
  View,
  VStack,
} from 'native-base';
import React, {useContext, useState} from 'react';
import {UserContext} from '../../../store/context/user-context';
import Colors from '../../../util/Colors';
import axios from 'axios';
import ArticleDetailModal from './ArticleDetailModal';
import {StyleSheet} from 'react-native';

export default function SearchModal({open, onClose, art}) {
  const [title, setTitle] = useState('Buscar Artículo');
  const [formView, setFormView] = useState('articulo');
  const [serachResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const userCtx = useContext(UserContext);

  //Articulo
  const [articleShowAdvanced, setArticleShowAdvanced] = useState(false);
  const [detailItem, setDetailItem] = useState({});
  const [detailItemsModal, setDetailItemsModal] = useState(false);
  const [activosInp, setActivosInp] = useState(false);
  const [existenciasInp, setExistenciasInp] = useState(false);
  const [articleParams, setArticleParams] = useState({
    sku: '',
    descripcion: '',
    sku2: '',
    numero_parte: '',
    upc: '',
    clave_anterior: '',
    isbn: '',
    marca: 0,
    plataforma: 0,
    seccion: 0,
    categoria: 0,
    linea: 0,
    activos: 0,
    existencia: 0,
  });

  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  function setInputValState(text, stateInput) {
    setShowError(false);
    setArticleParams((prevState) => ({...prevState, [stateInput]: text}));
  }

  function pageHandler(categorie) {
    if (categorie == 'articulo') {
      setFormView('articulo');
      setTitle('Buscar Artículo');
      return;
    }

    if (categorie == 'devolucion') {
      setFormView('devolucion');
      setTitle('Buscar Devolución');
      return;
    }

    if (categorie == 'cliente') {
      setFormView('cliente');
      setTitle('Buscar Cliente');
      return;
    }

    if (categorie == 'ticket') {
      setFormView('ticket');
      setTitle('Buscar Ticket');
      return;
    }
  }

  function clearAll() {
    setHasSearched(false);
    setShowError(false);
    setErrorMessage(null);
    setSearchResult(null);
    setArticleParams({
      sku: '',
      descripcion: '',
      sku2: '',
      numero_parte: '',
      upc: '',
      clave_anterior: '',
      isbn: '',
      marca: 0,
      plataforma: 0,
      seccion: 0,
      categoria: 0,
      linea: 0,
      activos: 0,
      existencia: 0,
    });
  }

  async function searchArticle() {
    setShowError(false);
    setSearchResult(null);
    setHasSearched(true);

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
      params: articleParams,
    };

    console.log('Search', articleParams);
    setIsLoading(true);
    await axios
      .get(Constants.API_URL + `articulos/busqueda`, options)
      .then((resp) => {
        const serviceResp = resp.data;
        console.log(serviceResp.datos[0]);

        if (serviceResp.datos.length == 0) {
          setShowError(true);
          setErrorMessage(
            'No se encontraron articulos con los datos proporcionados.',
          );
          return;
        }

        setSearchResult(serviceResp.datos);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        setShowError(true);
        setErrorMessage(err.response.data.mensaje);
      });
  }

  return (
    <>
      {detailItemsModal && (
        <ArticleDetailModal
          open={detailItemsModal}
          onClose={() => setDetailItemsModal(false)}
          item={detailItem}
        />
      )}
      <Modal
        isOpen={open}
        onClose={onClose}
        safeAreaTop={true}
        closeOnOverlayClick={false}
        avoidKeyboard>
        <Modal.Content maxWidth="1100">
          <Modal.CloseButton />
          <Modal.Header backgroundColor={Colors.black}>
            <HStack>
              <Box alignItems="center" mx={2}>
                <Menu
                  w="190"
                  h="100%"
                  backgroundColor={Colors.whiteSmoke}
                  trigger={(triggerProps) => {
                    return (
                      <Pressable {...triggerProps}>
                        <FontAwesomeIcon
                          icon={faBars}
                          color={Colors.white}
                          size={25}
                        />
                      </Pressable>
                    );
                  }}>
                  <Menu.Item onPress={() => pageHandler('articulo')}>
                    <Text>Artículo</Text>
                  </Menu.Item>
                  <Menu.Item onPress={() => pageHandler('devolucion')}>
                    <Text>Devoluciones</Text>
                  </Menu.Item>
                  <Menu.Item onPress={() => pageHandler('cliente')}>
                    <Text>Cliente</Text>
                  </Menu.Item>
                  <Menu.Item onPress={() => pageHandler('ticket')}>
                    <Text>Ticket</Text>
                  </Menu.Item>
                </Menu>
              </Box>
              <Heading size="md" color={Colors.white}>
                {title}
              </Heading>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            {formView == 'articulo' && (
              <VStack width="100%">
                <HStack justifyContent="space-around" width="100%" m={1}>
                  <VStack width="1/2" p={1}>
                    <Input
                      placeholder="SKU"
                      type="text"
                      value={articleParams.sku}
                      onChangeText={(text) => setInputValState(text, 'sku')}
                      autoCorrect={false}
                    />
                  </VStack>

                  <VStack width="1/2" p={1}>
                    <Input
                      placeholder="Descripción"
                      type="text"
                      value={articleParams.descripcion}
                      onChangeText={(text) =>
                        setInputValState(text, 'descripcion')
                      }
                      autoCorrect={false}
                    />
                  </VStack>
                </HStack>

                {articleShowAdvanced && (
                  <VStack>
                    <HStack justifyContent="space-around" width="100%" m={1}>
                      <VStack width="1/3" p={1}>
                        <Input
                          placeholder="SKU 2"
                          type="text"
                          value={articleParams.sku2}
                          onChangeText={(text) =>
                            setInputValState(text, 'sku2')
                          }
                          autoCorrect={false}
                        />
                      </VStack>
                      <VStack width="1/3" p={1}>
                        <Input
                          placeholder="Num. Parte"
                          type="text"
                          value={articleParams.numero_parte}
                          onChangeText={(text) =>
                            setInputValState(text, 'numero_parte')
                          }
                          autoCorrect={false}
                        />
                      </VStack>

                      <VStack width="1/3" p={1}>
                        <Input
                          placeholder="UPC"
                          type="text"
                          value={articleParams.upc}
                          onChangeText={(text) => setInputValState(text, 'upc')}
                          autoCorrect={false}
                        />
                      </VStack>
                    </HStack>
                    <HStack justifyContent="space-around" width="100%" m={1}>
                      <VStack width="1/2" p={1}>
                        <Input
                          placeholder="Clave Anterior"
                          type="text"
                          value={articleParams.clave_anterior}
                          onChangeText={(text) =>
                            setInputValState(text, 'clave_anterior')
                          }
                          autoCorrect={false}
                        />
                      </VStack>

                      <VStack width="1/2" p={1}>
                        <Input
                          placeholder="ISBN"
                          type="text"
                          value={articleParams.isbn}
                          onChangeText={(text) =>
                            setInputValState(text, 'isbn')
                          }
                          autoCorrect={false}
                        />
                      </VStack>
                    </HStack>
                    <HStack justifyContent="space-evenly" width="100%" m={1}>
                      <HStack w="1/2" alignItems="center">
                        <Switch
                          size="sm"
                          onToggle={() =>
                            setActivosInp(activosInp == 0 ? 1 : 0)
                          }
                          isChecked={activosInp == 1 ? true : false}
                        />
                        <Text>Solo Activos</Text>
                      </HStack>
                      <HStack w="1/2" alignItems="center">
                        <Switch
                          size="sm"
                          onToggle={() =>
                            setExistenciasInp(existenciasInp == 0 ? 1 : 0)
                          }
                          isChecked={existenciasInp == 1 ? true : false}
                        />
                        <Text>Solo Existencias</Text>
                      </HStack>
                    </HStack>
                  </VStack>
                )}
                <HStack justifyContent="space-between" m={1} py={2}>
                  <View></View>
                  <Button.Group space={2}>
                    {hasSearched && (
                      <Button variant="ghost" onPress={() => clearAll()}>
                        Limpiar
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() =>
                        articleShowAdvanced
                          ? setArticleShowAdvanced(false)
                          : setArticleShowAdvanced(true)
                      }>
                      <HStack alignContent="center">
                        <FontAwesomeIcon
                          style={{margin: 1, padding: 1}}
                          icon={articleShowAdvanced ? faMinus : faPlus}
                        />
                        <Text>Opciones Avanzadas</Text>
                      </HStack>
                    </Button>
                    <Button onPress={() => searchArticle()}>Buscar</Button>
                  </Button.Group>
                </HStack>

                {isLoading && <Spinner size="lg" />}

                {showError && (
                  <Heading size="md" color={Colors.error}>
                    {errorMessage}
                  </Heading>
                )}

                {serachResult && (
                  <View style={styles.scrollContainer}>
                    <ScrollView
                      style={{
                        width: '100%',
                      }}>
                      <VStack m={1}>
                        <HStack justifyContent="space-around" p={1}>
                          <VStack w="36%">
                            <Text fontWeight="bold">Artículo</Text>
                          </VStack>
                          <VStack w="19%" alignItems="center">
                            <Text fontWeight="bold">UPC</Text>
                          </VStack>
                          <VStack w="19%" alignItems="center">
                            <Text fontWeight="bold">No. Parte</Text>
                          </VStack>
                          <VStack w="16%" alignItems="center">
                            <Text fontWeight="bold">Precio</Text>
                          </VStack>
                          <VStack
                            w="10%"
                            alignItems="center"
                            justifyContent="center"></VStack>
                        </HStack>
                        {serachResult.map((result, index) => (
                          <HStack
                            height="45"
                            alignItems="center"
                            justifyContent="space-around"
                            key={index}
                            p={1}
                            backgroundColor={
                              index % 2 == 0 ? Colors.clear : Colors.darkClear
                            }>
                            <VStack w="36%" paddingX={1}>
                              <Text isTruncated w="100%">
                                {result.sku} - {result.descripcion}
                              </Text>
                            </VStack>
                            <Divider
                              orientation="vertical"
                              mx="3"
                              backgroundColor={Colors.grey}
                            />
                            <VStack
                              paddingX={1}
                              alignItems="center"
                              justifyContent="center"
                              w="19%">
                              <Text isTruncated maxWidth="200" w="100%">
                                {result.upc}
                              </Text>
                            </VStack>
                            <Divider
                              orientation="vertical"
                              mx="3"
                              backgroundColor={Colors.grey}
                            />
                            <VStack
                              paddingX={1}
                              alignItems="center"
                              justifyContent="center"
                              w="19%">
                              <Text isTruncated maxWidth="200" w="100%">
                                {result.numero_parte}
                              </Text>
                            </VStack>
                            <Divider
                              orientation="vertical"
                              mx="3"
                              backgroundColor={Colors.grey}
                            />
                            <VStack
                              paddingX={1}
                              alignItems="flex-end"
                              justifyContent="flex-end"
                              w="16%">
                              <Text>{formatter.format(result.precio)}</Text>
                            </VStack>
                            <Divider
                              orientation="vertical"
                              mx="3"
                              backgroundColor={Colors.grey}
                            />
                            <HStack
                              alignItems="center"
                              w="10%"
                              justifyContent="center">
                              <Button
                                m={2}
                                colorScheme="success"
                                onPress={() => {
                                  setDetailItem({sku: result.sku});
                                  setDetailItemsModal(true);
                                }}>
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  color={Colors.white}
                                />
                              </Button>
                            </HStack>
                          </HStack>
                        ))}
                      </VStack>
                    </ScrollView>
                  </View>
                )}
              </VStack>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    height: '70%',
    paddingTop: 10,
    margin: 5,
    width: '100%',

    // flexDirection: 'row',
  },
});
