export default function CloseButton({ onClick }: { onClick: () => void }) {
	return (
		<button
			className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer"
			onClick={onClick}
		>
			<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	);
}
