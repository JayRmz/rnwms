import {
  Button,
  FormControl,
  Input,
  KeyboardAvoidingView,
  Modal,
  Text,
} from 'native-base';
import React, {useState} from 'react';

export default function EditItemsModal({open, onClose, articulo, onAdd}) {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputVal, setInputVal] = useState(articulo.recibe.toString());

  console.log('Edit Items Art: ', articulo);
  console.log(inputVal);

  function validEnteredText(text) {
    setShowError(false);
    setErrorMessage('');
    setInputVal(text);
    var val = +text;
    if (isNaN(parseFloat(val))) {
      console.log('NOT A NUMBER!');
      setShowError(true);
      setErrorMessage('Debes incluir valores numericos.');
      setInputVal('');
      return;
    }
    if (val > articulo.pedido || val > articulo.solicitado) {
      setShowError(true);
      setErrorMessage('La cantidad es mayor a la requerida');
      setInputVal('');
      return;
    }
    if (val < 0) {
      setShowError(true);
      setErrorMessage('La cantidad debe ser mayor a 0');
      setInputVal('');
      return;
    }

    // console.log('typeof:', typeof val);

    articulo.recibe = val;
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      safeAreaTop={true}
      closeOnOverlayClick={false}
      avoidKeyboard>
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header>{articulo.sku}</Modal.Header>
        <Modal.Body>
          <Text>Cantidad a agregar: </Text>
          <FormControl my={1} isInvalid={!showError}>
            <Input
              placeholder="0"
              type="text"
              onChangeText={validEnteredText}
              keyboardType="decimal-pad"
              value={inputVal}
            />
            {showError && <Text m={2}>{errorMessage}</Text>}
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
              Cancelar
            </Button>
            <Button onPress={onAdd} disabled={showError}>
              Agregar
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
