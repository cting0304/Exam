import { Routes, Route, Navigate } from "react-router-dom"
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext"; 


function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
        <Container className="text-secondary">
          <Routes>
            <Route path="/register" element = {<Register />} />
            <Route path="*" element = {<Navigate to="/" />} />
          </Routes>
        </Container>
    </>    
  );
}

export default App;
