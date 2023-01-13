import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  Modal,
  Row,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React, {useState} from 'react';
import Colors from '../../../util/Colors';
import IconButton from '../Buttons/IconButton';

export default function SeriesItemsModal({open, onClose, articulo, onAdd}) {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [art, setArt] = useState(articulo);
  const [serieInp, setSerieInp] = useState('');
  const [onAddDisabled, setOnAddDisabled] = useState(false);

  function validEnteredText() {
    setShowError(false);
    setOnAddDisabled(true);
    setErrorMessage('');

    if (art.recibe == art.series.length) {
      setShowError(true);
      setErrorMessage('Estás ingresando más series que artículos');
      setSerieInp('');
      return;
    }

    if (serieInp == null || serieInp.length == 0 || serieInp.trim() == '') {
      setShowError(true);
      setErrorMessage('No puedes ingresar una serie vacía.');
      setSerieInp('');
      return;
    }

    if (
      serieInp.length < art.requiere_serie ||
      serieInp.length > art.serie_tamano_maximo
    ) {
      setSerieInp('');
      setShowError(true);
      setErrorMessage(
        `La longitud de la serie no está en el rango [min: ${art.requiere_serie} / max:${art.serie_tamano_maximo}].`,
      );
      return;
    }

    setSerieInp(serieInp.toUpperCase());

    if (art.series.includes(serieInp)) {
      setShowError(true);
      setErrorMessage(`No se puede repetir la serie.`);
      return;
    }

    art.series.push(serieInp);
    setSerieInp('');
    setOnAddDisabled(false);
  }

  function removeSerie(key) {
    const seriesCopy = art.series;
    const index = seriesCopy.indexOf(key, 0);

    seriesCopy.splice(index, 1);

    setArt((prevState) => {
      return {...prevState, series: seriesCopy};
    });

    if (art.series.length < art.recibe) {
      setOnAddDisabled(true);
    }
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      safeAreaTop={true}
      closeOnOverlayClick={false}
      avoidKeyboard>
      <Modal.Content width="500">
        <Modal.CloseButton />
        <Modal.Header>
          <Heading size="md">Series: {art.sku} </Heading>
          <Text>
            [min: {art.requiere_serie} / max:
            {art.serie_tamano_maximo}]
          </Text>
        </Modal.Header>

        <Modal.Body>
          <Text>Ingresa la serie </Text>
          <FormControl my={1} isInvalid={!showError}>
            <Input
              placeholder="Serie"
              type="text"
              value={serieInp}
              onChangeText={(text) => setSerieInp(text)}
              autoCorrect={false}
              onEndEditing={validEnteredText}
            />
            {showError && <Text m={2}>{errorMessage}</Text>}
          </FormControl>

          <ScrollView
            style={{
              width: '100%',
            }}>
            {art.series.length > 0 && (
              <VStack m={1}>
                <HStack alignItems="center" justifyContent="space-around" p={1}>
                  <VStack w="3/4">
                    <Text fontWeight="bold">Serie</Text>
                  </VStack>
                  <VStack w="1/4"></VStack>
                </HStack>
                {art.series.map((serie, index) => (
                  <HStack
                    alignItems="center"
                    justifyContent="space-around"
                    key={index}
                    p={1}
                    backgroundColor={
                      index % 2 == 0 ? Colors.clear : Colors.darkClear
                    }>
                    <VStack w="3/4">
                      <Text>{serie}</Text>
                    </VStack>
                    <VStack w="1/4">
                      <IconButton
                        icon={faTrash}
                        onPress={() => removeSerie(serie)}
                      />
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            )}
          </ScrollView>
        </Modal.Body>
        <Modal.Footer justifyContent="space-between" alignItems="center">
          <VStack width="100%">
            <HStack>
              <Text m={1}>Series asignadas</Text>
              <Text m={1} fontWeight="bold">
                {art.series.length}
              </Text>
              <Text m={1}>de</Text>
              <Text m={1} fontWeight="bold">
                {art.recibe}
              </Text>
            </HStack>
            <Button.Group space={2} justifyContent="flex-end">
              <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                onPress={onAdd}
                disabled={showError}
                isDisabled={onAddDisabled}>
                Agregar
              </Button>
            </Button.Group>
          </VStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
