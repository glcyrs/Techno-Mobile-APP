import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Package,
  Calendar,
  MapPin,
  Truck,
  QrCode,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import moment from "moment";

/* ---------------- MOCK DATA ---------------- */

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Coca Cola 1.5L",
    sku: "COKE-001",
    category: "Beverages",
    unit: "bottle",
    method: "qr_scan",
    quantity: 12,
    selling_price: 65,
    cost_price: 50,
    low_stock_threshold: 5,
    expiry_date: "2026-05-10",
    supplier: "Local Supplier",
    location: "Shelf A",
    qr_code: "COKE001",
    qr_scan_count: 15,
  },
  {
    id: "2",
    name: "Instant Noodles",
    sku: "NOODLE-002",
    category: "Snacks",
    unit: "pack",
    method: "manual",
    quantity: 3,
    selling_price: 15,
    cost_price: 10,
    low_stock_threshold: 5,
    expiry_date: "2026-04-20",
    supplier: "Food Corp",
    location: "Shelf B",
    qr_code: "NOODLE002",
    qr_scan_count: 15,
  },
];

const MOCK_MOVEMENTS = {
  "1": [
    { id: "m1", type: "stock_in", quantity: 10, created_date: "2026-04-10T10:00:00Z" },
    { id: "m2", type: "sold", quantity: 2, created_date: "2026-04-11T12:00:00Z" },
  ],
  "2": [
    { id: "m3", type: "stock_in", quantity: 5, created_date: "2026-04-09T09:00:00Z" },
    { id: "m4", type: "stock_out", quantity: 2, created_date: "2026-04-10T15:00:00Z" },
  ],
};

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
  "Bread & Bakery",
  "Rice & Grains",
  "Other",
];

const UNITS = ["pcs", "kg", "g", "L", "mL", "pack", "box", "bottle", "can", "sachet", "dozen"];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  /* ---------------- LOAD MOCK ---------------- */
  useEffect(() => {
    const p = MOCK_PRODUCTS.find((x) => x.id === id);

    setProduct(p || null);
    setEditForm(p || {});
    setMovements(MOCK_MOVEMENTS[id] || []);
    setLoading(false);
  }, [id]);

  /* ---------------- EDIT ---------------- */
  const handleEdit = () => {
    setProduct(editForm);
    setEditOpen(false);
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = () => {
    setProduct(null);
    setDeleteOpen(false);
    navigate("/inventory");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={() => navigate("/inventory")} className="mt-3 rounded-xl">
          Back
        </Button>
      </div>
    );
  }

  const isLow = product.quantity <= (product.low_stock_threshold || 5);
  const isExpired =
    product.expiry_date && new Date(product.expiry_date) < new Date();

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 pb-20 space-y-5">
      {/* HEADER */}
      <div className="px-5 pt-6 flex justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        <div className="flex gap-2 bg-slate-100 bg-secondary p-1 rounded-xl">
          <Button variant="outline" size="icon" onClick={() => setEditOpen(true)}>
            <Edit />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setDeleteOpen(true)}>
            <Trash2 />
          </Button>
        </div>
      </div>

      {/* PRODUCT CARD */}
      <div className="px-5">
        <div className="bg-white bg-card rounded-2xl border p-5">
          <div className="flex gap-4">

            <div className="w-16 h-16 bg-gray-100 bg-secondary rounded-xl flex items-center justify-center">
              {product.image ? (
                  <img
                  src={product.image}
                 alt="product"
                className="w-full h-full object-cover"
                 />
                 ) : (
              <Package className="w-6 h-6 text-gray-400"/>
              )}
            </div> 

            <div>
              <h1 className="text-xl font-bold">{product.name}</h1>
              <p className="text-gray-700 text-sm text-muted-foreground">{product.category}</p>
              <p className="text-gray-500 text-xs text-muted-foreground">{product.sku}</p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-slate-100 bg-secondary p-3 rounded-xl text-center">
              <p className={cn("text-xl font-bold", isLow && "text-amber-600")}>
                {product.quantity}
              </p>
              <p className="text-xs text-gray-500">Stock</p>
            </div>

            <div className="bg-slate-100 bg-secondary p-3 rounded-xl text-center">
              <p className="text-xl font-bold">₱{product.selling_price}</p>
              <p className="text-xs text-gray-500">Price</p>
            </div>

            <div className="bg-slate-100 bg-secondary p-3 rounded-xl text-center">
              <p className="text-xl font-bold">
                ₱{product.quantity * product.selling_price}
              </p>
              <p className="text-xs text-gray-500">Value</p>
            </div>
          </div>

          {/* INFO */}
          <div className="mt-4 space-y-2 text-sm">
            {product.expiry_date && (
              <p>
                <Calendar className="inline w-4 h-4 mr-1" />
                <span className="text-xs">Expiry Date: {product.expiry_date} {isExpired && "(Expired)"}</span>
              </p>
            )}
            {product.location && (
              <p>
                <MapPin className="inline w-4 h-4 mr-1" />
                <span className="text-xs">Location: {product.location}</span>
              </p>
            )}
            {product.supplier && (
              <p>
                <Truck className="inline w-4 h-4 mr-1" />
                <span className="text-xs">Supplier: {product.supplier}</span>
              </p>
            )}
            <hr className="my-3 border-gray-300" />
            {product.qr_code && (
        <div className="mt-3 text-center">

        {/* label */}
        <p className="text-xs text-gray-500 mb-2">
         Scan this QR to find the product
          </p>

        {/* QR IMAGE */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${product.qr_code}`}
          className="w-28 h-28 rounded-lg mx-auto"
          />

          {/* SKU */}
          <p className="text-xs text-gray-400 mt-2">
            {product.sku || product.qr_code}
            </p>

          {/* DOWNLOAD BUTTON */}
            <Button
             variant="outline"
              size="sm"
            className="mx-auto rounded-xl flex items-center gap-1.5 mt-2"
            onClick={() => downloadQr(product.qr_code, product.name)}
              >
            <Download className="flex items-center w-4 h-4" />
            Download QR
              </Button>

          </div>
          )}
          </div>
        </div>
      </div>

      {/* MOVEMENTS */}
      <div className="px-5">
        <h2 className="font-semibold mb-2">Recent Movements</h2>

            <div className="bg-white rounded-2xl border divide-y">
             {movements.map((m) => {
      const isPositive =
        m.type === "stock_in" || m.type === "return";

      return (
        <div key={m.id} className="flex items-center justify-between p-3">

          {/* LEFT: ARROW */}
          <div>
            {isPositive ? (
              <ArrowDownLeft className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-red-600" />
            )}
          </div>

          {/* MIDDLE: DATE */}
          <div className="flex-1 ml-3">
            <p className="text-xs text-gray-600">
              {moment(m.created_date).format("MMM D, h:mm A")}
            </p>
          </div>

          {/* RIGHT: QTY */}
          <div className="flex flex-col items-end">
            <p
              className="text-sm font-semibold"
              style={{
                color: isPositive ? "#16a34a" : "#ef4444",
              }}
            >
              {isPositive ? "+" : "-"}
              {m.quantity || 1}
            </p>
          </div>

        </div>
      );
            })}
          </div>
            </div>

         {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="text-gray-800 bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          {/* FORM CONTAINER */}
            <div className="space-y-3 mt-2">
       {/* INPUTS */}
       <div className="text-sm text-gray-500">Name</div>
      <Input  className="bg-slate-200 border-slate-300"
        label="Product Name"
        value={editForm.name || ""}
        onChange={(e) =>
          setEditForm({ ...editForm, name: e.target.value })
        }
      />
      
      <div className="grid grid-cols-2 gap-2">
      {/* QUANTITY */}
       <div>
        <p className="text-sm text-gray-500 mb-1">SKU/Barcode</p>
        <Input
      className="bg-slate-200 border-slate-300"
      value={editForm.sku || ""}
      onChange={(e) =>
        setEditForm({ ...editForm, sku: e.target.value })
      }
          />
         </div>
         {/* QR CODE */}
        <div>
            <p className="text-sm text-gray-500 mb-1">QR Code</p>
             <Input
                 className="bg-slate-200 border-slate-300"
                value={editForm.qr_code || ""}
              onChange={(e) =>
                 setEditForm({ ...editForm, qr_code: e.target.value })
                 }
              />
             </div>
          </div>
       
       <div className="text-sm text-gray-500">Category</div>
      <Input  className="bg-slate-200 border-slate-300"
        label="Category"
        value={editForm.category || ""}
        onChange={(e) =>
          setEditForm({ ...editForm, category: e.target.value })
        }
      />

      <div className="grid grid-cols-2 gap-2">
      {/* quantity */}
       <div>
        <p className="text-sm text-gray-500 mb-1">Quantity</p>
        <Input
      className="bg-slate-200 border-slate-300"
      value={editForm.quantity || ""}
      onChange={(e) =>
        setEditForm({ ...editForm, quantity: e.target.value })
      }
            />
            </div>
         {/* unit */}
        <div>
            <p className="text-sm text-gray-500 mb-1">Unit</p>
             <Input
                 className="bg-slate-200 border-slate-300"
                value={editForm.unit || ""}
              onChange={(e) =>
                 setEditForm({ ...editForm, unit: e.target.value })
                 }
              />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
      {/* cost */}
       <div>
        <p className="text-sm text-gray-500 mb-1">Cost Price</p>
        <Input
      className="bg-slate-200 border-slate-300"
      value={editForm.cost_price || ""}
      onChange={(e) =>
        setEditForm({ ...editForm, cost_price: e.target.value })
      }
          />
          </div>
         {/* Selling Price */}
        <div>
            <p className="text-sm text-gray-500 mb-1">Selling Price</p>
             <Input
                 className="bg-slate-200 border-slate-300"
                value={editForm.selling_price || ""}
              onChange={(e) =>
                 setEditForm({ ...editForm, selling_price: e.target.value })
                 }
              />
             </div>
          </div>

            <div className="grid grid-cols-2 gap-2">
      {/* low stock*/}
       <div>
        <p className="text-sm text-gray-500 mb-1">Low Stock</p>
        <Input
      className="bg-slate-200 border-slate-300"
      value={editForm.low_stock_threshold || ""}
      onChange={(e) =>
        setEditForm({ ...editForm, low_stock_threshold: e.target.value })
      }
            />
          </div>
         {/* expiry */}
        <div>
            <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
             <Input
             type="date"
                 className="bg-slate-200 border-slate-300"
                value={editForm.expiry_date || ""}
              onChange={(e) =>
                 setEditForm({ ...editForm, expiry_date: e.target.value })
                 }
              />
             </div>
          </div>
          
          <div className="text-sm text-gray-500">Supplier</div>
      <Input  
        value={editForm.supplier || ""}
        onChange={(e) =>
          setEditForm({ ...editForm, supplier: e.target.value })
        }
        className="bg-slate-200 border-slate-300 w-full p-3 rounded-xl"

      />
        <div className="text-sm text-gray-500">Location</div>
      <Input  
        value={editForm.location || ""}
        onChange={(e) =>
          setEditForm({ ...editForm, location: e.target.value })
        }
        className="bg-slate-200 border-slate-300 w-full p-3 rounded-xl"
      />
            </div>

        <div className="space-y-1">
        <p className="text-sm text-gray-500">Product Image</p>

             <input
           type="file"
           accept="image/*"
           className="w-full p-2 rounded-xl "
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

          {/* PREVIEW */}
          {editForm.image && (
         <img
        src={editForm.image}
      alt="preview"
      className="w-20 h-20 object-cover rounded-xl mt-2 border"
          />
          )}
        </div>

        <DialogFooter className="mt-4 ">
      <Button 
        onClick={handleEdit}
        className="w-full text-white bg-green-500 hover:bg-green-600 rounded-xl"
        >Save</Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>

      {/* DELETE */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="text-gray-800 bg-white rounded-md mt-4">
          <AlertDialogHeader>
            <AlertDialogTitle >Delete Product?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className=" bg-white hover:bg-gray-100 rounded-md mt-4">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="text-white bg-red-500 hover:bg-red-600 rounded-md mt-1">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
          );
          }

