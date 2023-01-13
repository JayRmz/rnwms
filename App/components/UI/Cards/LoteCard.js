import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Box, Heading, HStack, VStack, Text, Pressable} from 'native-base';
import React from 'react';
import IconButton from '../Buttons/IconButton';
import GlassContainer from '../Glassmorphism/GlassContainer';
import {
  faCheck,
  faEdit,
  faList,
  faPlus,
  faUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import Colors from '../../../util/Colors';

export default function LoteCard({key, lote = {}, onPress}) {
  return (
    <GlassContainer key={key}>
      <Box w="1000" rounded="lg" overflow="hidden">
        <HStack justifyContent="space-evenly" alignItems="flex-start">
          <VStack>
            <Text fontSize="xl" fontWeight="bold">
              {lote.lote}
            </Text>
            <Text>Emisión: {lote.emision}</Text>
          </VStack>
          <VStack>
            <Text>Estado</Text>
            <Text fontWeight="bold">{lote.descripcion_estado}</Text>
          </VStack>
          <VStack>
            <Text>Artículos: {lote.articulos}</Text>
            <Text>Cantidad: {lote.cantidad}</Text>
            <Text>Confirmados: {lote.lpn}</Text>
          </VStack>
          <VStack>
            <IconButton
              icon={faCheck}
              size={28}
              color={Colors.primary}
              onPress={onPress}
            />
          </VStack>
        </HStack>
      </Box>
    </GlassContainer>
  );
}
