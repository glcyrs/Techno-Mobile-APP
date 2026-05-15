import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  const loadProducts = async () => {
    try {
      const data = await AsyncStorage.getItem("products");
      if (data) {
        setProducts(JSON.parse(data));
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("Error loading:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Inventory
      </Text>

      {/* ADD BUTTON */}
      <TouchableOpacity
        onPress={() => router.push("/add-product")}
        style={{
          backgroundColor: "#16a34a",
          padding: 12,
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          + Add Product
        </Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id?.toString()}
        ListEmptyComponent={
          <Text style={{ color: "gray" }}>No products yet</Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text>Stock: {item.quantity}</Text>
          </View>
        )}
      />
    </View>
  );
}