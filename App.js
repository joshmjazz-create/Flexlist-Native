import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("flexlist.db");

export default function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL);"
      );
    }, undefined, loadItems);
  }, []);

  function loadItems() {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM items ORDER BY id DESC;", [], (_, { rows }) => {
        setItems(rows._array);
      });
    });
  }

  function addItem() {
    const t = title.trim();
    if (!t) return;
    db.transaction(tx => {
      tx.executeSql("INSERT INTO items (title) VALUES (?);", [t]);
    }, undefined, () => {
      setTitle("");
      loadItems();
    });
  }

  return (
    <View style={s.container}>
      <Text style={s.h1}>FlexList (native)</Text>
      <TextInput style={s.input} placeholder="Title *" value={title} onChangeText={setTitle}/>
      <Button title="Add" onPress={addItem} />
      <FlatList
        data={items}
        keyExtractor={it => String(it.id)}
        renderItem={({item}) => <View style={s.item}><Text>{item.title}</Text></View>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container:{ flex:1, padding:16, backgroundColor:"#fff" },
  h1:{ fontSize:20, fontWeight:"700", marginBottom:8 },
  input:{ borderWidth:1, borderColor:"#ccc", borderRadius:8, padding:10, marginBottom:8 },
  item:{ padding:12, borderBottomWidth:1, borderBottomColor:"#eee" }
});
