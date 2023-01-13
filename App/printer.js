/**
 *  JCMA
 *  printers/printer
 *  Módulo: printer
 *  Componente con lass funciones para imprimir
 *
 */
import { NetPrinter } from 'react-native-thermal-receipt-printer';
import * as Print from 'expo-print';
import RNFetchBlob from 'rn-fetch-blob';

const printZplBase64 = async (printerSerial, port = 9100, zpl) => {
    return new Promise(function (resolve, reject) {
        console.log('printZplBase64');
        if (zpl === '') {
            error = 'Your zpl seems to be missing content!';
            reject(error);
            return false;
        }
        if (printerSerial === null || printerSerial === '') {
            error = 'Print failed, no printer setup found';
            reject(error);
            return false;
        }
        const file_path = RNFetchBlob.fs.dirs.DocumentDir + "/PDF/printer.zpl";
        RNFetchBlob.fs.writeFile(file_path, zpl, 'base64').then(() => {
            zplpure = '';
            RNFetchBlob.fs.readFile(file_path, 'utf8').then((data) => {
                zplpure = data;
                console.log('zplpure', zplpure);
                try {
                    printZpl(printerSerial,port,zplpure).then((result) => {
                        if (result === false) {
                            error = 'Print failed, please check printer connection';
                            reject(error);
                            return false;
                        }
                    }).catch((err) => {
                        error = err.message;
                        reject(error);
                        return false;
                    });
                } catch (error) {
                    err = error.message;
                    reject(err);
                    return false;
                }
            });
        });
    });
}

const printZpl = async (printerSerial, port = 9100, zpl) => {
    return new Promise(function (resolve, reject) {
        console.log('printZpl', zpl);
        if (zpl === '') {
            error = 'Your zpl seems to be missing content!';
            reject(error);
            return false;
        }
        if (printerSerial === null || printerSerial === '') {
            error = 'Print failed, no printer setup found';
            reject(error);
            return false;
        }
        checkPrinter(printerSerial, port ).then((result)=>{
            console.log('result', result);
            NetPrinter.printBill(zpl);
        }).catch((error) => {
            reject(error);
        });
    });
}

const printZplImage = async (printerSerial, userPrintCount, base64) => {
    return new Promise(function (resolve, reject) {

        console.log('printZplImage');

        if (base64 === '') {
            error = 'Your base64 seems to be missing content!';
            reject(error);
            return false;
        }
        if (printerSerial === null || printerSerial === '') {
            error = 'Print failed, no printer setup found';
            reject(error);
            return false;
        }

        RNFetchBlob.fetch(
            'POST',
            'http://api.labelary.com/v1/graphics',
            {'Content-Type': 'multipart/form-data;BASE64'},
            [{ name: 'file', filename: 'file.png', data: base64 }]
        ).then((resp) => {
            zpl = resp.data;
            try {
                printZpl(printerSerial,'9100',zpl).then((result) => {
                    if (result === false) {
                        error = 'Print failed, please check printer connection';
                        reject(error);
                        return false;
                    }
                }).catch((err) => {
                    error = err.message;
                    reject(error);
                    return false;
                });
            } catch (error) {
                err = error.message;
                reject(err);
            }
        }).catch((err) => {
            error = err.message;
            reject(error);
        });
    });
}

const printPDF = (base64File) => {
    return new Promise(function (resolve, reject) {
        if (base64File === '') {
            error = 'Your base64 seems to be missing content!';
            reject(error);
            return false;
        }
        try{
            _base64File = 'data:application/pdf;base64,'+base64File;
            printFilePDF(_base64File);
            resolve(true);
        }catch (error) {
            console.log('error', error);
            error = err.message;
            reject(error);
        }
    });
}

const printFilePDF = async (file_path) => {
    await Print.printAsync({ uri: file_path });
}

const checkPrinter = async (printerSerial, port = 9100 ) => {
    return new Promise(function (resolve, reject) {
        console.log('printerSerial', printerSerial);
        NetPrinter.connectPrinter(printerSerial, parseInt(port) ).then((printer) => {
            console.log('Printer', printer);
            resolve(true);
            return true;
        }).catch((err) => {
            console.log('Error',err);
            reject(err);
            return false;
        });
    });
}


export { printZplBase64, printZpl, printZplImage, printPDF, checkPrinter };