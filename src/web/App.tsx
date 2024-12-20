import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/web/layout";
import Dashboard from "@/web/pages/dashboard";
import Tables from "@/web/pages/tables";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tables" element={<Tables />} />
          {/* Add other routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}
