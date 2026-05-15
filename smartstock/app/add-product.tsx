import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function AddProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  const saveProduct = async () => {
    if (!name || !quantity) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      quantity: Number(quantity),
    };

    const existing = await AsyncStorage.getItem("products");
    const products = existing ? JSON.parse(existing) : [];

    const updated = [...products, newProduct];

    await AsyncStorage.setItem("products", JSON.stringify(updated));

    Alert.alert("Success", "Product added!");

    // balik sa inventory
    router.push("/");
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>

      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Add Product
      </Text>

      {/* NAME */}
      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 10,
          borderRadius: 10,
        }}
      />

      {/* QUANTITY */}
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 20,
          borderRadius: 10,
        }}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity
        onPress={saveProduct}
        style={{
          backgroundColor: "#2563eb",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Save Product
        </Text>
      </TouchableOpacity>

    </View>
  );
}