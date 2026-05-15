import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/inventory/ProductCard";
import jsPDF from "jspdf";
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
  const addMovement = (message) => {
  const logs = JSON.parse(localStorage.getItem("movements")) || [];

  const newLog = {
    id: Date.now(),
    action: message,
    date: new Date().toLocaleString(),
  };

  logs.unshift(newLog);
  localStorage.setItem("movements", JSON.stringify(logs));

  window.dispatchEvent(new Event("productsUpdated"));
};
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

 const handleDownloadAll = async () => {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const doc = new jsPDF();

  const grouped = products.reduce((acc, p) => {
    const cat = p.category || "Others";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  // GRID SETTINGS
  const margin = 20;
  const cols = 4;
  const spacingX = 45; // mas safe spacing
  const spacingY = 85; // IMPORTANT: increased vertical spacing

  let y = 20;

  for (const category in grouped) {
    const items = grouped[category];

    doc.setFontSize(14);
    doc.text(category, margin, y);
    y += 15;

    let colIndex = 0;
    let rowY = y;

    for (let i = 0; i < items.length; i++) {
      const product = items[i];

      const x = margin + colIndex * spacingX;

      const qrSize = 30;
      const textWidth = 30;

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        product.qr_code || product.id
      )}`;

      const imgData = await fetch(qrUrl)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            })
        );

      doc.setFontSize(8);

      // product name
      const nameLines = doc.splitTextToSize(
        product.name || "No Name",
        textWidth
      );

      const textHeight = nameLines.length * 4;

      doc.text(nameLines, x + qrSize / 2, rowY, {
        align: "center",
      });

      // QR image
      doc.addImage(
        imgData,
        "PNG",
        x,
        rowY + textHeight + 2,
        qrSize,
        qrSize
      );

      // ID text
      doc.text(
        `ID: ${product.qr_code || product.id}`,
        x + qrSize / 2,
        rowY + textHeight + qrSize + 8,
        { align: "center" }
      );

      colIndex++;

      // MOVE TO NEXT ROW
      if (colIndex === cols) {
        colIndex = 0;
        rowY += spacingY;
      }

      // PAGE BREAK FIX
      if (rowY > 250) {
        doc.addPage();
        y = 20;
        rowY = y;
        colIndex = 0;
      }
    }

    // spacing after category
    y = rowY + spacingY;
  }

  doc.save("All_Product_QR.pdf");
};

  useEffect(() => {
  const loadProducts = () => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
    setLoading(false);
  };

  loadProducts();

  window.addEventListener("productsUpdated", loadProducts);

  return () => {
    window.removeEventListener("productsUpdated", loadProducts);
  };
}, []);

 useEffect(() => {
    const handleUpdate = () => {
      const stored = JSON.parse(localStorage.getItem("products")) || [];
      setProducts(stored);
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("productsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("productsUpdated", handleUpdate);
    };
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