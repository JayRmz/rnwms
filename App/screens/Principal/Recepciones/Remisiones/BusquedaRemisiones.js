import React, {useContext, useRef, useState} from 'react';
import {UIContext} from '../../../../store/context/ui-context';
import {Redirect} from 'react-router-native';
import {View, StyleSheet, ScrollView} from 'react-native';
import Header from '../../../../components/UI/Header/Header';
import Footer from '../../../../components/UI/Footer/Footer';
import GlassContainer from '../../../../components/UI/Glassmorphism/GlassContainer';
import BreadcrumbTitle from '../../../../components/UI/Header/BreadcrumbTitle';
import SearchInput from '../../../../components/UI/Inputs/SearchInput';
import {
  Box,
  HStack,
  Icon,
  Input,
  Row,
  Spinner,
  Text,
  useToast,
  VStack,
} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import ToastAlert from '../../../../components/UI/Toast/ToastAlert';
import {UserContext} from '../../../../store/context/user-context';
import axios from 'axios';
import RemisionCard from '../../../../components/UI/Cards/RemisionCard';

export default function BusquedaRemisiones() {
  //State
  const [remisionFolio, setRemisionFolio] = useState('');
  const [clienteInput, setClienteInput] = useState('');
  const [clienteNombre, setClienteNombre] = useState('Sin Cliente Asignado');
  const [remisionesPorCliente, setRemisionesPorCliente] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredRemisions, setFilteredRemisions] = useState([]);

  //Ref
  const folioRef = useRef();

  //Context
  const uiCtx = useContext(UIContext);
  const userCtx = useContext(UserContext);

  //Toast
  const toast = useToast();

  //Toast Handler
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

  //Go To page
  function goToPage(screen) {
    if (screen == '/main') {
      uiCtx.backOnMenu(true);
    } else {
      uiCtx.setSelectedScreen(screen);
    }
  }

  //Buscar Cliente
  async function buscarCliente() {
    setRemisionesPorCliente([]);
    if (clienteInput.trim() == '') {
      toastHandler(
        'warning',

        'Ingrese un ID válido',
        'Imposible obtener cliente',
      );
      return;
    }

    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
      params: {
        id: clienteInput,
      },
    };

    setIsLoading(true);
    await axios
      .get(Constants.API_URL + `clientes`, options)
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;

        if (serviceResp.datos.clientes.length == 0) {
          toastHandler(
            'error',
            'Cliente inexistente',
            'Error al obtener cliente',
          );
          return;
        }

        if (serviceResp.datos.clientes.estado == 0) {
          toastHandler(
            'warning',
            'Cliente deshabilitado',
            'Imposible acceder a remisiones de cliente',
          );
          return;
        }

        setClienteNombre(serviceResp.datos.clientes[0].razon_social);
        getRemisionesPorId(serviceResp.datos.clientes[0].id);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        setShowError(true);
        setErrorMessage(err.response.data.mensaje);
      });
  }

  //RemisionesPorCliente
  async function getRemisionesPorId(id) {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
      params: {
        id_cliente: id,
      },
    };

    setIsLoading(true);
    await axios
      .get(Constants.API_URL + `remisiones`, options)
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;

        if (serviceResp.datos.length == 0) {
          toastHandler(
            'warning',
            'No existen remisiones para este cliente',
            'Sin Remisiones',
          );
          return;
        }

        setRemisionesPorCliente(serviceResp.datos);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        setShowError(true);
        setErrorMessage(err.response.data.mensaje);
      });
  }

  //RemisionesPorFolio
  async function buscarRemisionFolio(folio) {
    setClienteInput('');
    setRemisionesPorCliente([]);
    setClienteNombre('Sin Cliente Asignado');
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };

    setIsLoading(true);
    await axios
      .get(Constants.API_URL + `remisiones/${folio}`, options)
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;

        if (serviceResp.datos.articulos.length == 0) {
          toastHandler(
            'warning',
            'Remisión sin artículos',
            'Imposible acceder',
          );
          return;
        }

        const scrnPrps = {
          id: serviceResp.datos.folio,
        };
        uiCtx.setScreenProps(scrnPrps);
        goToPage('/detalle-remision');
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        setShowError(true);
        setErrorMessage(err.response.data.mensaje);
      });
  }

  function getOrdenPorFolio() {
    if (remisionFolio.trim() == '') {
      toastHandler('error', 'Ingresa un folio válido', 'Imposible acceder');
      return;
    }
    buscarRemisionFolio(remisionFolio);
  }

  function onChangeFolio(e) {
    setRemisionFolio(e.nativeEvent.text);
  }

  function filterRemisions(e) {
    setFilteredRemisions([]);
    if (e.trim() == '') {
      setIsFiltering(false);
      return;
    } else {
      setIsFiltering(true);
    }

    const filtered = [];
    for (var i in remisionesPorCliente) {
      if (
        JSON.stringify(remisionesPorCliente[i])
          .toLowerCase()
          .includes(e.toLowerCase())
      ) {
        filtered.push(remisionesPorCliente[i]);
        console.log('FILTERED: ', filtered);
      }
    }
    setFilteredRemisions(filtered);
  }

  return uiCtx.selecetedScreen == '/remisiones-search' ? (
    <View style={styles.screen}>
      <Header />
      <View style={styles.screen}>
        <GlassContainer>
          <BreadcrumbTitle
            onPress={() => goToPage('/main')}
            title="Remisión"
            bread="WMS > Recepciones > "
          />
          <View style={[styles.isRow, styles.folioContainer]}>
            {/* See Orden De compra */}
            <SearchInput
              placeholder="Remisión"
              type="text"
              label="Buscar"
              onChange={onChangeFolio}
              inputRef={folioRef}
              onSubmitEditing={getOrdenPorFolio}
              value={remisionFolio}
              onPress={getOrdenPorFolio}
            />
          </View>
          <Row mt={3} alignItems="center" justifyContent="center" m={2}>
            <VStack w="2/3">
              <HStack alignItems="center">
                <Input
                  value={clienteInput}
                  onChangeText={(e) => setClienteInput(e)}
                  onEndEditing={buscarCliente}
                  w="1/3"
                  InputLeftElement={
                    <Icon
                      as={<FontAwesomeIcon icon={faUser} />}
                      size={5}
                      ml="5"
                      color="muted.400"
                    />
                  }
                  placeholder="Cliente"
                />
                <Text width="2/3" marginLeft={1} fontWeight="bold">
                  {clienteNombre}
                </Text>
              </HStack>
            </VStack>
            <VStack w="1/3">
              <Input
                placeholder="Filtrar"
                placeholderTextColor={Colors.black}
                onChangeText={filterRemisions}
              />
            </VStack>
          </Row>
          {isLoading && <Spinner m={5} size="lg" />}

          {remisionesPorCliente.length > 0 && (
            <View style={styles.scrollContainer}>
              <Box width="100%">
                <GlassContainer>
                  <Box w="100%" rounded="lg" overflow="hidden" borderWidth="1">
                    <HStack justifyContent="space-between" alignItems="center">
                      {/* Folio | Emisión | Descripción | Total | Acción */}
                      <VStack w="1/5" alignItems="center" m={2}>
                        <Text fontSize="md" fontWeight="500" pl={2}>
                          Folio
                        </Text>
                      </VStack>

                      <VStack w="1/5" alignItems="center" m={2}>
                        <Text fontSize="md" fontWeight="500">
                          Emisión
                        </Text>
                      </VStack>
                      <VStack w="1/5" alignItems="center" m={2}>
                        <Text fontSize="md" fontWeight="500">
                          Almacén
                        </Text>
                      </VStack>
                      <VStack w="1/5" alignItems="center" m={2}>
                        <Text fontSize="md" fontWeight="500">
                          Total
                        </Text>
                      </VStack>
                      <HStack alignItems="center" m={2}></HStack>
                    </HStack>
                  </Box>
                </GlassContainer>
              </Box>
              <ScrollView style={{width: '100%'}}>
                {!isFiltering &&
                  remisionesPorCliente.map((remision) => (
                    <RemisionCard
                      key={remision.folio}
                      remision={remision}
                      onPress={buscarRemisionFolio.bind(null, remision.folio)}
                    />
                  ))}

                {isFiltering &&
                  filteredRemisions.map((remision) => (
                    <RemisionCard
                      key={remision.folio}
                      remision={remision}
                      onPress={buscarRemisionFolio.bind(null, remision.folio)}
                    />
                  ))}
              </ScrollView>
            </View>
          )}
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
