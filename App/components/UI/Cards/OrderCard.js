import React from 'react';
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  Stack,
  NativeBaseProvider,
  VStack,
  Divider,
} from 'native-base';
import GlassContainer from '../Glassmorphism/GlassContainer';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAnchor,
  faCheck,
  faFlag,
  faGlobe,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import IconButton from '../Buttons/IconButton';
import Colors from '../../../util/Colors';

export default function OrderCard({key, order = {}, onPress}) {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  return (
    <Box width="100%">
      <GlassContainer key={key}>
        <Box w="100%" rounded="lg" overflow="hidden" borderWidth="1">
          <HStack justifyContent="space-between" alignItems="center">
            <HStack alignItems="center" m={2}>
              <FontAwesomeIcon
                icon={
                  order.documento == 'ORINT'
                    ? faGlobe
                    : order.documento == 'ORNAL'
                    ? faFlag
                    : faAnchor
                }
              />
              <Text fontSize="md" fontWeight="500" pl={2}>
                {order.documento} - {order.folio}
              </Text>
            </HStack>

            <VStack>
              <Text fontSize="md" fontWeight="500">
                ID: {order.id}
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="md" fontWeight="500">
                Usuario: {order.clave_usuario}
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="md" fontWeight="500">
                Emisión: {order.fecha_emision}
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="md" fontWeight="500">
                Importe: {formatter.format(order.importe)}
              </Text>
            </VStack>
            <HStack alignItems="center" m={2}>
              <IconButton icon={faPrint} size={28} color={Colors.black} />
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
