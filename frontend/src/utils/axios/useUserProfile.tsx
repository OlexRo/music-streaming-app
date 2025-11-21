import {
	useState,
	useEffect
} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

// Интерфейс для Профиля Пользователя
interface IProfile {
	id: number,
	login: string,
	name: string,
	surname: string,
	role: string,
	date: string,
	photo: string,
	status: string
}

export const useUserProfile = () => {
	const [profile, setProfile] = useState<IProfile | null>(null);
	const location = useLocation();

	const fetchProfile = async () => {
		try {
			//Получаем токен из cookie
			const token = Cookies.get('token');
			if (!token) return;
			//Запрос профиля пользователя с использованием токена
			const response = await axios.get<IProfile>('http://localhost:5000/user/profile', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const newToken = Cookies.get('jwt');
			//Проверяем, изменился ли токен
			if (newToken && newToken !== token) {
				Cookies.set('token', newToken, {
					expires: 7,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					path: '/',
				});
			}
			setProfile(response.data);
		} catch (err) {
			console.error('Ошибка при получении профиля:', err);
		}
	};

	useEffect(() => {
		fetchProfile();
		// Периодическая проверка обновлений профиля
		const intervalId = setInterval(fetchProfile, 3000);
		return () => clearInterval(intervalId); // Очистка интервала при размонтировании
	}, [location]);

	return profile;
};