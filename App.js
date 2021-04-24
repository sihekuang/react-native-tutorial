import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ActivityIndicator,
  FlatList, Switch,
} from 'react-native';

export default function App() {

  // Setting up REST API call
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  // React hooks
  const [state, setState] = useState({myText: 'Hello!'}); // state hook
  const [isLoading, setLoading] = useState(true); // state hook
  const [data, setData] = useState([]); // state hook

  /**
   * UseEffect consumes a method and that method is called when the React Component is loaded on the UI
   */
  useEffect(() => { // the component has been loaded (life cycle of the component)

    /**
     * Do a REST Api call
     */
    fetch('https://607a0ad7bd56a60017ba264c.mockapi.io/device',
        requestOptions)// the call to fetch data
        // doing work xyz
        .then( // when the response comes back
            response => response.json()) // promise to handle/process the data https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
        .then(result => {
          setLoading(false);
          setData(result);
          console.log(result);
        }) // promise to handle/process the data
        .catch(error => console.log('error', error));

  }, []);

  const renderItem = ({item}) => {
    return <View>
      <Text key={item.id}>
        Device Name: {item.name}
      </Text>
      <Switch value={item.isOn} />
    </View>;
  };

  /**
   * Changes the "state" that is declared in the hook
   */
  const changeTextValue = () => {
    setState({myText: 'Changed Text!'});
  };

  return (
      <SafeAreaView style={styles.container}>
        <Text>{state.myText}</Text>
        <Button title="Text Changer" onPress={changeTextValue} color="magenta"/>


        {isLoading ? <ActivityIndicator size="large" color="#0000ff"/> : (
            <FlatList
                data={data}
                keyExtractor={(id, index) => `${index}`}
                renderItem={renderItem}
            />
        )}

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
