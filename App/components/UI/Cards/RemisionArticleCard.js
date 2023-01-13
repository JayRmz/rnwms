import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Box, Heading, HStack, VStack, Text, Pressable} from 'native-base';
import React from 'react';
import IconButton from '../Buttons/IconButton';
import GlassContainer from '../Glassmorphism/GlassContainer';
import {
  faEdit,
  faList,
  faMinus,
  faPlus,
  faUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import Colors from '../../../util/Colors';
export default function RemisionArticleCard({
  key,
  article = {},
  addOneItem,
  editItems,
  seriesItems,
  detailItem,
}) {
  return (
    <GlassContainer key={key}>
      <Box w="full" padding={1} rounded="lg" overflow="hidden">
        <HStack justifyContent="space-evenly" alignItems="center">
          <HStack width="1/6" m={2} p={2}>
            <Text fontSize="xl" color={Colors.primary100}>
              {article.sku}
            </Text>
            <Pressable onPress={detailItem} m={2}>
              <FontAwesomeIcon icon={faUpRightFromSquare} />
            </Pressable>
          </HStack>
          <VStack width="2/6">
            <HStack mt={2}>
              <Text isTruncated w="100%" fontSize="md">
                {article.descripcion}
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              {/* <Text fontSize="md">UPC: {article.upc}</Text> */}
              <Text fontSize="md">No. Parte: {article.numero_parte}</Text>
            </HStack>
          </VStack>
          <VStack alignItems="flex-end" width="1/6">
            <Text fontSize="lg">Articulos: {article.solicitado}</Text>
          </VStack>
          <VStack alignItems="flex-end" width="1/6">
            {/* <Text fontSize="lg">Pedidos: {article.pedido}</Text> */}
            <Text fontSize="lg">Recibidos: {article.recibe}</Text>
          </VStack>
          <HStack width="1/6" px="0.7">
            <VStack w="1/3">
              {article.requiere_serie > 0 && (
                <IconButton size={28} icon={faList} onPress={seriesItems} />
              )}
            </VStack>
            <VStack w="1/3">
              <IconButton size={28} icon={faEdit} onPress={editItems} />
            </VStack>
            <VStack w="1/3">
              <IconButton size={28} icon={faPlus} onPress={addOneItem} />
            </VStack>
          </HStack>
        </HStack>
      </Box>
    </GlassContainer>
  );
}
