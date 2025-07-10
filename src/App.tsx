import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";

function App() {
	return (
		<AuthProvider>
			<Header />
			<h1>Hello</h1>
		</AuthProvider>
	);
}

export default App;
