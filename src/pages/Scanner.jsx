import { useState } from "react";
import {
  ScanLine,
  Camera,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingCart,
  Keyboard,
  X,
} from "lucide-react";

import QrCameraScanner from "../components/scanner/QrCameraScanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import PageHeader from "../components/layout/PageHeader";
import { cn } from "@/lib/utils";

const getProducts = () => {
  return JSON.parse(localStorage.getItem("products")) || [];
};

export default function Scanner() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [qrInput, setQrInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [foundProduct, setFoundProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [suggestions, setSuggestions] = useState([]);
  const handleSuggest = (text) => {
  const q = text.toLowerCase().trim();
  setQrInput(text);

  if (!q) {
    setSuggestions([]);
    return;
  }

  const products = JSON.parse(localStorage.getItem("products")) || [];

  const matches = products.filter((p) =>
    p.name?.toLowerCase().includes(q) ||
    p.sku?.toLowerCase().includes(q) ||
    p.qr_code?.toLowerCase().includes(q)
  ).slice(0, 5); // limit 5 suggestions

  setSuggestions(matches);
};

  //  ADDED BANNER STATE
  const [banner, setBanner] = useState(null);

  //  ADDED BANNER FUNCTION
  const showBanner = (type, name, qty) => {
    const message =
      type === "stock_in"
        ? `Stock In ${qty} ${name}`
        : type === "sold"
        ? `Sold ${qty} ${name}`
        : `Removed ${qty} ${name}`;

    setBanner({ type, message });

    setTimeout(() => {
      setBanner(null);
    }, 3000);
  };

  const searchProduct = async (code) => {
    const q = (code || qrInput).trim();
    if (!q) return;

    setSearching(true);
    setFoundProduct(null);

    await new Promise((r) => setTimeout(r, 300));

    const products = JSON.parse(localStorage.getItem("products")) || [];

    const found = products.find(
      (p) =>
        p.qr_code?.toLowerCase() === q.toLowerCase() ||
        p.sku?.toLowerCase() === q.toLowerCase() ||
        p.name?.toLowerCase().includes(q.toLowerCase())
    );

    if (found) {
      setFoundProduct(found);
      setManualOpen(false);
      setQrInput("");
    } else {
      toast.error("Product not found");
    }

    setSearching(false);
  };

  const handleCameraScan = (code) => {
    setCameraOpen(false);
    setTimeout(() => {
      searchProduct(code);
    }, 200);
  };

  const handleAction = async (type) => {
  if (!foundProduct || quantity <= 0) return;

  setProcessing(true);

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const index = products.findIndex(
    (p) => String(p.id) === String(foundProduct.id)
  );

  if (index === -1) return;

  const prevQty = Number(products[index].quantity) || 0;

  let newQty = prevQty;

  if (type === "stock_in") {
    newQty = prevQty + quantity;
  } else {
    newQty = Math.max(0, prevQty - quantity);
  }

  // update product
  products[index].quantity = newQty;
  localStorage.setItem("products", JSON.stringify(products));

  // get logs
  const logs = JSON.parse(localStorage.getItem("movements") || "[]");

  const newLog = {
    id: Date.now(),
    type,
    product_id: foundProduct.id,
    product_name: foundProduct.name,
    quantity,
    unit: foundProduct.unit || "pcs",
    method: "QR",
    timestamp: Date.now(),

    //  IMPORTANT FOR HISTORY + STATISTICS
    previous_quantity: prevQty,
    new_quantity: newQty,
  };

  logs.unshift(newLog);

  localStorage.setItem("movements", JSON.stringify(logs));

  window.dispatchEvent(new Event("productsUpdated"));
  window.dispatchEvent(new Event("movementsUpdated"));

  setFoundProduct({ ...products[index] });
  setQuantity(1);
  setProcessing(false);
};

  return (
    <div className="space-y-5 h-screen overflow-y-auto">

      <PageHeader
        logo="logo-only.png"
        title="Stock Scanner"
        subtitle="Scan QR or search product"
      />

      {/* ✅ BANNER UI (ADDED ONLY) */}
      {banner && (
        <div
          className={`mx-5 mb-3 p-3 rounded-xl text-white text-sm shadow-md transition-all duration-300 ${
            banner.type === "stock_in"
              ? "bg-green-600"
              : banner.type === "sold"
              ? "bg-yellow-500"
              : "bg-red-600"
          }`}
        >
          {banner.message}
        </div>
      )}

      {cameraOpen && (
        <QrCameraScanner
          onScan={handleCameraScan}
          onClose={() => setCameraOpen(false)}
        />
      )}

      <div className="px-5 space-y-4">

        {/* CAMERA SCAN */}
        <div
          className="bg-white bg-card border-2 border-dashed border-primary border-blue-500 hover:bg-blue-100 rounded-3xl p-8 flex flex-col items-center gap-4 cursor-pointer transition-colors"
          onClick={() => setCameraOpen(true)}
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Camera className="h-20 w-20 text-blue-700 bg-blue-100 p-5 rounded-2xl" />
          </div>
          <div className="text-center">
            <p className="font-semibold">Tap to Scan QR Code</p>
            <p className="text-gray-400 text-xs text-muted-foreground">
              Point camera at product QR
            </p>
          </div>
        </div>

      {/* MANUAL SEARCH */}
{!manualOpen ? (
  <button
    onClick={() => setManualOpen(true)}
    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-muted-foreground hover:text-foreground"
  >
    <Keyboard className="h-4 w-4" />
    Search manually
  </button>
) : (
  <div className="bg-white bg-card border-blue-400 border rounded-2xl p-4 space-y-3">
    
    <div className="flex justify-between">
      <p className="text-sm font-medium">Manual Search</p>
      <button onClick={() => {
        setManualOpen(false);
        setSuggestions([]);
      }}>
        <X className="h-4 w-4" />
      </button>
    </div>

    {/* INPUT + BUTTON WRAPPER */}
    <div className="relative flex gap-2">
      <Input
        className="bg-white border-gray/50 text-black"
        value={qrInput}
        onChange={(e) => handleSuggest(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && searchProduct()}
        placeholder="QR / SKU / Name"
      />

      <Button
        className="bg-gradient-to-r from-blue-500 to-blue-900"
        onClick={() => searchProduct()}
        disabled={searching}
      >
        <Search className="text-white h-5 w-5" />
      </Button>

      {/* ✅ SUGGESTIONS DROPDOWN */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-xl mt-2 shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setQrInput(p.name);
                setSuggestions([]);
                searchProduct(p.name);
              }}
              className="p-2 flex items-center justify-between hover:bg-gray-100 cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category}</p>
              </div>

              <p className="text-xs text-gray-500">
                {p.quantity} {p.unit}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
         
        {/* FOUND PRODUCT */}
        {foundProduct && (
          <>
            <div className="space-y-3">
              <div className="bg-white border-blue-300 border rounded-2xl p-4">

                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                    {foundProduct.image ? (
                      <img src={foundProduct.image} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">No Img</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">{foundProduct.name}</p>
                    <p className="text-xs text-gray-500">{foundProduct.category}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold">{foundProduct.quantity}</p>
                    <p className="text-xs text-gray-400">{foundProduct.unit}</p>
                  </div>
                </div>

                <hr className="my-3 border-gray-200" />

                <div className="flex justify-between items-center">
                  <button
                    className="text-xs text-red-500 underline"
                    onClick={() => {
                      setFoundProduct(null);
                      setQuantity(1);
                    }}
                  >
                    Clear
                  </button>

                  <div className="text-right">
                    <p className="text-s font-bold">₱{foundProduct.selling_price}</p>
                    <p className="text-xs text-gray-400">per {foundProduct.unit}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="bg-white border-blue-300 border rounded-2xl p-4 space-y-4">
              <Label className="text-s">Quantity</Label>

              <div className="flex items-center gap-3">
                <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>

                <Input
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="text-center w-20"
                />

                <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => handleAction("stock_in")} className="bg-green-600">
                  <ArrowDownLeft className="text-white h-4 w-4" />
                  <p className="text-xs text-white">Stock In</p>
                </Button>

                <Button onClick={() => handleAction("sold")} className="bg-teal-600">
                  <ShoppingCart className="text-white h-4 w-4" />
                  <p className="text-xs text-white">Sold</p>
                </Button>

                <Button onClick={() => handleAction("stock_out")} className="bg-red-600">
                  <ArrowUpRight className="text-white h-4 w-4" />
                  <p className="text-xs text-white">Remove</p>
                </Button>

                <div className="text-center text-xs text-gray-500 col-span-3">
                  <span className="text-green-600 font-bold">Stock In</span> = receiving goods ·{" "}
                  <span className="text-teal-600 font-bold">Sold</span> = customer purchase ·{" "}
                  <span className="text-red-600 font-bold">Remove</span> = damaged/loss
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}