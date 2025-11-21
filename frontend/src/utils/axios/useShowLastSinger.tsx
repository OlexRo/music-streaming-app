//Кастомный хук для получение данных из singer/last-singers
import {
	useEffect,
	useState
} from 'react';
//Работа с запросами
import axios from 'axios';

//Интерфейс для Певца
interface Singer {
	id: number;
	name: string;
	dateLive: string;
	country: string;
	photo: FileList;
}

export const useShowLastSinger = () => {
	const [lastSingers, setSingers] = useState<Singer[]>([]);
	const [error, setError] = useState<string | null>(null);

	const fetchSingers = async () => {
		try {
			const response = await axios.get<Singer[]>('http://localhost:5000/singer/last-singers');
			setSingers(response.data);
			setError(null); // Сброс ошибки при успешном запросе
		} catch (err) {
			setError('Ошибка при загрузке певцов');
			console.error('Ошибка при загрузке певцов:', err);
		}
	};

	useEffect(() => {
		fetchSingers().catch(error => {
			console.error('Ошибка вывода', error);
		});
		// Периодическая загрузка певцов
		const intervalId = setInterval(fetchSingers, 3000);
		return () => clearInterval(intervalId); // Очистка интервала при размонтировании
	}, []);
	return { lastSingers, error };
};