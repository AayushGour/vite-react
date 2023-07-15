import { BrowserRouter } from 'react-router-dom'
import './App.css'
import RouterComponent from './components/main/router.component'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import axios from "./components/utility/axios";


function App() {

  return (
    <BrowserRouter>
      <RouterComponent />
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={true}
      />
    </BrowserRouter>
  )
}

export default App
