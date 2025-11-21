//Кастомный хук для получение данных из song/all-song
import {
	useEffect,
	useState
} from 'react';
//Работа с запросами
import axios from 'axios';

// Интерфейс для Песни
interface Song {
	id: number;
	title: string;
	date: string;
	songFile: string;
	photo: FileList;
	albumId: string;
}

export const useShowSong = () => {
	const [song, setSong] = useState<Song[]>([]);
	useEffect(() => {
		const fetchSingers = async () => {
			try {
				const response = await axios.get('http://localhost:5000/song/all-song');
				setSong(response.data);
			} catch (error) {
				console.error('Ошибка при загрузке песен:', error);
			}
		};
		fetchSingers().catch(error => {
			console.error('Ошибка, попробуйте еще раз', error);
		});
	}, []);
	return song;
};