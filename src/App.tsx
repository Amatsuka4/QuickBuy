import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
	return (
		<AuthProvider>
			<Header />
		</AuthProvider>
	);
}

export default App;
