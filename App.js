import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';

export default function App() {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({"name":"xyz"});
  
  const [state, setState] = useState({myText: "Hello!"});
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const changeTextValue = () => {
    setState({myText: "Changed Text!"});
  }

  useEffect(() => {
    setTimeout(function(){ 
      fetch("https://607a0ad7bd56a60017ba264c.mockapi.io/device/1", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    }, 3000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>{state.myText}</Text>
      <Button title="Text Changer" onPress={changeTextValue} color="magenta"/>

      
      
      {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Text>{item.title}, {item.releaseYear}</Text>
          )}
        />
      )}
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
});
