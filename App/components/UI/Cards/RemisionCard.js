import React from 'react';
import {Box, Text, HStack, VStack} from 'native-base';
import GlassContainer from '../Glassmorphism/GlassContainer';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import IconButton from '../Buttons/IconButton';
import Colors from '../../../util/Colors';

export default function RemisionCard({key, remision = {}, onPress}) {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  return (
    <Box width="100%">
      <GlassContainer key={key}>
        <Box w="100%" rounded="lg" overflow="hidden" borderWidth="1">
          <HStack justifyContent="space-between" alignItems="center">
            {/* Folio | Emisión | Descripción | Total | Acción */}
            <VStack w="1/5" alignItems="center" m={2}>
              <Text fontSize="md" fontWeight="500" pl={2}>
                {remision.folio}
              </Text>
            </VStack>

            <VStack w="1/5" alignItems="center" m={2}>
              <Text fontSize="md" fontWeight="500">
                {remision.fecha_emision_cadena}
              </Text>
            </VStack>
            <VStack w="1/5" alignItems="center" m={2}>
              <Text fontSize="md" fontWeight="500">
                {remision.almacen}
              </Text>
            </VStack>
            <VStack w="1/5" alignItems="center" m={2}>
              <Text fontSize="md" fontWeight="500">
                {formatter.format(remision.total)}
              </Text>
            </VStack>
            <HStack alignItems="center" m={2}>
              <IconButton
                icon={faCheck}
                size={28}
                color={Colors.primary}
                onPress={onPress}
              />
            </HStack>
          </HStack>
        </Box>
      </GlassContainer>
    </Box>
  );
}
