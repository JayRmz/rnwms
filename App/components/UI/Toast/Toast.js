import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../../../util/Colors';
import {
  faTimesCircle,
  faInfoCircle,
  faCheckCircle,
  faExclamationCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

export default function Toast({message, header, type}) {
  let icon_switch = (type) => {
    switch (type) {
      case 'error': {
        return faTimesCircle;
      }
      case 'success': {
        return faCheckCircle;
      }
      case 'warning': {
        return faExclamationCircle;
      }
      default: {
        return faInfoCircle;
      }
    }
  };
  return (
    <View
      style={[
        styles.toastContainer,
        type == 'error'
          ? styles.backError
          : type == 'warning'
          ? styles.backWarning
          : styles.backSuccess,
      ]}>
      <View style={styles.headerContainer}>
        <FontAwesomeIcon
          icon={icon_switch(type)}
          size={20}
          style={styles.icon}
        />
        <Text style={styles.header}>{header}</Text>
      </View>
      {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    zIndex: 999,
    width: '60%',
    marginTop: 30,
    alignSelf: 'center',

    shadowColor: '#1F2687',
    shadowOpacity: 0.37,
    shadowOffset: {width: 0, height: 8},
    shadowRadius: 32,
    elevation: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    borderStyle: 'solid',
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  actionContainer: {
    // justifyContent: 'flex-end',
  },
  messageContainer: {
    alignItems: 'center',
  },
  icon: {
    margin: 5,
    color: Colors.white,
  },
  header: {
    margin: 5,
    fontSize: 18,
    color: Colors.white,
  },
  message: {
    marginVertical: 10,
    fontSize: 14,
    color: Colors.white,
  },
  backError: {
    backgroundColor: 'rgba(235, 96, 96, 0.5)',
  },
  backSuccess: {
    backgroundColor: 'rgba(124, 217, 146, 0.5)',
  },
  backWarning: {
    backgroundColor: 'rgba(247, 228, 99, 0.5)',
  },
});
