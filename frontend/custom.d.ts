// Декларация для SVG файлов
declare module '*.svg' {
	const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
	export default content;
}

// Декларация для JPG файлов
declare module '*.jpg' {
	const value: string;
	export default value;
}

// Декларация для PNG файлов
declare module '*.png' {
	const value: string;
	export default value;
}

// Декларация для MP3 файлов
declare module '*.mp3' {
	const value: string;
	export default value;
}