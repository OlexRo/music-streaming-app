import {
	useEffect,
	useState,
	useCallback
} from 'react';
import axios, { AxiosResponse } from 'axios';

// Интерфейс для Альбома
interface Album {
	id: number;
	title: string;
	date: string;
	description: string;
	photo: string; // Предположим, что поле `photo` приходит в виде URL строки
}

// Кастомный хук для загрузки альбомов
export const useShowAlbum = () => {
	const [albums, setAlbums] = useState<Album[]>([]);
	const [loading1, setLoading] = useState<boolean>(false);
	const [error1, setError] = useState<string | null>(null);

	const fetchAlbum = useCallback(async (controller: AbortController) => {
		setLoading(true);
		setError(null);
		try {
			const response: AxiosResponse<Album[]> = await axios.get('http://localhost:5000/album/all-albums', {
				signal: controller.signal, // Используем AbortController для отмены запроса
			});
			setAlbums(response.data);
		} catch (error) {
			if (axios.isCancel(error)) {
				console.log('Запрос был отменен:', error);
			} else {
				setError('Ошибка при загрузке альбома');
				console.error('Ошибка при загрузке альбома:', error);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		fetchAlbum(controller).catch(error => {
			console.error('Ошибка вывода', error);
		});
		// Периодическое обновление альбомов каждые 5 секунд
		const intervalId = setInterval(() => fetchAlbum(controller), 3000);
		// Очищаем интервал и отменяем запрос при размонтировании
		return () => {
			clearInterval(intervalId);
			controller.abort(); // Отменяем запрос, если компонент размонтирован
		};
	}, [fetchAlbum]);
	return { albums, loading1, error1 };
};