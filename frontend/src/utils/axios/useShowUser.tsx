//Кастомный хук для получение данных из user/all-user
import {
	useEffect,
	useState
} from 'react';
//Работа с запросами
import axios from 'axios';

// Интерфейс для useShowUser
interface User {
	id: number;
	login: string;
	name: string;
	surname: string;
	date: string
	photo: FileList;
}

export const useShowUser = () => {
	const [user, setUser] = useState<User[]>([]);
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get('http://localhost:5000/user/all-user');
				setUser(response.data);
			} catch (error) {
				console.error('Ошибка при загрузке пользователей:', error);
			}
		};
		fetchUsers().catch(error => {
			console.error('Ошибка, попробуйте еще раз', error);
		});
		// Периодическая загрузка пользователей
		const intervalId = setInterval(fetchUsers, 3000);
		return () => clearInterval(intervalId); // Очистка интервала при размонтировании
	}, []);
	return user;
};