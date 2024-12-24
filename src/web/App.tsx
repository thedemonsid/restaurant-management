import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "../web/layout";
import Dashboard from "../web/pages/dashboard";
import Tables from "../web/pages/tables";
import Test from "./pages/Test";
import Menu from "./pages/Menu";
import Orders from "./pages/orders";
import Parcels from "./pages/parcels";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard></Dashboard>} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/test" element={<Test />} />
          <Route path="/menu" element={<Menu></Menu>} />
          <Route path="/orders" element={<Orders></Orders>} />
          <Route path="/parcels" element={<Parcels></Parcels>} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
          {/* Add other routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}
