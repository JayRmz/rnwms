import React, {Component} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
} from 'react-native';
import {
  printZplBase64,
  printZpl,
  printZplImage,
  printPDF,
  checkPrinter,
} from '../printer';

export default class PrinterScreen extends Component {
  constructor() {
    super();
    this.state = {
      zpl: '',
      base64: '',
      userPrintCount: '1',
      printerSerial: '',
    };
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          alignContent: 'center',
          alignItems: 'center',
          padding: 130,
        }}>
        <Text>React Native Zebra Printer by NextCloud!</Text>
        <Text>Enter your printer Serial or Mac address</Text>
        <TextInput
          value={this.state.printerSerial}
          placeholder="Printer serial or mac"
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            padding: 3,
            width: 200,
            backgroundColor: 'white',
          }}
          onChange={(e) => {
            this.setState({printerSerial: e.nativeEvent.text});
          }}
        />
        <TouchableOpacity
          style={{
            borderWidth: 1,
            padding: 5,
            width: 200,
            backgroundColor: 'white',
            alignItems: 'center',
          }}
          onPress={() => {
            checkPrinter(this.state.printerSerial)
              .then(() => console.log('Impresora ok'))
              .catch((error) => console.log(error));
          }}>
          <Text>Check Printer!</Text>
        </TouchableOpacity>

        <Text>Now enter what you want to print and select an option</Text>
        <View style={{flexDirection: 'row', width: 500, height: 200}}>
          <TextInput
            value={this.state.userText1}
            multiline={true}
            numberOfLines={10}
            placeholder="ZPL/BASE64"
            style={{
              flex: 1,
              flexWrap: 'wrap',
              borderWidth: 1,
              borderColor: 'grey',
              padding: 3,
              width: 400,
              backgroundColor: 'white',
              textAlignVertical: 'top',
            }}
            onChange={(e) => {
              this.setState({base64: e.nativeEvent.text});
            }}
          />
        </View>
        <Text>How many copies to print?</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            padding: 3,
            width: 100,
            backgroundColor: 'white',
          }}
          value={this.state.userPrintCount}
          onChange={(text) => this.setState({userPrintCount: text})}
        />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              padding: 5,
              width: 200,
              backgroundColor: 'white',
              alignItems: 'center',
            }}
            onPress={() => {
              printZplBase64(
                this.state.printerSerial,
                this.state.userPrintCount,
                this.state.base64,
              ).catch((error) => console.log(error));
            }}>
            <Text>printZplBase64</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              padding: 5,
              width: 200,
              backgroundColor: 'white',
              alignItems: 'center',
            }}
            onPress={() => {
              printZpl(
                this.state.printerSerial,
                this.state.userPrintCount,
                this.state.base64,
              ).catch((error) => console.log(error));
            }}>
            <Text>printZpl</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              padding: 5,
              width: 200,
              backgroundColor: 'white',
              alignItems: 'center',
            }}
            onPress={() => {
              printPDF(this.state.base64).catch((error) => console.log(error));
            }}>
            <Text>printPDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              padding: 5,
              width: 200,
              backgroundColor: 'white',
              alignItems: 'center',
            }}
            onPress={() => {
              printZplImage(
                this.state.printerSerial,
                this.state.userPrintCount,
                this.state.base64,
              ).catch((error) => console.log(error));
            }}>
            <Text>printZplImage</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
