import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useContext, useRef, useState} from 'react';
import PrimaryButton from '../../../components/UI/Buttons/PrimaryButton';
import Colors from '../../../util/Colors';
import Footer from '../../../components/UI/Footer/Footer';
import GlassContainer from '../../../components/UI/Glassmorphism/GlassContainer';
import LinkButton from '../../../components/UI/Buttons/LinkButton';
import axios from 'axios';
import Constants from '../../../util/Constants';
import base64 from 'react-native-base64';
import Toast from '../../../components/UI/Toast/Toast';
import {Redirect} from 'react-router-native';
import Loader from '../../../components/UI/Loader/Loader';
import {UserContext} from '../../../store/context/user-context';
import {UIContext} from '../../../store/context/ui-context';
import CustomInput from '../../../components/UI/Inputs/Input';
import {ModulesContext} from '../../../store/context/modules-context';
import {useToast} from 'native-base';
import ToastAlert from '../../../components/UI/Toast/ToastAlert';
import PrimaryInput from '../../../components/UI/Inputs/PrimaryInput';

const image = {
  uri: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
};

export default function LoginScreen() {
  //Form View
  const [formView, setFormView] = useState('login');

  //Use Toast
  const toast = useToast();

  //Inputs
  // const [dns, setDNS] = useState('demo2');
  // const [user, setUser] = useState('mramirez');
  // const [pass, setPass] = useState('MRamirez!3');
  const [dns, setDNS] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const dnsRef = useRef();
  const userRef = useRef();
  const passRef = useRef();
  const newPassRef = useRef();
  const confPassRef = useRef();

  //Loader
  const [isLoading, setIsLoading] = useState(false);

  //Context
  const userCtx = useContext(UserContext);
  const uiCtx = useContext(UIContext);
  const modulesCtx = useContext(ModulesContext);

  function onChangeDNS(e) {
    console.log('onChangeDNS: ', e.nativeEvent.text);
    setDNS(e.nativeEvent.text);
  }

  function onChangeUser(e) {
    setUser(e.nativeEvent.text);
  }

  function onChangePass(e) {
    setPass(e.nativeEvent.text);
  }

  function onChangeNewPass(e) {
    setNewPass(e.nativeEvent.text);
  }

  function onChangeConfPass(e) {
    setConfPass(e.nativeEvent.text);
  }

  function handleLoginState(data) {
    toast.closeAll();
    modulesCtx.setAvailableModules(data.accesos_modulos.wms);
    userCtx.setToken(data.access_token);
    userCtx.setUsername(data.usu_nombre);
    userCtx.setCompany(data.empresa);
    userCtx.setCompanyLogo(data.company_logo);
    userCtx.setLoggedIn(true);
    const toastDetail = {
      title: 'Bienvenid@',
      variant: 'left-accent',
      description: data.usu_nombre,
      isClosable: true,
      placement: 'top',
      status: 'success',
    };
    return toast.show({
      render: () => {
        return <ToastAlert id={Date()} {...toastDetail} />;
      },
    });
  }

  async function doLogin() {
    toast.closeAll();
    if (dns.trim() == '' || user.trim() == '' || pass.trim() == '') {
      const toastDetail = {
        title: 'Imposible iniciar sesión',
        variant: 'left-accent',
        description: 'Todos los campos son necesarios',
        isClosable: true,
        placement: 'top',
        status: 'warning',
      };

      return toast.show({
        render: () => {
          return <ToastAlert id={Date()} {...toastDetail} />;
        },
      });
    }

    setIsLoading(true);

    //Create B64 object
    const objJSONStr = JSON.stringify({
      dns: dns,
      user: user,
      passw: pass,
      emp_id: 1,
    });

    const token = base64.encode(objJSONStr);

    let data = {
      token: token,
    };

    await axios
      .post(Constants.API_URL + 'usuarios/login', data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Accept-Language': '*',
        },
      })
      .then((resp) => {
        setIsLoading(false);
        const serviceResp = resp.data;

        const toastDetail = [
          {
            title: '',
            variant: 'left-accent',
            description: '',
            isClosable: true,
            placement: 'top',
            status: '',
          },
        ];

        switch (serviceResp.codigo) {
          case 200:
            handleLoginState(serviceResp.datos);
            break;
          case 204: // Actualizar Pswd
            toastDetail[0].title = 'Imposible iniciar sesión';
            toastDetail[0].description = 'Necesitas actualizar tu contraseña.';
            toastDetail[0].status = 'warning';
            toast.show({
              render: () => {
                return <ToastAlert id={Date()} {...toastDetail[0]} />;
              },
            });
            setFormView('update');

            break;
          case 203: //Expiró pswd -> Actualizar
            toastDetail[0].title = 'Imposible iniciar sesión';
            toastDetail[0].description =
              'La contraseña expiró, es necesario actualizarla.';
            toastDetail[0].status = 'warning';
            toast.show({
              render: () => {
                return <ToastAlert id={Date()} {...toastDetail[0]} />;
              },
            });
            setFormView('update');
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        console.log(err.response.data.mensaje);
        setIsLoading(false);
        // console.error('AXIOS ERR: ', err.response.data);
        const toastDetail = [
          {
            title: 'Error',
            variant: 'left-accent',
            description: err.response.data.mensaje,
            isClosable: true,
            placement: 'top',
            status: 'error',
          },
        ];

        return toast.show({
          render: () => {
            return <ToastAlert id={Date()} {...toastDetail[0]} />;
          },
        });
      });
  }

  async function doRecover() {
    const toastDetail = [
      {
        title: 'Imposible iniciar sesión',
        variant: 'left-accent',
        description: 'Todos los campos son necesarios',
        isClosable: true,
        placement: 'top',
        status: 'warning',
      },
    ];

    if (dns == null || user == null || dns.trim() == '' || user.trim() == '') {
      toastDetail[0].status = 'warning';
      toastDetail[0].description = 'Todos los campos son necesarios';
      toastDetail[0].title = 'Imposible recuperar contraseña';
      return toast.show({
        render: () => {
          return <ToastAlert id={Date()} {...toastDetail[0]} />;
        },
      });
    }

    setIsLoading(true);

    let data = {
      user: user,
      dns: dns,
    };

    await axios
      .put(Constants.API_URL + 'usuarios/login/password/reset', data)
      .then((resp) => {
        // console.log('Recover resp:', resp.data);
        setIsLoading(false);
        const serviceResp = resp.data;

        if (serviceResp.edo === 1) {
          toastDetail[0].status = 'success';
          toastDetail[0].description = serviceResp.data[2];
          toastDetail[0].title = serviceResp.data[1];
          setFormView('login');
          return toast.show({
            render: () => {
              return <ToastAlert id={Date()} {...toastDetail[0]} />;
            },
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toastDetail[0].status = 'error';
        toastDetail[0].description = err.response.data.mensaje;
        toastDetail[0].title = 'Error al recuperar contraseña';

        return toast.show({
          render: () => {
            return <ToastAlert id={Date()} {...toastDetail[0]} />;
          },
        });
      });
  }

  async function doUpdate() {
    const toastDetail = {
      title: 'Bienvenid@',
      variant: 'left-accent',
      description: data.usu_nombre,
      isClosable: true,
      placement: 'top',
      status: 'success',
    };

    if (
      newPass == null ||
      confPass == null ||
      newPass.trim() == '' ||
      confPass.trim() == ''
    ) {
      toastDetail.title = 'Imposible actualizar contraseña';
      toastDetail.description = 'Todos los campos son necesarizos';
      toastDetail.status = 'warning';
      return toast.show({
        render: () => {
          return <ToastAlert id={Date()} {...toastDetail} />;
        },
      });
    }

    if (newPass != confPass) {
      toastDetail.title = 'Error';
      toastDetail.description = 'Las contraseñas deben coincidir.';
      toastDetail.status = 'error';
      return toast.show({
        render: () => {
          return <ToastAlert id={Date()} {...toastDetail} />;
        },
      });
    }

    setIsLoading(true);

    let data = {
      user: user,
      dns: dns,
      password: pass,
      new_password: newPass,
    };

    await axios
      .put(Constants.API_URL + 'usuarios/login/password', data)
      .then((resp) => {
        // console.log('Update resp:', resp.data);
        setIsLoading(false);
        const serviceResp = resp.data;

        if (serviceResp.status === 1) {
          toastDetail.title = 'Correcto!';
          toastDetail.description = 'Inicia sesión con tu nueva contraseña.';
          toastDetail.status = 'success';
          setFormView('login');
          return toast.show({
            render: () => {
              return <ToastAlert id={Date()} {...toastDetail} />;
            },
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toastDetail.title = 'Error al actualizar contraseña';
        toastDetail.description = err.response.data.mensaje;
        toastDetail.status = 'error';
        return toast.show({
          render: () => {
            return <ToastAlert id={Date()} {...toastDetail} />;
          },
        });
      });
  }

  function onValidateFields() {
    if (formView == 'login') {
      if (dns == null) {
        dnsRef.current.focus();
        return;
      }

      if (user == null) {
        userRef.current.focus();
        return;
      }
      if (pass == null) {
        passRef.current.focus();
        return;
      }
      doLogin();
    } else if (formView == 'recover') {
      if (dns == null) {
        dnsRef.current.focus();
        return;
      }

      if (user == null) {
        userRef.current.focus();
        return;
      }
      doRecover();
    } else {
      doUpdate();
    }
  }

  return (
    <View style={styles.screen}>
      {userCtx.isLoggedIn && <Redirect to="/main" />}
      <ImageBackground source={image} style={styles.image}>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              resizeMethod="scale"
              source={require('../../../assets/images/NW-01.png')}
              style={styles.logo}
            />
          </View>

          {formView == 'login' && (
            <GlassContainer>
              <Image
                source={require('../../../assets/images/logo_next.png')}
                style={styles.imagotipo}
              />
              <View style={styles.formContainer}>
                <PrimaryInput
                  placeholder="Conexión"
                  label="Conexión"
                  onChange={onChangeDNS}
                  max={25}
                  inputRef={dnsRef}
                  onSubmitEditing={onValidateFields}
                  value={dns}
                  type="text"
                />

                <PrimaryInput
                  placeholder="Usuario"
                  label="Usuario"
                  onChange={onChangeUser}
                  max={10}
                  inputRef={userRef}
                  onSubmitEditing={onValidateFields}
                  value={user}
                  type="text"
                />

                <PrimaryInput
                  placeholder="********"
                  label="Contraseña"
                  onChange={onChangePass}
                  max={20}
                  inputRef={passRef}
                  onSubmitEditing={onValidateFields}
                  value={pass}
                  type="password"
                />

                {isLoading ? (
                  <Loader />
                ) : (
                  <PrimaryButton title="Iniciar sesión" onPress={doLogin} />
                )}
                <LinkButton
                  label="Olvidé mi contraseña"
                  onPress={() => setFormView('recover')}
                />
              </View>
            </GlassContainer>
          )}

          {formView == 'recover' && (
            <GlassContainer>
              <Image
                source={require('../../../assets/images/logo_next.png')}
                style={styles.imagotipo}
              />
              <View style={styles.formContainer}>
                <PrimaryInput
                  placeholder="Conexión"
                  label="Conexión"
                  onChange={onChangeDNS}
                  max={25}
                  inputRef={dnsRef}
                  onSubmitEditing={onValidateFields}
                  value={dns}
                  type="text"
                />

                <PrimaryInput
                  placeholder="Usuario"
                  label="Usuario"
                  onChange={onChangeUser}
                  max={10}
                  inputRef={userRef}
                  onSubmitEditing={onValidateFields}
                  value={user}
                  type="text"
                />

                {isLoading ? (
                  <Loader />
                ) : (
                  <PrimaryButton title="Recuperar" onPress={doRecover} />
                )}

                <LinkButton
                  label="Recuerdo mi contraseña"
                  onPress={() => setFormView('login')}
                />
              </View>
            </GlassContainer>
          )}

          {formView == 'update' && (
            <GlassContainer>
              <Image
                source={require('../../../assets/images/logo_next.png')}
                style={styles.imagotipo}
              />
              <View style={styles.formContainer}>
                <PrimaryInput
                  label="Nueva contraseña"
                  placeholder="******"
                  onChange={onChangeNewPass}
                  max={20}
                  inputRef={newPassRef}
                  onSubmitEditing={onValidateFields}
                  value={newPass}
                  type="password"
                />

                <PrimaryInput
                  label="Confirmar contraseña"
                  placeholder="******"
                  onChange={onChangeConfPass}
                  max={20}
                  inputRef={confPassRef}
                  onSubmitEditing={onValidateFields}
                  value={confPass}
                  type="password"
                />

                {isLoading ? (
                  <Loader />
                ) : (
                  <PrimaryButton title="Actualizar" onPress={doUpdate} />
                )}
              </View>
            </GlassContainer>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(1, 1, 1, 0.65)',
  },
  logoContainer: {
    // shadowColor: Colors.disabled,
    // shadowOpacity: 1,
    // shadowOffset: {width: 10, height: 5},
    // shadowRadius: 30,
    // elevation: 6,
    alignItems: 'flex-start',
    // backgroundColor: 'rgba( 255, 255, 255, 0.45 )',
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: Colors.white,
    // borderStyle: 'solid',
    margin: 8,
    padding: 8,
  },
  logo: {
    resizeMode: 'center',
    maxHeight: 150,
    maxWidth: 400,
  },
  imagotipo: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
    paddingVertical: 10,
  },
  formContainer: {
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 400,
    paddingVertical: 10,
  },
});
