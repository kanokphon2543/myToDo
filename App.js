import React, { useState, useEffect } from "react";
import { View, StatusBar, FlatList } from "react-native";
import styled from "styled-components";
import AddInput from "./components/AddInput";
import TodoList from "./components/TodoList";
import Empty from "./components/Empty";
import Header from "./components/Header";
import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [data, setData] = useState([]);

  const submitHandler = (value, date) => {
    const timetodo = date.getDate() + "/" + parseInt(date.getMonth() + 1) + "/" + parseInt(date.getFullYear() + 543);

    firestore()
      .collection('mytask')
      .add({
        value: value,
        date: timetodo,
        key: Math.random().toString()
      });
    setData((prevTodo) => {

      return [
        {
          value: value,
          date: timetodo,
          key: Math.random().toString(),
        },
        ...prevTodo,
      ];
    });
  };

  useEffect(() => {
    const showtask = firestore()
      .collection('mytask')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return {
            _id: doc.id,
            value: '',
            date: '',
            ...doc.data()
          };
        });
        setData(data);

      });
    return () => showtask();
  }, []
  );


  const deleteItem = (key) => {
    firestore()
      .collection('mytask')
      .doc(key).delete()
  };

  const searchItem = (keyword) => {

  }

  return (
    <ComponentContainer>
      <View>
        <StatusBar barStyle="light-content" backgroundColor="#75cf72" />
      </View>
      <View>
        <FlatList
          data={data}
          ListHeaderComponent={() => <Header searchItem={searchItem} />}
          ListEmptyComponent={() => <Empty />}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TodoList item={item} deleteItem={deleteItem} />
          )}
        />
        <View>
          <AddInput submitHandler={submitHandler} />
        </View>
      </View>
    </ComponentContainer>
  );
}

const ComponentContainer = styled.View`
  background-color: #75cf72;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;