//Функциональный компонент
import {
	useEffect,
	useState
} from 'react';

export const useDisplayedAlbums = (albums: any[]) => {
	//Работа с альбомами
	const [displayedAlbums, setDisplayedAlbums] = useState<any[]>([]);

	useEffect(() => {
		const handleResize = () => {
			const screenWidthAlbum = window.innerWidth;
			let albumsToDisplay;
			if (screenWidthAlbum <= 634) {
				albumsToDisplay = albums.slice(0, 2);
			} else if (screenWidthAlbum <= 629) {
				albumsToDisplay = albums.slice(0, 3);
			} else if (screenWidthAlbum <= 803) {
				albumsToDisplay = albums.slice(0, 3);
			} else if (screenWidthAlbum <= 969) {
				albumsToDisplay = albums.slice(0, 4);
			} else if (screenWidthAlbum <= 1019) {
				albumsToDisplay = albums.slice(0, 5);
			} else if (screenWidthAlbum <= 1029) {
				albumsToDisplay = albums.slice(0, 4);
			} else if (screenWidthAlbum <= 1030) {
				albumsToDisplay = albums.slice(0, 2);
			} else if (screenWidthAlbum <= 1089) {
				albumsToDisplay = albums.slice(0, 4);
			} else if (screenWidthAlbum <= 1345) {
				albumsToDisplay = albums.slice(0, 5);
			} else if (screenWidthAlbum <= 1533) {
				albumsToDisplay = albums.slice(0, 3);
			} else if (screenWidthAlbum <= 1620) {
				albumsToDisplay = albums.slice(0, 3);
			} else if (screenWidthAlbum <= 1760) {
				albumsToDisplay = albums.slice(0, 3);
			} else {
				albumsToDisplay = albums.slice(0, 3);
			}
			setDisplayedAlbums(albumsToDisplay);
		};
		handleResize(); // Вызываем сразу при монтировании
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [albums]);
	return displayedAlbums;
};