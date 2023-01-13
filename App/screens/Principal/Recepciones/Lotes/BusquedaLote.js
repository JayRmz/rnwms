import {
  Box,
  FlatList,
  Input,
  Row,
  Select,
  Spinner,
  Text,
  useToast,
} from 'native-base';
import React, {useContext, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {Redirect} from 'react-router-native';
import Footer from '../../../../components/UI/Footer/Footer';
import GlassContainer from '../../../../components/UI/Glassmorphism/GlassContainer';
import BreadcrumbTitle from '../../../../components/UI/Header/BreadcrumbTitle';
import Header from '../../../../components/UI/Header/Header';
import Loader from '../../../../components/UI/Loader/Loader';
import ToastAlert from '../../../../components/UI/Toast/ToastAlert';
import {UIContext} from '../../../../store/context/ui-context';
import {UserContext} from '../../../../store/context/user-context';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCheck,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import PrimaryInput from '../../../../components/UI/Inputs/PrimaryInput';
import Colors from '../../../../util/Colors';
import LoteCard from '../../../../components/UI/Cards/LoteCard';
import SelectDropdown from 'react-native-select-dropdown';

export default function BusquedaLote() {
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');
  const [almacenes, setAlmacenes] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [selectedAlmacen, setSelectedAlmacen] = useState(null);
  const [isFiltereing, setIsFiltering] = useState(false);
  const [filteredLotes, setFilteredLotes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const uiCtx = useContext(UIContext);
  const userCtx = useContext(UserContext);

  const toast = useToast();

  useEffect(() => {
    toast.closeAll();
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

    getAlmacenes();
  }, []);

  useEffect(() => {
    getLotesByAlmacen();
  }, [selectedAlmacen]);

  async function getLotesByAlmacen() {
    console.log('Selected Almacen:', selectedAlmacen);
    if (selectedAlmacen == null) {
      return;
    }
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userCtx.token,
      },
    };
    setIsLoading(true);
    console.log('Obteniendo Lotes');
    await axios
      .get(Constants.API_URL + `lotes/almacen/${selectedAlmacen}`, options)
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;
        if (serviceResp.codigo == 200) {
          setLotes(serviceResp.datos);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al obtener Lotes',
        );
      });
  }

  function goToPage(page) {
    if (page == '/main') {
      uiCtx.backOnMenu(true);
    } else {
      uiCtx.setSelectedScreen(page);
    }
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

  function filterLotes(e) {
    setFilteredLotes([]);
    if (e.trim() == '') {
      setIsFiltering(false);
      return;
    } else {
      setIsFiltering(true);
    }

    setIsLoading(true);
    const filtered = [];
    for (var i in lotes) {
      if (JSON.stringify(lotes[i]).toLowerCase().includes(e.toLowerCase())) {
        filtered.push(lotes[i]);
        console.log('FILTERED: ', filtered);
      }
    }
    setFilteredLotes(filtered);
    setIsLoading(false);
  }

  async function searchLote(lote) {
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
      .get(Constants.API_URL + `lotes/folio/${lote}/detalle`, options)
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;
        if (serviceResp.codigo == 200) {
          const scrnPrps = {
            id: lote,
          };
          uiCtx.setScreenProps(scrnPrps);
          goToPage('/detalle-lote');
          console.log('Go To detail: ', lote);
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

  function refreshLotes() {
    setRefreshing(true);
    getLotesByAlmacen();
    setRefreshing(false);
  }

  return uiCtx.selecetedScreen == '/lote-search' ? (
    <View style={styles.screen}>
      <Header />
      <View style={styles.screen}>
        <GlassContainer>
          <BreadcrumbTitle
            onPress={() => goToPage('/main')}
            title="Lotes"
            bread="WMS > Recepciones > "
          />
          <Row mt={3} alignItems="center" justifyContent="center">
            <Box px={1} h="35" width="3/5">
              <SelectDropdown
                dropdownIconPosition="right"
                data={almacenes}
                defaultButtonText="Almacén"
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setSelectedAlmacen(selectedItem.id);
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
            <Box px={2} h="35" width="2/5">
              <Input
                placeholder="Filtrar"
                onChangeText={filterLotes}
                color={Colors.black}
              />
            </Box>
          </Row>
          {isLoading && <Spinner m={5} size="lg" />}
          <View style={styles.scrollContainer}>
            {!isFiltereing && (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refreshLotes}
                  />
                }
                data={lotes}
                renderItem={({item}) => (
                  <LoteCard
                    lote={item}
                    key={item.lote}
                    onPress={searchLote.bind(null, item.lote)}
                  />
                )}
              />
            )}

            {isFiltereing && (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refreshLotes}
                  />
                }
                data={filteredLotes}
                renderItem={({item}) => (
                  <LoteCard
                    lote={item}
                    key={item.lote}
                    onPress={searchLote.bind(null, item.lote)}
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

    justifyContent: 'space-between',
  },
  scrollContainer: {
    height: '82%',
    paddingTop: 10,
    margin: 5,
    width: '100%',
    // flexDirection: 'row',
  },
});
