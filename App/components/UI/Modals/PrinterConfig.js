import React, {useContext, useState, useEffect} from 'react';
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faPrint,
  faTrash,
  faVial,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  Box,
  Button,
  Divider,
  FormControl,
  Heading,
  HStack,
  Modal,
  Row,
  ScrollView,
  Select,
  Text,
  VStack,
  KeyboardAvoidingView,
  Badge,
} from 'native-base';
import GlassContainer from '../Glassmorphism/GlassContainer';
import PrimaryInput from '../Inputs/PrimaryInput';
import Colors from '../../../util/Colors';
import {StyleSheet} from 'react-native';
import {PrinterContext} from '../../../store/context/printer-context';
import {checkPrinter, printZplBase64, printZpl} from '../../../printer';
import SelectDropdown from 'react-native-select-dropdown';

export default function PrinterConfig({open, onClose}) {
  const [seeRegister, setSeeRegister] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [serie, setSerie] = useState('');
  const [ip, setIP] = useState('');
  const [port, setPort] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const printerCtx = useContext(PrinterContext);

  const types = [
    {
      name: 'Zebra de etiquetas',
      value: 1,
    },
    {
      name: 'Zebra para etiquetas del cliente',
      value: 2,
    },
    {
      name: 'Zebra portatil',
      value: 3,
    },
    {
      name: 'EPSON tickets',
      value: 4,
    },
  ];

  function addPrinter() {
    setShowError(false);

    if (!selectedType) {
      setShowError(true);
      setErrorMessage('Es necesario seleccionar un tipo de impresora');
      return;
    }

    if (!checkIsIPV4(ip)) {
      setShowError(true);
      setErrorMessage('Campo IP no es una dirección valida');
      return;
    }

    if (!serie) {
      setShowError(true);
      setErrorMessage('Campo Nombre no es un nombre válido');
      return;
    }

    if (!port || isNaN(parseInt(port))) {
      setShowError(true);
      setErrorMessage('Campo Puerto no es un puerto válido');
      return;
    }

    if (printerExists()) {
      setShowError(true);
      setErrorMessage('Ya se ha registrado una impresora con esa IP');
      return;
    }

    const printer = {
      type: selectedType,
      serie,
      ip,
      port,
      status: 'default',
    };

    console.log(printer);
    printerCtx.addNewPrinter(printer);
    setPort('');
    setIP('');
    setSerie('');
    setSelectedType('');
    setSeeRegister(false);
  }

  function printerExists() {
    return printerCtx.printers.some((printer) => {
      if (printer.ip === ip) {
        return true;
      }

      return false;
    });
  }

  function checkIsIPV4(entry) {
    var blocks = entry.split('.');
    if (blocks.length === 4) {
      return blocks.every(function (block) {
        return parseInt(block, 10) >= 0 && parseInt(block, 10) <= 255;
      });
    }
    return false;
  }

  function deletePrinter(ip) {
    console.log('Delete: ', ip);
    printerCtx.deletePrinter(ip);
  }

  function statusPrinter(printer) {
    checkPrinter(printer.serie)
      .then(() => {
        console.log('Impresora ok');
        // printer.status = 'success';
        printerCtx.updatePrinterStatus(printer.ip, 'success');
      })
      .catch((error) => {
        console.log(error);
        printerCtx.updatePrinterStatus(printer.ip, 'error');
      });
  }

  function testPrinter(printer) {
    const zplTest =
      '^XA^FX Top section with logo, name and address.^CF0,60^FO50,50^GB100,100,100^FS^FO75,75^FR^GB100,100,100^FS^FO93,93^GB40,40,40^FS^FO220,50^FDNextCloud^FS^CF0,30^FO220,115^FD1000 Shipping Lane^FS^FO220,155^FDShelbyville TN 38102^FS^FO220,195^FDUnited States (USA)^FS^FO50,250^GB700,3,3^FS^FX Second section with recipient address and permit information.^CFA,30^FO50,300^FDPrinter Test^FS^FO50,340^FD100 Main Street^FS^FO50,380^FDSpringfield TN 39021^FS^FO50,420^FDUnited States (USA)^FS^CFA,15^FO600,300^GB150,150,3^FS^FO638,340^FDPermit^FS^FO638,390^FD123456^FS^FO50,500^GB700,3,3^FS^FX Third section with bar code.^BY5,2,270^FO100,550^BC^FD12345678^FS^FX Fourth section (the two boxes on the bottom).^FO50,900^GB700,250,3^FS^FO400,900^GB3,250,3^FS^CF0,40^FO100,960^FDCtr. X34B-1^FS^FO100,1010^FDREF1 F00B47^FS^FO100,1060^FDREF2 BL4H8^FS^CF0,190^FO470,955^FDCA^FS^XZ';

    // const zplTest = 'SGVsbG8gTmV4dCBDbG91ZA==';
    console.log(printer.ip);
    console.log(printer.port);
    console.log(zplTest);
    printZpl(printer.ip, printer.port, zplTest).catch((error) =>
      console.log(error),
    );
  }

  function onChangeSerie(e) {
    setSerie(e.nativeEvent.text);
  }

  function onChangeIP(e) {
    setIP(e.nativeEvent.text);
  }

  function onChangePort(e) {
    setPort(e.nativeEvent.text);
  }

  function savePrinters() {
    printerCtx.savePrinters();
    onClose();
  }

  useEffect(() => {
    printerCtx.loadPrinters();
  }, []);

  return (
    <Modal
      isOpen={open}
      onClose={savePrinters}
      safeAreaTop={true}
      closeOnOverlayClick={false}
      avoidKeyboard>
      <Modal.Content maxWidth="1000" maxHeight="700">
        <Modal.CloseButton />
        <Modal.Header>
          <Heading>Impresoras</Heading>
        </Modal.Header>
        <Modal.Body>
          <GlassContainer>
            <VStack width="100%">
              <Row alignContent="flex-end">
                <Button
                  w="1/5"
                  margin="1"
                  variant="outline"
                  onPress={() => setSeeRegister(true)}>
                  <Text>Registrar Impresora</Text>
                </Button>
                <Button w="1/5" variant="outline" margin="1">
                  <Text>Buscar Impresoras</Text>
                </Button>
              </Row>
              {seeRegister && (
                <VStack>
                  <Row justifyContent="space-evenly" marginTop="10">
                    <HStack width="20%">
                      <SelectDropdown
                        dropdownIconPosition="right"
                        data={types}
                        defaultButtonText="Tipo"
                        onSelect={(selectedItem, index) => {
                          console.log(selectedItem, index);
                          setSelectedType(selectedItem.value);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return selectedItem.name;
                        }}
                        rowTextForSelection={(item, index) => {
                          return item.name;
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
                    </HStack>
                    <HStack width="20%">
                      <PrimaryInput
                        type="text"
                        label="Nombre"
                        placeholder="Serie"
                        color={Colors.black}
                        onChange={onChangeSerie}
                        value={serie}
                      />
                    </HStack>
                    <HStack width="20%">
                      <PrimaryInput
                        type="text"
                        label="IP"
                        placeholder="192.168.1.0"
                        color={Colors.black}
                        onChange={onChangeIP}
                        value={ip}
                      />
                    </HStack>
                    <HStack width="20%">
                      <PrimaryInput
                        type="text"
                        label="Puerto"
                        placeholder="9100"
                        color={Colors.black}
                        onChange={onChangePort}
                        value={port}
                      />
                    </HStack>
                  </Row>
                  {showError && (
                    <Text textAlign="center" style={styles.error} m={2}>
                      {errorMessage}
                    </Text>
                  )}
                  <HStack
                    marginTop="5"
                    padding="2"
                    justifyContent="flex-end"
                    alignContent="flex-end">
                    <Button
                      variant="outline"
                      size="lg"
                      margin="2"
                      onPress={() => setSeeRegister(false)}>
                      <Text>Cancelar</Text>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      margin="2"
                      onPress={addPrinter}>
                      <Text>Agregar</Text>
                    </Button>
                  </HStack>
                </VStack>
              )}

              <VStack
                paddingTop="10"
                space={2}
                divider={<Divider w="100%" alignSelf="center" />}
                w="90%"
                m={2}
                paddingX={2}>
                <Box variant="outline">
                  <Row justifyContent="space-evenly">
                    <HStack w="1/5">
                      <Text>Tipo</Text>
                    </HStack>
                    <HStack w="1/5">
                      <Text>Nombre</Text>
                    </HStack>
                    <HStack w="1/5">
                      <Text>IP</Text>
                    </HStack>
                    <HStack w="1/5">
                      <Text>Puerto</Text>
                    </HStack>
                    <HStack w="1/5"></HStack>
                  </Row>
                </Box>
              </VStack>
              <ScrollView height="250" w="100%">
                <VStack
                  space={2}
                  divider={<Divider w="100%" alignSelf="center" />}
                  w="90%"
                  m={2}
                  p={2}>
                  {printerCtx.printers.map((printer) => (
                    <Box variant="outline">
                      <Row justifyContent="space-around" alignItems="center">
                        <HStack w="1/5">
                          <VStack>
                            <Badge
                              colorScheme={printer.status}
                              rounded="full"
                              zIndex={1}
                              variant="solid"
                              alignSelf="flex-end"></Badge>
                            <Text fontSize="xs">
                              {types[printer.type - 1].name}
                            </Text>
                          </VStack>
                        </HStack>
                        <HStack w="1/5">
                          <Text>{printer.serie}</Text>
                        </HStack>
                        <HStack w="1/5">
                          <Text>{printer.ip}</Text>
                        </HStack>
                        <HStack w="1/5">
                          <Text>{printer.port}</Text>
                        </HStack>

                        <HStack w="1/5">
                          <Button
                            m={2}
                            colorScheme="success"
                            onPress={() => statusPrinter(printer)}>
                            <FontAwesomeIcon
                              icon={faVial}
                              color={Colors.white}
                            />
                          </Button>
                          <Button
                            m={2}
                            colorScheme="success"
                            onPress={() => testPrinter(printer)}>
                            <FontAwesomeIcon
                              icon={faPrint}
                              color={Colors.white}
                            />
                          </Button>
                          <Button
                            m={2}
                            colorScheme="danger"
                            onPress={() => deletePrinter(printer.ip)}>
                            <FontAwesomeIcon
                              icon={faTrash}
                              color={Colors.white}
                            />
                          </Button>
                        </HStack>
                      </Row>
                    </Box>
                  ))}
                </VStack>
              </ScrollView>
            </VStack>
          </GlassContainer>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

const styles = StyleSheet.create({
  error: {
    color: Colors.error,
  },
});
