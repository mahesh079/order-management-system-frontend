
import './App.css'
import OrderForm from './pages/OrderForm'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/Navbar';
import OrdersPage from './pages/OrdersPage';

function App() {

  return (
    <>

      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<OrderForm />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<OrdersPage />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
