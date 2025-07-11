import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
	return (
		<AuthProvider>
			<Header />
			<main className="w-screen h-[calc(100vh-400px)]">
				<div className="w-full h-full flex items-center justify-center">
					<h1 className="text-4xl font-bold">Codeal</h1>
				</div>
			</main>
			<Footer />
		</AuthProvider>
	);
}

export default App;
