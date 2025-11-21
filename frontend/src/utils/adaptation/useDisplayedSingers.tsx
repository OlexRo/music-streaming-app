//Функциональный компонент
import {
	useEffect,
	useState
} from 'react';

export const useDisplayedSingers = (lastSingers: any[]) => {
	//Работа с певцами
	const [displayedSingers, setDisplayedSingers] = useState<any[]>([]);

	useEffect(() => {
		const handleResize = () => {
			const screenWidth = window.innerWidth;
			let singers;
			if (screenWidth <= 450) {
				singers = lastSingers.slice(0, 2);
			} else if (screenWidth <= 600) {
				singers = lastSingers.slice(0, 3);
			} else if (screenWidth <= 800) {
				singers = lastSingers.slice(0, 4);
			} else if (screenWidth <= 900) {
				singers = lastSingers.slice(0, 5);
			} else if (screenWidth <= 1140) {
				singers = lastSingers.slice(0, 6);
			} else if (screenWidth <= 1300) {
				singers = lastSingers.slice(0, 7);
			} else if (screenWidth <= 1398) {
				singers = lastSingers.slice(0, 8);
			} else if (screenWidth <= 1535) {
				singers = lastSingers.slice(0, 9);
			} else if (screenWidth <= 1791) {
				singers = lastSingers.slice(0, 5);
			} else {
				singers = lastSingers.slice(0, 6);
			}
			setDisplayedSingers(singers);
		};
		handleResize(); // Вызываем сразу при монтировании
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [lastSingers]);
	return displayedSingers;
};