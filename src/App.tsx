import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
	return (
		<AuthProvider>
			<Header />
			<h1>Hello</h1>
			<Footer />
		</AuthProvider>
	);
}

export default App;
