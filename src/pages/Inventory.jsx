import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/inventory/ProductCard";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CATEGORIES = [
  "All",
  "Beverages",
  "Snacks",
  "Canned Goods",
  "Condiments",
  "Personal Care",
  "Household",
  "Frozen",
  "Fresh Produce",
  "Dairy",
  "Bread & Bakery",
  "Rice & Grains",
  "Other",
];

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const handleDownloadAll = () => {
    console.log("Download all QR");
  };

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Coca Cola 1.5L",
        sku: "COKE-001",
        category: "Beverages",
        quantity: 20,
        unit: "bottles",
      },
      {
        id: 2,
        name: "Lucky Me Pancit Canton",
        sku: "LM-002",
        category: "Snacks",
        quantity: 5,
        unit: "packs",
      },
      {
        id: 3,
        name: "Rice 5kg",
        sku: "RICE-003",
        category: "Rice & Grains",
        quantity: 2,
        unit: "bags",
      },
    ];

    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" || p.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-4 p-4 text-gray-900">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-sm text-gray-500">
          {products.length} products
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handleDownloadAll}
          className="rounded-xl flex items-center gap-1 bg-slate-200 text-gray-700 hover:bg-blue-700 hover:text-white text-xs"
        >
          <Download className="h-4 w-4" />
          Download All QR
        </Button>

        <Link to="/add-product">
          <Button className="rounded-xl flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-900 text-white">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </Link>
      </div>

      {/* SEARCH */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white text-black rounded-xl"
          />
        </div>

        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white rounded-xl"
        >
          <Filter className="h-4 w-4 text-gray-700" />
        </Button>
      </div>

      {/* FILTER */}
      {showFilters && (
  <Select value={category} onValueChange={setCategory}>
    <SelectTrigger className="rounded-xl bg-white">
      <SelectValue placeholder="Category" />
    </SelectTrigger>

    <SelectContent className = "bg-white border rounded-xl shadow-md">
      {CATEGORIES.map((c) => (
        <SelectItem key={c} value={c}>
          {c}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)}

      {/* LIST */}
      <div className="space-y-3">
        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p>No products found</p>
        ) : (
          filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))
        )}
      </div>

    </div>
  );
}