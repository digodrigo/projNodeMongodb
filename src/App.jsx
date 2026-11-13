import DashboardPage from "./pages/DashboardPage.jsx"
import Login from "./pages/Login.jsx"
import Cadastrar from "./pages/Cadastrar.jsx"
import Add from "./components/expenses/ExpenseForm.jsx"

import { BrowserRouter, Routes, Route} from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/> 
                <Route path="/dashboard" element={<DashboardPage/>}/>
                <Route path="/cadastrar" element={<Cadastrar/>}/>
                <Route path="/adicionar" element={<Add/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App