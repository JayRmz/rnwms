import {IconButton} from 'native-base';
import React, {useContext, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import AppSettings from '../../../../app.json';
import Colors from '../../../util/Colors';
import {
  faPrint,
  faPuzzlePiece,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {UserContext} from '../../../store/context/user-context';
import PrinterConfig from '../Modals/PrinterConfig';
import SearchModal from '../Modals/SearchModal';
import ComponentsModal from '../Modals/ComponentsModal';

export default function Footer(props) {
  const userCtx = useContext(UserContext);
  const [printerConfigModal, setPrinterConfigModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [componentsModal, setComponentsModal] = useState(false);

  return (
    <View style={styles.footer}>
      {componentsModal && (
        <ComponentsModal
          open={componentsModal}
          onClose={() => setComponentsModal(false)}
        />
      )}

      {printerConfigModal && (
        <PrinterConfig
          open={printerConfigModal}
          onClose={() => setPrinterConfigModal(false)}
        />
      )}

      {searchModal && (
        <SearchModal open={searchModal} onClose={() => setSearchModal(false)} />
      )}

      {userCtx.isLoggedIn && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignContent: 'flex-start',
            paddingLeft: 15,
          }}>
          <Pressable
            style={styles.iconButton}
            onPress={() => setSearchModal(true)}>
            <FontAwesomeIcon icon={faSearch} size={25} color={Colors.white} />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => setPrinterConfigModal(true)}>
            <FontAwesomeIcon icon={faPrint} size={25} color={Colors.white} />
          </Pressable>
          {/* <Pressable
            style={styles.iconButton}
            onPress={() => setComponentsModal(true)}>
            <FontAwesomeIcon
              icon={faPuzzlePiece}
              size={25}
              color={Colors.white}
            />
          </Pressable> */}
        </View>
      )}
      {!userCtx.isLoggedIn && <View></View>}
      <Text style={styles.footerText}>
        {AppSettings.test
          ? `${AppSettings.version} - ${AppSettings.build} (${AppSettings.text})`
          : `${AppSettings.version} - ${AppSettings.build}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: Colors.black,
    paddingTop: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  footerText: {
    color: Colors.lightGrey,
    textAlign: 'right',
    padding: 5,
    marginHorizontal: 5,
    alignSelf: 'center',
  },
  iconButton: {
    margin: 5,
    paddingHorizontal: 5,
  },
});
