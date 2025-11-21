//Кастомный хук для получение данных из category/all-categories
import {
	useEffect,
	useState
} from 'react';
//Работа с запросами
import axios from 'axios';

// Интерфейс для Категории
interface ICategory {
	id: number;
	title: string;
	description: string;
	photo: FileList;
}

export const useShowCategory = () => {
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [error, setError] = useState<string | null>(null);

	const fetchCategory = async () => {
		try {
			const response = await axios.get('http://localhost:5000/category/all-categories');
			setCategories(response.data);
			setError(null); // Сброс ошибки при успешном запросе
		} catch (err) {
			setError('Ошибка при загрузке категорий');
			console.error('Ошибка при загрузке категорий:', err);
		}
	};

	useEffect(() => {
		fetchCategory();

		// Периодическая загрузка категорий
		const intervalId = setInterval(fetchCategory, 3000);
		return () => clearInterval(intervalId); // Очистка интервала при размонтировании
	}, []);

	return { categories, error };
};