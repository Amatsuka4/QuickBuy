import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Store from "./pages/Product";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <AuthProvider>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:username" element={<Store />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </AuthProvider>
    );
}

export default App;
