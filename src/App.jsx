// import logo from './logo.svg';
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import './App.css';
import { useState, useEffect } from "react";
import LeadFormCreate from "./Component/LeadManagement/LeadFormCreate";
import Dashboard from './Component/Dashboard/Dashboard';
import LeadFormEdit from "./Component/LeadManagement/LeadFormEdit";
import Leadslist from "./Component/LeadManagement/leadList";
import NotFound from "./Error/404error";
import Loader from './Loader';
import TransportList from './Component/TransportManagement/transportList'; // Import TransportList
import TransportFormCreate from './Component/TransportManagement/TransportFormCreate'; // Import TransportFormCreate
import TransportFormEdit from './Component/TransportManagement/TransportFormEdit'; // Import TransportFormEdit
import LoginScreen from "./Component/Signup/login";
import ProductList from "./Component/Products/productList";
import CreateProductForm from "./Component/Products/createProduct";
import EditProductForm from "./Component/Products/editProduct";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Dashboard />} />
          <Route path='/create-lead' element={<WithLoader><LeadFormCreate /></WithLoader>} />
          <Route path='/edit-lead/:id' element={<LeadFormEdit />} />
          <Route path='/lead-list' element={<Leadslist />} />
          <Route path='/product' element={<ProductList />} />
          <Route path='/create-product' element={<CreateProductForm />} />
          <Route path='/edit-product/:id' element={<EditProductForm />} />
          <Route path='/login' element={<LoginScreen />} />

          {/* Transport Management Routes */}
          <Route path='/transport-list' element={<TransportList />} /> {/* Transport List */}
          <Route path='/create-transport' element={<TransportFormCreate />} /> {/* Create Transport */}
          <Route path='/edit-transport/:id' element={<TransportFormEdit />} /> {/* Edit Transport */}
        </Routes>
      </Router>
    </div>
  );
}

function WithLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // React Router hook to track location

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate loading time

    return () => clearTimeout(timer); // Cleanup the timer
  }, [location.pathname]); // Trigger loading on route change

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>; // Render the component once loading is done
}

export default App;
