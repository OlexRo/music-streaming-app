//Функциональный компонент
import {
	useEffect,
	useState,
	useCallback
} from 'react';
//Работа с запросами
import axios, { AxiosResponse, AxiosError } from 'axios';

// Интерфейс для Пользователя
interface User {
	id: number;
	login: string;
	name: string;
	surname: string;
	role: string;
	photo: string;
	date: string;
	status: string;
}

// Кастомный хук для загрузки пользователей
export const useShowAllUser = () => {

	//Анимация загрузка
	const [loading, setLoading] = useState<boolean>(false);
	//Работа с пользователем
	const [users, setUsers] = useState<User[]>([]);
	//Состояние ошибок
	const [error, setError] = useState<string | null>(null);

	const fetchUsers = useCallback(async (controller: AbortController) => {
		setLoading(true);
		setError(null);
		try {
			const response: AxiosResponse<User[]> = await axios.get<User[]>('http://localhost:5000/user/all-user', {
				signal: controller.signal, // Используем AbortController для отмены запроса
			});
			setUsers(response.data);
		} catch (error) {
			const axiosError = error as AxiosError; // Приведение типа
			if (axios.isCancel(axiosError)) {
				console.log('Запрос был отменен:', error);
			} else {
				setError('Ошибка при загрузке пользователей');
				console.error('Ошибка при загрузке пользователей:', error);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		fetchUsers(controller).catch(error => {
			console.error('Ошибка вывода', error);
		});
		// Периодическое обновление пользователей каждые 5 секунд
		const intervalId = setInterval(() => fetchUsers(controller), 3000);
		// Очищаем интервал и отменяем запрос при размонтировании
		return () => {
			clearInterval(intervalId);
			controller.abort(); // Отменяем запрос, если компонент размонтирован
		};
	}, [fetchUsers]);

	return { users, loading, error };
};