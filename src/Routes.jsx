import React from "react"
import App from "./App"
import Login from "./Login"
import Cadastrar from "./Cadastrar"
import Add from "./Add"

import { BrowserRouter, Routes, Route} from 'react-router-dom';

const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/> 
                <Route path="/dashboard" element={<App/>}/>
                <Route path="/cadastrar" element={<Cadastrar/>}/>
                <Route path="/adicionar" element={<Add/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas