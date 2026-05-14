import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  Download,
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Calendar,
  MapPin,
  Truck,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { cn } from "@/lib/utils";

/* ---------------- SAFE STORAGE ---------------- */
const getLS = (key, fallback) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : fallback;
  } catch {
    return fallback;
  }
};

const setLS = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/* ---------------- QR DOWNLOAD (FIXED) ---------------- */
const downloadQr = (product) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    product.qr_code
  )}`;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = qrUrl;

  img.onload = () => {
    // canvas size
    canvas.width = 500;
    canvas.height = 650;

    // background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ===== TITLE (CENTER) =====
    ctx.fillStyle = "#111";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText(product.name, canvas.width / 2, 60);

    // ===== QR IMAGE (CENTER) =====
    ctx.drawImage(img, 100, 100, 300, 300);

    // ===== QR ID (CENTER) =====
    ctx.fillStyle = "#666";
    ctx.font = "16px Arial";
    ctx.fillText(
      `QR ID: ${product.qr_code}`,
      canvas.width / 2,
      450
    );

    // optional small footer
    ctx.font = "12px Arial";
    ctx.fillText("Scan this QR Code to view product", canvas.width / 2, 480);

    // download
    const link = document.createElement("a");
    link.download = `${product.name}-QR.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
};

/* ---------------- COMPONENT ---------------- */
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  const [toast, setToast] = useState({ show: false, message: "" });
  const showToast = (message) => {
  setToast({ show: true, message });

  setTimeout(() => {
    setToast({ show: false, message: "" });
  }, 2500);
};

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    const products = getLS("products", []);
    const movementsAll = getLS("movements", []);

    const found = products.find((p) => p.id?.toString() === id);

    if (!found) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setProduct(found);
    setEditForm(found);

    const filtered = movementsAll.filter((m) => {
  return String(m.product_id) === String(id);
});

    setMovements(filtered);
    setLoading(false);
  }, [id]);

  /* ---------------- SAVE EDIT ---------------- */
  const handleSave = () => {
  const products = getLS("products", []);

  const updated = products.map((p) =>
    p.id?.toString() === id
      ? {
          ...p,
          ...editForm,
          qr_code: p.qr_code, //  QR FIXED (cannot change)
        }
      : p
  );

  setLS("products", updated);
  setProduct({ ...product, ...editForm });

  setEditOpen(false);
  showToast("Product updated successfully");
};

  /* ---------------- DELETE ---------------- */
  const handleDelete = () => {
    const products = getLS("products", []);
    const movementsAll = getLS("movements", []);

    setLS(
      "products",
      products.filter((p) => p.id?.toString() !== id)
    );

    setLS(
      "movements",
      movementsAll.filter((m) => m.product_id?.toString() !== id)
    );

    setDeleteOpen(false);

    navigate("/inventory");
  };


  if (loading) return <p className="p-5">Loading...</p>;
  if (!product) return <p className="p-5">Product not found</p>;

  const isLow =
    product.quantity <= (product.low_stock_threshold || 5);

  const isExpired =
    product.expiration_date &&
    new Date(product.expiration_date) < new Date();

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen overflow-y-auto bg-gray-100 pb-20 space-y-5">

      {/* HEADER */}
      <div className="px-5 pt-6 flex justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        <div className="flex gap-2">
          <Button onClick={() => setEditOpen(true)} variant="outline" size="icon">
            <Edit />
          </Button>
          <Button onClick={() => setDeleteOpen(true)} variant="outline" size="icon">
            <Trash2 />
          </Button>
        </div>
      </div>

      {/* PRODUCT CARD */}
      <div className="px-5">
        <div className="bg-white rounded-2xl border p-5">

          {/* HEADER INFO */}
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
              {product.image ? (
                <img src={product.image} className="w-full h-full object-cover" />
              ) : (
                <Package />
              )}
            </div>

            <div>
              <h1 className="font-bold text-xl">{product.name}</h1>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-xs text-gray-400">SKU: {product.sku}</p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-gray-100 p-3 rounded-xl text-center">
              <p className={cn("text-xl font-bold", isLow && "text-red-500")}>
                {product.quantity}
              </p>
              <p className="text-xs">Stock</p>
            </div>

            <div className="bg-gray-100 p-3 rounded-xl text-center">
              <p className="text-xl font-bold">₱{product.selling_price}</p>
              <p className="text-xs">Price</p>
            </div>

            <div className="bg-gray-100 p-3 rounded-xl text-center">
              <p className="text-xl font-bold">
                ₱{product.quantity * product.selling_price}
              </p>
              <p className="text-xs">Value</p>
            </div>
          </div>

          {/* DETAILS (FIXED COMPLETE) */}
          <div className="mt-4 text-sm space-y-2">
            <p><Calendar className="inline w-4 h-4 mr-1" />
              Expiration: {product.expiration_date || "N/A"}
              {isExpired && " (Expired)"}
            </p>

            <p><MapPin className="inline w-4 h-4 mr-1" />
              Location: {product.location || "N/A"}
            </p>

            <p><Truck className="inline w-4 h-4 mr-1" />
              Supplier: {product.supplier || "N/A"}
            </p>
          </div>

          {/* QR (FIXED DOWNLOAD) */}
          {product.qr_code && (
            <div className="mt-6 text-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  product.qr_code
                )}`}
                className="mx-auto border rounded-lg"
              />

              <p className="text-xs mt-2 text-gray-500">
                QR ID: {product.qr_code}
              </p>

              <Button
                className="mt-2"
                variant="outline"
                onClick={() => downloadQr(product)}
              >
                <Download className="w-4 h-4 mr-1" />
                Download QR
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* MOVEMENTS */}
      <div className="px-5">
        <h2 className="font-semibold mb-2">Recent Movements</h2>

        <div className="bg-white rounded-2xl border divide-y">
          {movements.length === 0 ? (
            <p className="p-4 text-gray-400 text-sm">No movements yet</p>
          ) : (
          movements.map((m) => (
  <div key={m?.id || Math.random()} className="flex justify-between items-center p-3">

    <div>
      <p className="text-sm font-medium mt-1 flex items-center gap-1">
        {m?.type === "stock_in" && (
          <>
            <ArrowDownLeft className="w-3 h-3 text-green-600" />
            <span className="text-green-600">Stock In</span>
          </>
        )}

        {m?.type === "stock_out" && (
          <>
            <ArrowUpRight className="w-3 h-3 text-red-500" />
            <span className="text-red-500">Stock Out</span>
          </>
        )}

        {m?.type === "sold" && (
          <>
            <ShoppingCart className="w-3 h-3 text-blue-600" />
            <span className="text-blue-600">Sold</span>
          </>
        )}
        
      </p>

      <p className="text-xs text-gray-500">
        {m?.timestamp
          ? moment(Number(m.timestamp)).format("MMM D, h:mm A")
          : "No date"}
      </p>

    </div>

    <p className={`font-semibold flex items-center gap-1 ${
      m?.type === "stock_in" ? "text-green-600" : "text-red-500"
    }`}>
      {m?.type === "stock_in" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
      {m?.type === "stock_in" ? "+" : "-"}
      {m?.quantity || 0}
    </p>

  </div>
))
          )}

          {toast.show && (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl shadow-lg z-50">
    {toast.message}
  </div>
)}
        </div>
      </div>

      {/* EDIT */}
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
  <DialogContent className="bg-white max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6">

    {/* HEADER */}
    <DialogHeader>
      <DialogTitle className="text-lg font-bold">
        Edit Product
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-6 mt-4">

      {/* PRODUCT INFO */}
      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
        <p className="text-xs font-semibold text-gray-500">
          Product Information
        </p>

        {/* NAME */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Product Name</p>
          <Input
            className="bg-white"
            value={editForm.name || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, name: e.target.value })
            }
          />
        </div>

        {/* SKU */}
        <div>
          <p className="text-xs text-gray-500 mb-1">SKU</p>
          <Input
            className="bg-white"
            value={editForm.sku || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, sku: e.target.value })
            }
          />
        </div>

        {/* CATEGORY */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Category</p>
          <select
            className="w-full p-2 border rounded-lg bg-white text-sm"
            value={editForm.category || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            <option value="Beverages">Beverages</option>
            <option value="Snacks">Snacks</option>
            <option value="Canned Goods">Canned Goods</option>
            <option value="Dairy">Dairy</option>
            <option value="Frozen">Frozen</option>
            <option value="Household">Household</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* INVENTORY */}
      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
        <p className="text-xs font-semibold text-gray-500">
          Inventory
        </p>

        <div className="grid grid-cols-2 gap-3">

          <div>
            <p className="text-xs text-gray-500 mb-1">Quantity</p>
            <Input
              className="bg-white"
              type="number"
              value={editForm.quantity || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, quantity: e.target.value })
              }
            />
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Unit</p>
            <Input
              className="bg-white"
              value={editForm.unit || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, unit: e.target.value })
              }
            />
          </div>

        </div>
      </div>

      {/* PRICING */}
      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
        <p className="text-xs font-semibold text-gray-500">
          Pricing
        </p>

        <div className="grid grid-cols-2 gap-3">

          <div>
            <p className="text-xs text-gray-500 mb-1">Cost Price</p>
            <Input
              className="bg-white"
              type="number"
              value={editForm.cost_price || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, cost_price: e.target.value })
              }
            />
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Selling Price</p>
            <Input
              className="bg-white"
              type="number"
              value={editForm.selling_price || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, selling_price: e.target.value })
              }
            />
          </div>

        </div>
      </div>

      {/* OTHER DETAILS */}
      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
        <p className="text-xs font-semibold text-gray-500">
          Other Details
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
          <p className="text-xs text-gray-500 mb-1">Expiration Date</p>
          <Input
            type="date"
            value= {editForm.expiration_date || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                expiration_date: e.target.value,
              })
            }
            className=" bg-white"
          />
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Location</p>
          <Input
            className="bg-white"
            value={editForm.location || ""} 
            onChange={(e) =>
              setEditForm({ ...editForm, location: e.target.value })
            }
          />
        </div>
      </div>

      
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Supplier</p>
          <Input
            className="bg-white"
            value={editForm.supplier || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, supplier: e.target.value })
            }
          />
        </div>
</div>

      {/* QR SECTION (BELOW PRODUCT INFO) */}
      <div className="bg-gray-50 p-4 rounded-xl text-center">
        <p className="text-center text-xs font-semibold text-gray-500 mb-3">
          Product QR Code (Locked)
        </p>

        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
            editForm.qr_code || ""
          )}`}
          className="mx-auto border rounded-lg"
        />

        <p className="text-center text-xs text-gray-400 mt-2">
          ID: {editForm.qr_code}
        </p>
      </div>

      {/* IMAGE (BOTTOM) */}
      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
        <p className="text-xs font-semibold text-gray-500">
          Product Image
        </p>

        <Input
          type="file"
          accept="image/*"
          className="bg-white border p-2 rounded-lg"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onloadend = () => {
              setEditForm({
                ...editForm,
                image: reader.result,
              });
            };
            reader.readAsDataURL(file);
          }}
        />

        {editForm.image && (
          <img
            src={editForm.image}
            className="w-20 h-20 object-cover rounded-lg border"
          />
        )}
      </div>

    </div>

    {/* SAVE BUTTON */}
    <DialogFooter className="mt-6">
      <Button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
      >
        Save Changes
      </Button>
    </DialogFooter>

  </DialogContent>
</Dialog>

      {/* DELETE */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
  <AlertDialogContent className="bg-white rounded-2xl p-6 max-w-md">

    {/* HEADER */}
    <AlertDialogHeader className="text-center space-y-3">

      {/* ICON */}
      <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <AlertTriangle className="text-red-500 w-6 h-6" />
      </div>

      <AlertDialogTitle className="text-lg font-bold">
        Delete Product?
      </AlertDialogTitle>

      <AlertDialogDescription className="text-sm text-gray-500">
        This action cannot be undone. The product and all related data will be permanently removed.
      </AlertDialogDescription>

    </AlertDialogHeader>

    {/* FOOTER */}
    <AlertDialogFooter className="mt-6 flex gap-2">

      <AlertDialogCancel className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl">
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={handleDelete}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl"
      >
        Delete
      </AlertDialogAction>

    </AlertDialogFooter>

  </AlertDialogContent>
</AlertDialog>

    </div>
  );
}