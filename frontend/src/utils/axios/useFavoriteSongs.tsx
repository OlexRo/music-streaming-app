import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFavoriteSongs = () => {
	const [favorites, setFavorites] = useState([]);

	useEffect(() => {
		axios.get('http://localhost:5000/favorite/all-favorites-public')
			.then(response => setFavorites(response.data))
			.catch(error => console.error(error));
	}, []);

	return { favorites };
};

export const useDownloadedSongs = () => {
	const [downloads, setDownloads] = useState([]);

	useEffect(() => {
		axios.get('http://localhost:5000/download/all-download-public')
			.then(response => setDownloads(response.data))
			.catch(error => console.error(error));
	}, []);

	return { downloads };
};