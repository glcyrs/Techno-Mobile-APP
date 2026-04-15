import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Scanner from "./pages/Scanner";
import History from "./pages/History";
import Alerts from "./pages/Alerts";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./pages/ProductDetail";

// 404
const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl font-bold">404 - Page Not Found</h1>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ LANDING (NO NAV) */}
        <Route path="/" element={<Landing />} />

        {/* ✅ WITH NAV (AppLayout) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/history" element={<History />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </Router>
  );
}

export default App;