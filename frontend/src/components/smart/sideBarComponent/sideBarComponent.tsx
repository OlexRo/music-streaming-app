//Функциональный компонент
import {
	FC,
	useCallback,
	useMemo
} from 'react';
import cn from 'clsx';
//Cookie
import Cookies from 'js-cookie';
//Работа с запросами
import axios from 'axios';
import { useUserProfile } from '../../../utils/axios/useUserProfile.tsx';
//Интерфейс
import { ISideBarComponent } from './sideBarComponent.interface.ts';
//Объект с данными для sideBarComponent
import { MENU } from './sideBarComponent.data.ts';
//Логотип информационной системы
import { LogoComponent } from '../../ui/logoComponent/logoComponent.tsx';
//React-router
import {
	Link,
	useLocation,
	useNavigate
} from 'react-router-dom';
//Настройка размера экрана
import { useMediaQuery } from 'react-responsive';

export const SideBarComponent: FC<ISideBarComponent> = ({
		setPSDWindowActive,
		onMassage
	}) => {

	//Работа с url-путями
	const locationOn = useLocation();
	//Управление навигацией
	const navigate = useNavigate();
	//Получение данных пользователей
	const profile = useUserProfile();
	//Управление размером экрана
	const isLargeScreen = useMediaQuery({ minWidth: 640 });

	// Функция выхода из аккаунта
	const handleLogout = useCallback(async () => {
		try {
			await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
			localStorage.removeItem('token');
			sessionStorage.removeItem('token');
			Cookies.remove('token'); // Здесь удаляем токен
			navigate('/');
			setPSDWindowActive(true);
			onMassage('Вы вышли из аккаунта');
			setTimeout(() => {
				location.reload();
			}, 1000);
		} catch (error) {
			console.error('Ошибка при выходе из аккаунта:', error);
		}
	}, [navigate, setPSDWindowActive, onMassage]);

	//Вывод элементов из массива
	const menuItems = useMemo(() => {
		return MENU.map(item => {
			if ((item.title === 'ДРУГОЕ' || item.title === 'ПЛЕЙЛИСТ')
				&& profile?.role !== 'user'
				&& profile?.role !== 'admin') {
				return null;
			}
			return (
				<div key={item.id}>
					<h2 className='hidden mt-12 lg:flex'>
						{item.title}
					</h2>
					{item.submenu.map(jtem => {
						if (jtem.title === 'Пользователи' && profile?.role !== 'admin') {
							return null;
						}
						let link = jtem.link;
						let url = jtem.url;
						if (jtem.title === 'Профиль') {
							link = profile?.role === 'user'
								? '/dashboardUser'
								: '/dashboardAdmin';
							url = link;
						}
						return (
							jtem.title === 'Выход' ? (
								<li
									key={jtem.id}
									className={cn({'text-royalBlue': locationOn.pathname === jtem.url})}
									title={jtem.title}
									onClick={handleLogout}
								>
									<jtem.icon
										className='mt-5 lg:mt-0'
										size={isLargeScreen ? 18 : 18}
									/>
									<div className='hidden lg:block'>
										{jtem.title}
									</div>
								</li>
							) : (
								<Link
									key={jtem.id}
									to={link}
								>
									<li
										className={cn({'text-royalBlue': locationOn.pathname === url})}
										title={jtem.title}
									>
										<jtem.icon
											className='mt-5 lg:mt-0'
											size={isLargeScreen ? 18 : 18}
										/>
										<div className='hidden lg:block'>
											{jtem.title}
										</div>
									</li>
								</Link>
							)
						);
					})}
				</div>
			);
		});
	}, [locationOn.pathname, handleLogout, isLargeScreen, profile?.role]);

	return (
		<aside className='w-[70px] h-full pt-11 border-r-[1px] border-[#DCDCDC] bg-blockWhite transition-all lg:w-[250px]'>
			<LogoComponent
				to='/'
				className='justify-center'
				spanClassName='hidden lg:block'
			/>
			<div className='flex flex-col items-center lg:block px-8'>
				{menuItems}
			</div>
		</aside>
	);
};