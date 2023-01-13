import {Spinner, useToast} from 'native-base';
import React, {useContext, useRef, useState} from 'react';
import {UIContext} from '../../../../store/context/ui-context';
import {Redirect} from 'react-router-native';
import {StyleSheet, View} from 'react-native';
import GlassContainer from '../../../../components/UI/Glassmorphism/GlassContainer';
import Loader from '../../../../components/UI/Loader/Loader';
import BreadcrumbTitle from '../../../../components/UI/Header/BreadcrumbTitle';
import CustomInput from '../../../../components/UI/Inputs/Input';
import Footer from '../../../../components/UI/Footer/Footer';
import Header from '../../../../components/UI/Header/Header';
import PrimaryButton from '../../../../components/UI/Buttons/PrimaryButton';
import {UserContext} from '../../../../store/context/user-context';
import Constants from '../../../../util/Constants';
import ToastAlert from '../../../../components/UI/Toast/ToastAlert';
import axios from 'axios';
import SearchInput from '../../../../components/UI/Inputs/SearchInput';
import Colors from '../../../../util/Colors';
export default function BusquedaTraspaso() {
  const [folioTraspaso, setFolioTraspaso] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const folioRef = useRef();

  const uiCtx = useContext(UIContext);
  const userCtx = useContext(UserContext);
  const toast = useToast();

  function goToPage(screen) {
    if (screen == '/main') {
      uiCtx.backOnMenu(true);
    } else {
      uiCtx.setSelectedScreen(screen);
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

  async function getTraspasoPorFolio() {
    console.log('Traspaso por folio, ', folioTraspaso);
    if (folioTraspaso.trim() == '') {
      toastHandler(
        'warning',
        'Es necesario ingresar un folio válido',
        'Imposible realizar acción',
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
    setIsLoading(true);
    setLoadingMessage('Obteniendo Traspaso');
    await axios
      .get(
        Constants.API_URL +
          `traspasos/folio/${folioTraspaso}/traspasos_por_folio`,
        options,
      )
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;

        if (serviceResp.datos.length == 0 || !serviceResp.datos) {
          toastHandler(
            'warning',
            'Imposible acceder',
            'El traspaso no tiene articulos pendientes',
          );
          return;
        }

        const scrnPrps = {
          id: folioTraspaso,
        };

        uiCtx.setScreenProps(scrnPrps);
        goToPage('/detalle-traspaso');
      })
      .catch((err) => {
        setIsLoading(false);
        toastHandler(
          'error',
          err.response.data.mensaje,
          'Error al obtener Traspaso',
        );
        setFolioTraspaso('');
      });
  }
  function onChangeFolio(e) {
    console.log(e.nativeEvent.text);
    setFolioTraspaso(e.nativeEvent.text);
  }

  return uiCtx.selecetedScreen == '/traspaso-search' ? (
    <View style={styles.screen}>
      <Header />
      <View style={styles.screen}>
        <GlassContainer>
          <BreadcrumbTitle
            onPress={() => goToPage('/main')}
            title="Traspaso"
            bread="WMS > Recepciones > "
          />
          <View style={[styles.isRow, styles.folioContainer]}>
            <SearchInput
              placeholder="Folio Traspaso"
              onChange={onChangeFolio}
              inputRef={folioRef}
              onSubmitEditing={getTraspasoPorFolio}
              value={folioTraspaso}
              type="text"
              label="Buscar"
              onPress={getTraspasoPorFolio}
            />
          </View>
          {isLoading && <Spinner m={5} size="lg" />}
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
