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

export default function OrderFolioCard({key, order = {}, onPress}) {
  return (
    <Box width="100%">
      <GlassContainer key={key}>
        <Box rounded="lg" width="100%" overflow="hidden" borderWidth="1" p="2">
          <HStack justifyContent="space-between" alignItems="center" pb={2}>
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
              <Heading size="md" pl={2}>
                {order.documento} - {order.folio}
              </Heading>
            </HStack>
            {/* <VStack> */}
            <Text fontSize="lg" fontWeight="bold">
              Almacén: {order.almacen}
            </Text>
            {/* </VStack>
          <VStack> */}
            <Text fontSize="lg" fontWeight="bold">
              Proveedor: {order.proveedor}
            </Text>
            {/* </VStack> */}
            {/* <HStack alignItems="center" m={2}> */}
            <IconButton
              icon={faCheck}
              size={28}
              color={Colors.primary}
              onPress={onPress}
            />
            {/* </HStack> */}
          </HStack>
        </Box>
      </GlassContainer>
    </Box>
  );
}
