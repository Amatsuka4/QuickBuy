export function LoadingSpinner() {
	return (
		<div className="flex items-center">
			<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
			<span className="ml-2 text-gray-600">Loading...</span>
		</div>
	);
}
