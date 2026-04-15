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

/* ---------------- MOCK DATA ---------------- */
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Coca Cola 500ml",
    sku: "COKE-500",
    qr_code: "COKEQR001",
    category: "Beverages",
    quantity: 25,
    unit: "bottle",
    selling_price: 25,
  },
  {
    id: "2",
    name: "Lucky Me Pancit Canton",
    sku: "LM-001",
    qr_code: "LMQR002",
    category: "Instant Noodles",
    quantity: 5,
    unit: "pack",
    selling_price: 18,
  },
  {
    id: "3",
    name: "Palmolive Shampoo",
    sku: "PALM-777",
    qr_code: "PALMQR003",
    category: "Personal Care",
    quantity: 0,
    unit: "bottle",
    selling_price: 120,
  },
];

export default function Scanner() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [qrInput, setQrInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [foundProduct, setFoundProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const searchProduct = async (code) => {
    const q = (code || qrInput).trim();
    if (!q) return;
    
    console.log("Searching:", q);
    
    setSearching(true);
    setFoundProduct(null);

    await new Promise((r) => setTimeout(r, 300)); // fake delay
    
    const found = MOCK_PRODUCTS.find(
      (p) =>
        p.qr_code.toLowerCase() === q.toLowerCase() ||
        p.sku.toLowerCase() === q.toLowerCase() ||
        p.name.toLowerCase().includes(q.toLowerCase())
    );

    console.log("Found:", found);

    if (found) {
      setFoundProduct(found);
      setManualOpen(false);
      setQrInput("");
    } else {
      toast.error("Product not found", {
        description: "Try QR, SKU, or name",
      });
    }

    setSearching(false);
  };

  const handleCameraScan = (code) => {
    setCameraOpen(false);
    searchProduct(code);
  };

  const handleAction = async (type) => {
    if (!foundProduct || quantity <= 0) return;

    setProcessing(true);

    const prevQty = foundProduct.quantity || 0;

    const newQty =
      type === "stock_in"
        ? prevQty + quantity
        : Math.max(0, prevQty - quantity);

    await new Promise((r) => setTimeout(r, 300)); // fake update delay

    setFoundProduct({ ...foundProduct, quantity: newQty });

    toast.success(
      `${type === "stock_in" ? "Stocked In" : type === "sold" ? "Sold" : "Removed"}: ${quantity} ${foundProduct.unit}`,
      {
        description: `${foundProduct.name}: ${prevQty} → ${newQty}`,
      }
    );

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
              <button onClick={() => setManualOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <Input className="bg-white border-gray/50 text-black"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchProduct()}
                placeholder="QR / SKU / Name"
              />
              <Button className="bg-gradient-to-r from-blue-500 to-blue-900"
              onClick={() => searchProduct()} disabled={searching}>
                <Search className="text-white h-5s w-5" />
              </Button>
            </div>
          </div>
        )}

      {/* FOUND PRODUCT */}
{foundProduct && (
  <>
    {/* PRODUCT CARD */}
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
          <span className="text-green-600 text-bold">Stock In</span> = receiving goods · <span className="text-teal-600 text-bold">Sold</span> = customer purchase · <span className="text-red-600 text-bold">Remove</span> = damaged/loss
        </div>
      </div>
    </div>
  </>
)}

      </div>
    </div>
  );
} 

