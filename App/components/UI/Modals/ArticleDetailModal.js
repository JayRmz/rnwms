import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../../../store/context/user-context';
import axios from 'axios';
import {faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';
import base64 from 'react-native-base64';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  Button,
  Divider,
  Heading,
  HStack,
  Image,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Skeleton,
  Spinner,
  Text,
  useToast,
  VStack,
} from 'native-base';
import GlassContainer from '../Glassmorphism/GlassContainer';
import LabelDesc from '../Text/LabelDesc';
import IconFlag from '../Text/IconFlag';
import Colors from '../../../util/Colors';

export default function ArticleDetailModal({open, onClose, item}) {
  const userCtx = useContext(UserContext);

  const [articulo, setArticulo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existencias, setExistencias] = useState(false);
  const toast = useToast();

  useEffect(() => {
    console.log('DETAIL ARTICLE: ', item.sku);
    async function getDetail() {
      setIsLoading(true);

      let id = base64.encode(item.sku);
      const options = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: userCtx.token,
        },
      };

      await axios
        .get(Constants.API_URL + `articulos/${id}/detalle`, options)
        .then((resp) => {
          setIsLoading(false);
          const serviceResp = resp.data;
          if (serviceResp.codigo == 200) {
            setArticulo(serviceResp.datos);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          const toastDetail = {
            title: 'Error al obtener artículo',
            variant: 'left-accent',
            description: err.response.data.mensaje,
            isClosable: true,
            placement: 'top',
            status: 'error',
          };
          return toast.show({
            render: () => {
              return <ToastAlert id={Date()} {...toastDetail} />;
            },
          });
        });
    }

    getDetail();
  }, []);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      safeAreaTop={true}
      closeOnOverlayClick={false}
      avoidKeyboard>
      <Modal.Content maxWidth="90%" maxHeight="80%">
        {articulo != null && (
          <>
            <Modal.CloseButton />
            <Modal.Header>
              <Text>{articulo.descripcion}</Text>
            </Modal.Header>
            <Modal.Body>
              <GlassContainer>
                <ScrollView width="90%">
                  <HStack>
                    <VStack w="1/5">
                      <Image
                        source={{uri: articulo.imagenes.url_imagen_mediana}}
                        width="100"
                        height="100"
                        alt="Article image"
                        borderRadius={100}
                      />
                    </VStack>
                    <VStack w="4/5" justifyContent="flex-end">
                      {/* SKu | Descripcion */}
                      <HStack justifyContent="space-around" my={1}>
                        <VStack w="1/3">
                          <LabelDesc label="SKU" desc={articulo.sku} />
                        </VStack>
                        <VStack w="2/3">
                          <LabelDesc
                            label="Descripción"
                            desc={articulo.descripcion}
                          />
                        </VStack>
                      </HStack>

                      {/* Sku anterior| UPC | No Parte | Plataforma */}
                      <HStack justifyContent="space-around" my={1}>
                        <VStack w="1/4">
                          <LabelDesc
                            label="SKU Anterior"
                            desc={articulo.sku_anterior}
                          />
                        </VStack>
                        <VStack w="1/4">
                          <LabelDesc label="UPC" desc={articulo.upc} />
                        </VStack>
                        <VStack w="1/4">
                          <LabelDesc
                            label="No Parte"
                            desc={articulo.numero_parte}
                          />
                        </VStack>
                        <VStack w="1/4">
                          <LabelDesc
                            label="Plataforma"
                            desc={articulo.plataforma}
                          />
                        </VStack>
                      </HStack>

                      {/* Moneda | Pzas | Serie | Tipo */}
                      <HStack justifyContent="space-around" my={1}>
                        <VStack w="1/4">
                          <LabelDesc label="Moneda" desc={articulo.moneda} />
                        </VStack>
                        <VStack w="1/4">
                          <LabelDesc
                            label="Pzas. Unidad"
                            desc={articulo.piezas_por_unidad}
                          />
                        </VStack>
                        <VStack w="1/4">
                          <LabelDesc label="Serie" desc={articulo.serie} />
                        </VStack>
                        <VStack w="1/4">
                          <LabelDesc label="Tipo" desc={articulo.tipo} />
                        </VStack>
                      </HStack>

                      {/* Unidad | Medidas | UMD | Alacén */}
                      <HStack justifyContent="space-around" my={1}>
                        <VStack w="1/4">
                          <LabelDesc
                            label="Uni. Vol"
                            desc={`${articulo.peso_vol} ${articulo.umd_peso_vol}`}
                          />
                        </VStack>
                        <VStack w="1/4">
                          <LabelDesc
                            label="Largo / Alto / Ancho"
                            desc={`${articulo.largo} / ${articulo.alto} /${articulo.ancho}`}
                          />
                        </VStack>
                        <VStack w="1/4">
                          <LabelDesc label="UMD" desc={articulo.umd} />
                        </VStack>
                        <VStack w="1/4">
                          <LabelDesc
                            label="Almacén (min/max)"
                            desc={` ${articulo.min} / ${articulo.max}`}
                          />
                        </VStack>
                      </HStack>

                      <HStack justifyContent="space-around" my={1}>
                        <VStack w="1/4">
                          <LabelDesc label="Clase" desc={articulo.clase} />
                        </VStack>
                        <VStack w="1/4">
                          <LabelDesc
                            label="Peso"
                            desc={` ${articulo.peso} ${articulo.umd_peso}`}
                          />
                        </VStack>
                        <VStack w="1/4">
                          <LabelDesc label="Color" desc={articulo.color} />
                        </VStack>
                        <VStack w="1/4"></VStack>
                      </HStack>

                      <Divider my={5} />

                      {/* Axiliares */}
                      <HStack justifyContent="space-around">
                        <VStack alignItems="center">
                          <LabelDesc
                            label="Auxiliar 1"
                            desc={articulo.auxiliar_1}
                          />
                        </VStack>
                        <VStack alignItems="center">
                          <LabelDesc
                            label="Auxiliar 2"
                            desc={articulo.auxiliar_2}
                          />
                        </VStack>
                        <VStack alignItems="center">
                          <LabelDesc
                            label="Auxiliar 3"
                            desc={articulo.auxiliar_3}
                          />
                        </VStack>
                        <VStack alignItems="center">
                          <LabelDesc
                            label="Auxiliar 4"
                            desc={articulo.auxiliar_4}
                          />
                        </VStack>
                      </HStack>

                      <Divider my={5} />
                      {/* Banderas */}
                      <HStack justifyContent="space-around">
                        <IconFlag
                          isChecked={articulo.clave_estado}
                          flag="Activo"
                          style
                          iconSize={14}
                          flagFontSize={14}
                        />
                        <IconFlag
                          isChecked={articulo.descontinuado}
                          flag="Descontinuado"
                          style
                          iconSize={14}
                          flagFontSize={14}
                        />
                        <IconFlag
                          isChecked={articulo.excento}
                          flag="Excento"
                          style
                          iconSize={14}
                          flagFontSize={14}
                        />
                        <IconFlag
                          isChecked={articulo.instalacion}
                          flag="Instalación"
                          style
                          iconSize={14}
                          flagFontSize={14}
                        />
                      </HStack>
                      <HStack justifyContent="space-around">
                        <IconFlag
                          isChecked={articulo.internet}
                          flag="Internet"
                          style
                          iconSize={14}
                          flagFontSize={14}
                        />
                        <IconFlag
                          isChecked={articulo.list_precios}
                          flag="Lista de precios"
                          style
                          iconSize={14}
                          flagFontSize={14}
                        />
                        <IconFlag
                          isChecked={articulo.promocion}
                          flag="Promoción"
                          style
                          iconSize={14}
                          flagFontSize={14}
                        />
                        <IconFlag
                          isChecked={articulo.reporta_inventario}
                          flag="Rep. Inv."
                          style
                          iconSize={14}
                          flagFontSize={14}
                        />
                      </HStack>
                    </VStack>
                  </HStack>

                  <HStack justifyContent="flex-end" my={5}>
                    <Button
                      variant="outline"
                      onPress={() => setExistencias(!existencias)}>
                      <Text>{existencias ? 'Ocultar' : 'Ver'} existencias</Text>
                    </Button>
                  </HStack>

                  {existencias && (
                    <VStack m={1}>
                      <HStack justifyContent="space-around" p={1}>
                        <VStack w="1/6">
                          <Text fontWeight="bold">Almacén</Text>
                        </VStack>
                        <VStack w="1/6" alignItems="center">
                          <Text fontWeight="bold">Existencias</Text>
                        </VStack>
                        <VStack w="1/6" alignItems="center">
                          <Text fontWeight="bold">Disponible</Text>
                        </VStack>
                        <VStack w="1/6" alignItems="center">
                          <Text fontWeight="bold">Apartado</Text>
                        </VStack>
                        <VStack w="1/6" alignItems="center">
                          <Text fontWeight="bold">Ordenado</Text>
                        </VStack>
                        <VStack w="1/6" alignItems="center">
                          <Text fontWeight="bold">Backorder</Text>
                        </VStack>
                      </HStack>
                      {articulo.existencias.map((existencia, index) => (
                        <HStack
                          alignItems="center"
                          justifyContent="space-around"
                          key={index}
                          p={1}
                          backgroundColor={
                            index % 2 == 0 ? Colors.clear : Colors.darkClear
                          }>
                          <VStack w="1/6">
                            <Text fontSize={14} fontWeight="semibold">
                              {existencia.almacen}
                            </Text>
                          </VStack>
                          <VStack w="1/6" alignItems="center">
                            <Text fontSize={12}>
                              {existencia.existencia || 0}
                            </Text>
                          </VStack>
                          <VStack w="1/6" alignItems="center">
                            <Text fontSize={12}>
                              {existencia.disponible || 0}
                            </Text>
                          </VStack>
                          <VStack w="1/6" alignItems="center">
                            <Text fontSize={12}>
                              {existencia.apartado || 0}
                            </Text>
                          </VStack>
                          <VStack w="1/6" alignItems="center">
                            <Text fontSize={12}>
                              {existencia.ordenado || 0}
                            </Text>
                          </VStack>
                          <VStack w="1/6" alignItems="center">
                            <Text fontSize={12}>
                              {existencia.backorder || 0}
                            </Text>
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  )}
                </ScrollView>
              </GlassContainer>
            </Modal.Body>
          </>
        )}

        {articulo == null && <Spinner size="lg" m={10} />}
      </Modal.Content>
    </Modal>
  );
}
