import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CATEGORIES = [
  "Beverages",
  "Snacks",
  "Canned Goods",
  "Condiments",
  "Personal Care",
  "Household",
  "Frozen",
  "Fresh Produce",
  "Dairy",
  "Bakery",
  "Grains",
  "Other",
];

const UNITS = ["pcs", "kg", "g", "L", "mL", "pack", "box"];

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    qr_code: crypto.randomUUID().split("-")[0].toUpperCase(),
    category: "",
    quantity: 0,
    unit: "pcs",
    image: "",
    cost_price: 0,
    selling_price: 0,
    low_stock_threshold: 5,
    expiry_date: "",
    supplier: "",
    location: "",
  });

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.name || !form.category || !form.selling_price) {
      alert("Please fill required fields");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("products") || "[]");

    const newProduct = {
      ...form,
      id: Date.now(),
      quantity: Number(form.quantity),
      cost_price: Number(form.cost_price),
      selling_price: Number(form.selling_price),
      low_stock_threshold: Number(form.low_stock_threshold),
    };

    existing.push(newProduct);
    localStorage.setItem("products", JSON.stringify(newProduct));

    alert("Product added successfully!");
    navigate("/inventory");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 pb-10">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-xl font-bold">Add Product</h1>
          <p className="text-sm text-gray-500">Fill product details below</p>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-5 space-y-5">

        {/* BASIC INFO */}
        <Section title="Basic Information">

          <Input
            label="Product Name *"
            placeholder="e.g. Coca-Cola 1.5L"
            value={form.name}
            onChange={(v) => update("name", v)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="SKU"
              placeholder="Optional"
              value={form.sku}
              onChange={(v) => update("sku", v)}
            />

            <Input
              label="QR Code"
              value={form.qr_code}
              onChange={(v) => update("qr_code", v)}
            />
          </div>
        </Section>

        {/* QR PREVIEW */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${form.qr_code}`}
            className="w-20 h-20"
          />
          <div>
            <p className="text-sm font-medium">QR Preview</p>
            <p className="text-xs text-gray-500">{form.qr_code}</p>
          </div>
        </div>

        {/* CATEGORY + UNIT */}
        <Section title="Classification">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={form.category}
              onChange={(v) => update("category", v)}
              options={CATEGORIES}
            />

            <Select
              label="Unit"
              value={form.unit}
              onChange={(v) => update("unit", v)}
              options={UNITS}
            />
          </div>
        </Section>

        {/* STOCK */}
        <Section title="Stock & Pricing">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={(v) => update("quantity", v)}
            />

            <Input
              label="Low Stock Alert"
              type="number"
              value={form.low_stock_threshold}
              onChange={(v) => update("low_stock_threshold", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cost Price"
              type="number"
              value={form.cost_price}
              onChange={(v) => update("cost_price", v)}
            />

            <Input
              label="Selling Price *"
              type="number"
              value={form.selling_price}
              onChange={(v) => update("selling_price", v)}
            />
          </div>
        </Section>

        {/* EXTRA */}
        <Section title="Additional Details">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Expiry Date"
              type="date"
              value={form.expiry_date}
              onChange={(v) => update("expiry_date", v)}
            />

            <Input
              label="Location"
              placeholder="Shelf A1"
              value={form.location}
              onChange={(v) => update("location", v)}
            />
          </div>

          <Input
            label="Supplier"
            placeholder="Optional"
            value={form.supplier}
            onChange={(v) => update("supplier", v)}
          />
        </Section>

        {/* IMAGE */}
        <Section title="Product Image">
          <input
            type="file"
            accept="image/*"
            className="w-full p-3 border rounded-xl bg-gray-50"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setForm({ ...form, image: reader.result });
                };
                reader.readAsDataURL(file);
              }
            }}
          />

          {form.image && (
            <img
              src={form.image}
              className="w-24 h-24 mt-3 rounded-xl object-cover border"
            />
          )}
        </Section>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-xl font-semibold shadow-md hover:opacity-90"
        >
          Save Product
        </button>

      </div>
    </div>
  );
}

/* ------------------ UI COMPONENTS ------------------ */

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-600">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl border bg-white"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}