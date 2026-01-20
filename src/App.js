import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Forget } from './pages/Forget';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout} from './pages/Checkout';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/forget' element={<Forget/>} />
        <Route path='/signIn' element={<Login />} />
        <Route path='/signUp' element={<Signup />} />
        <Route path='/' element={<Home />} />
        <Route path='/product/:productName' element={<ProductDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
