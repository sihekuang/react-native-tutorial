import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from 'react-native';

export default function App() {

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({'name': 'xyz'});

  const [state, setState] = useState({myText: 'Hello!'}); // state hook
  const [isLoading, setLoading] = useState(true); // state hook
  const [data, setData] = useState([]); // state hook

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const changeTextValue = () => {
    setState({myText: 'Changed Text!'});
  };

  useEffect(() => { // the component has been loaded (life cycle of the component)

    setTimeout(async function() { // simulate Fetch request delay
      fetch('https://607a0ad7bd56a60017ba264c.mockapi.io/device/1',
          requestOptions) // the call to fetch data
          .then(
              response => response.text()) // promise to handle/process the data https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

          .then(result => {
            setLoading(false);
            result.key = result.id;
            setData([result]);
            console.log(result);
          }) // promise to handle/process the data

          .catch(error => console.log('error', error));

    }, 3000);

  }, []);

  const renderItem = ({item}) => {
    console.log(item)
    return <Text key={item.id}>
      Hello {item.name}
    </Text>;
  };

  return (
      <SafeAreaView style={styles.container}>
        <Text>{state.myText}</Text>
        <Button title="Text Changer" onPress={changeTextValue} color="magenta"/>


        {isLoading ? <ActivityIndicator size="large" color="#0000ff"/> : (
            <FlatList
                data={data}
                keyExtractor={(id, index) => id}
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
