import React, {createContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PrinterContext = createContext({
  printers: [],
  addNewPrinter: (printer) => {},
  savePrinters: () => {},
  loadPrinters: () => {},
  deletePrinter: () => {},
  updatePrinterStatus: (ip, status) => {},
});

export default function PrinterContextProvider({children}) {
  const [printers, setPrinters] = useState([]);

  function addNewPrinter(printer) {
    setPrinters((prevState) => [...prevState, printer]);
  }

  function deletePrinter(ip) {
    setPrinters((current) => current.filter((printer) => printer.ip !== ip));
  }

  function updatePrinterStatus(ip, status) {
    setPrinters((current) =>
      current.map((printer) => {
        if (printer.ip == ip) {
          return {...printer, status: status};
        }
        return printer;
      }),
    );
  }

  const updateObjectInArray = () => {
    setEmployees((current) =>
      current.map((obj) => {
        if (obj.id === 2) {
          return {...obj, name: 'Sophia', country: 'Sweden'};
        }

        return obj;
      }),
    );
  };

  const savePrinters = async () => {
    try {
      await AsyncStorage.setItem('printers', JSON.stringify(printers));
    } catch (e) {
      // saving error
    }
  };

  const loadPrinters = async () => {
    try {
      // await AsyncStorage.clear();
      // console.log('cleared!');

      const jsonValue = await AsyncStorage.getItem('printers');
      const printers = JSON.parse(jsonValue);
      setPrinters([]);
      for (let i in printers) {
        addNewPrinter(printers[i]);
      }
    } catch (e) {
      // error reading value
    }
  };

  const value = {
    printers: printers,
    addNewPrinter: addNewPrinter,
    savePrinters: savePrinters,
    loadPrinters: loadPrinters,
    deletePrinter: deletePrinter,
    updatePrinterStatus: updatePrinterStatus,
  };

  return (
    <PrinterContext.Provider value={value}>{children}</PrinterContext.Provider>
  );
}
