import React, {useState} from 'react';
import {
  Heading,
  HStack,
  Modal,
  Row,
  ScrollView,
  Slider,
  Text,
  VStack,
} from 'native-base';
import GlassContainer from '../Glassmorphism/GlassContainer';
import LabelDesc from '../Text/LabelDesc';
import IconFlag from '../Text/IconFlag';

export default function ComponentsModal({open, onClose}) {
  const [ldLabelSize, setLDLabelSize] = useState(12);
  const [ldDescSize, setLDDesclSize] = useState(14);
  const [ifIconSize, setIFIconSize] = useState(10);
  const [ifFlagSize, setIFFlagSize] = useState(12);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      safeAreaTop={true}
      closeOnOverlayClick={false}
      avoidKeyboard>
      <Modal.Content maxWidth="1000" height="900">
        <Modal.CloseButton />
        <Modal.Header>
          <Heading>Componentes - Test & QA purposes only</Heading>
        </Modal.Header>
        <Modal.Body>
          <GlassContainer>
            <ScrollView height="90%" w="100%" flex={1}>
              <VStack>
                <Heading>Text</Heading>
                <VStack p={2}>
                  <Text fontSize={18} fontStyle="italic">
                    Label Description
                  </Text>
                  <HStack justifyContent="space-around">
                    <VStack w="1/3">
                      <LabelDesc
                        label="Label"
                        desc="Description"
                        labelFontSize={ldLabelSize}
                        descFontSize={ldDescSize}
                      />
                    </VStack>
                    <VStack w="1/3">
                      <Text fontWeight="bold">Label - {ldLabelSize}</Text>
                      <Slider
                        onChange={(v) => {
                          setLDLabelSize(Math.floor(v));
                        }}
                        colorScheme="cyan"
                        defaultValue={12}
                        minValue={10}
                        maxValue={25}
                        step={1}>
                        <Slider.Track>
                          <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb />
                      </Slider>
                    </VStack>
                    <VStack w="1/3">
                      <Text fontWeight="bold">Desc - {ldDescSize}</Text>
                      <Slider
                        onChange={(v) => {
                          setLDDesclSize(Math.floor(v));
                        }}
                        colorScheme="cyan"
                        defaultValue={14}
                        minValue={10}
                        maxValue={25}
                        step={1}>
                        <Slider.Track>
                          <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb />
                      </Slider>
                    </VStack>
                  </HStack>
                </VStack>
                <VStack p={2}>
                  <Text fontSize={18} fontStyle="italic">
                    IconFlag
                  </Text>
                  <HStack justifyContent="space-around">
                    <VStack w="1/3" justifyContent="space-between">
                      <IconFlag
                        isChecked={1}
                        flag="Active / True"
                        iconSize={ifIconSize}
                        flagFontSize={ifFlagSize}
                      />
                      <IconFlag
                        isChecked={0}
                        flag="Inactive / False"
                        iconSize={ifIconSize}
                        flagFontSize={ifFlagSize}
                      />
                    </VStack>
                    <VStack w="1/3">
                      <Text fontWeight="bold">Icon - {ifIconSize}</Text>
                      <Slider
                        onChange={(v) => {
                          setIFIconSize(Math.floor(v));
                        }}
                        colorScheme="cyan"
                        defaultValue={12}
                        minValue={10}
                        maxValue={25}
                        step={1}>
                        <Slider.Track>
                          <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb />
                      </Slider>
                    </VStack>
                    <VStack w="1/3">
                      <Text fontWeight="bold">Flag - {ifFlagSize}</Text>
                      <Slider
                        onChange={(v) => {
                          setIFFlagSize(Math.floor(v));
                        }}
                        colorScheme="cyan"
                        defaultValue={14}
                        minValue={10}
                        maxValue={25}
                        step={1}>
                        <Slider.Track>
                          <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb />
                      </Slider>
                    </VStack>
                  </HStack>
                </VStack>
              </VStack>
            </ScrollView>
          </GlassContainer>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
