interface AvatarProps {
	src: string;
	alt: string;
	size: 8 | 10 | 12 | 16 | 20 | 24 | 32;
	rounded?: boolean;
}

const sizeClasses = {
	8: "w-8 h-8",
	10: "w-10 h-10",
	12: "w-12 h-12",
	16: "w-16 h-16",
	20: "w-20 h-20",
	24: "w-24 h-24",
	32: "w-32 h-32",
};

export default function Avatar({ src, alt, size, rounded = true }: AvatarProps) {
	const defaultAvatarUrl = // TODO: ここ意味わからないから後で変更
		"https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

	return (
		<div className={`${sizeClasses[size]} ${rounded ? "rounded-full" : "rounded-md"} overflow-hidden`}>
			<img
				src={src || defaultAvatarUrl}
				alt={alt}
				className="w-full h-full object-cover"
				onError={(e) => {
					const target = e.target as HTMLImageElement;
					target.src = defaultAvatarUrl;
				}}
			/>
		</div>
	);
}
