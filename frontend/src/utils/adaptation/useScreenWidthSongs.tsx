//Функциональный компонент
import {
	useEffect,
	useState
} from 'react';

export const useDisplayedSongs = (songs: any[]) => {
	//Работа с песнями
	const [displayedSongs, setDisplayedSongs] = useState<any[]>([]);

	useEffect(() => {
		const handleResize = () => {
			const screenWidthSongs = window.innerWidth;
			let songsToDisplay;
			if (screenWidthSongs <= 600) {
				songsToDisplay = songs.slice(0, 2);
			} else if (screenWidthSongs <= 654) {
				songsToDisplay = songs.slice(0, 3);
			} else if (screenWidthSongs <= 812) {
				songsToDisplay = songs.slice(0, 4);
			} else if (screenWidthSongs <= 1360) {
				songsToDisplay = songs.slice(0, 5);
			} else if (screenWidthSongs <= 1535) {
				songsToDisplay = songs.slice(0, 6);
			} else if (screenWidthSongs <= 1621) {
				songsToDisplay = songs.slice(0, 4);
			} else {
				songsToDisplay = songs.slice(0, 5);
			}
			setDisplayedSongs(songsToDisplay);
		};
		handleResize(); // Вызываем сразу при монтировании
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [songs]);
	return displayedSongs;
};