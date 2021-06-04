import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ActivityIndicator,
  FlatList, Switch,
} from 'react-native';
import LottieView from 'lottie-react-native';
import LightBulb from './assets/light-bulb.json';
import Lock from './assets/lock.json';
import Robot from './assets/robot.json';
import Puppy from './assets/strained-pup.json';

export default function App() {

  // Setting up REST API call
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  // React hooks
  const [isLoading, setLoading] = useState(true); // state hook
  const [data, setData] = useState([]); // state hook
  const lightBulbAnimation = useRef(null);

  /**
   * UseEffect consumes a method and that method is called when the React Component is loaded on the UI
   */
  useEffect(() => { // the component has been loaded (life cycle of the component)

    fetchDeviceInfo();

  }, []);

  const fetchDeviceInfo = () => {
    fetch('https://techxiothomebackend.azurewebsites.net/list/nitesh-filigree',
        requestOptions)// the call to fetch data
        // doing work xyz
        .then( // when the response comes back
            response => response.json()) // promise to handle/process the data https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
        .then(result => {
          setLoading(false);

          const updatedValues = result.map((item) => {
            if (item.network_address === 0) {
              return null;
            }
            item.isOn = false;
            return item;
          }).filter((el) => {
            return el !== null;
          }); // only select the device that has the right values

          setData(updatedValues);
        }) // promise to handle/process the data
        .catch(error => console.log('error', error));
  };

  /**
   *
   * @param item - the model coming back from the server
   * i.e.
   *  item: {
    "name": "Signify Netherlands B.V.",
    "network_address": 28504,
    "endpoint": 11,
    "cluster_ids": "0x0000,0x0003,0x0004,0x0005,0x0006,0x0008,0x1000,0xFC02,",
    "reports0": "N/A",
    "reports1": "N/A",
    "reports2": "N/A"
  }
   * device_id is always "nitesh-filigree"
   */
  const toggleDeviceState = (item, url) => {
    const {network_address} = item;
    console.log('Starting request');

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      'network_address': network_address,
      'device_id': 'nitesh-filigree',
    });

    const newItem = {...item, isOn: !item.isOn};

    const newList = data.map((i) => {
      if (i.network_address !== item.network_address) {
        return i;
      } else {
        return newItem;
      }
    });

    setData(newList);
    console.log(newList);

    const requestOptions = {
      method: 'PATCH',
      body: raw,
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(url,
        requestOptions).
        then(response => response.text()).
        then(result => {
          console.log(result);
          // fetchDeviceInfo();
        }).
        catch(error => console.log('error', error));
  };

  const renderItem = ({item}) => {

    return <View>
      <Text key={item.id}>
        Device Name: {item.name}
      </Text>
      <Switch value={item.isOn} onValueChange={
        (isOn) => {

          // solution 1 - check name of the device AKA item.name
          // solution 2 - check the cluster ids
          // if this is a doorlock
          // if(item.cluster_ids.contains("0x0101"))??
          // console.log(item);
          if (item.cluster_ids.includes('0x0101')) {
            const action = isOn ? 'unlock' : 'lock';
            toggleDeviceState(item,
                'https://techxiothomebackend.azurewebsites.net/doorlock/' + action);
            animationView.current.play();
          }

          // if this is a light
          if (item.cluster_ids.includes('0x1000')) {
            const action = isOn ? 'on' : 'off';
            toggleDeviceState(item,
                'https://techxiothomebackend.azurewebsites.net/power/' + action);
            animationView.current.play();
          }
        }
      }/>
    </View>;
  };

  const animationView = useRef(null);
  return (
      <SafeAreaView style={styles.container}>
        <Text style={{color: 'magenta', fontSize: 30, margin: 20}}>Device
          List</Text>

        <LottieView
            ref={animationView}
            //source={item.cluster_ids.includes('0x1000') ? LightBulb : Lock}
            source={LightBulb}
            autoPlay={false}
            loop={false}
        />

        {isLoading ? <ActivityIndicator size="large" color="#0000ff"/> : (
            <FlatList
                data={data}
                keyExtractor={(id, index) => `${index}`}
                renderItem={renderItem}
            />
        )}

        <Button title="Click to play animation" onPress={() => {
          animationView.current.play();
          //this triggers the animation to play
        }}/>
        <StatusBar style="auto"/>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
