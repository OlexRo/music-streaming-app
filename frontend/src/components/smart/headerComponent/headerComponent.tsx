//Функциональный компонент
import {
	FC,
	useCallback,
	useState
} from 'react';
//Работа с запросами
import { useUserProfile } from '../../../utils/axios/useUserProfile.tsx';
//Массив с данными
import { MENU } from '../sideBarComponent/sideBarComponent.data.ts';
//Интерфейс
import { IHeader } from './headerComponent.interface.ts';
//React-router
import { Link } from 'react-router-dom';
//React-icons
import { FaUserCircle } from 'react-icons/fa';
//React-components
import { HeaderControlComponent } from '../../simple/headerControlComponent.tsx';
import { DashboardUserComponent } from '../dashboardUserComponent.tsx';
import { ProfileComponent } from '../../auth/client/profileComponent/profileComponent.tsx';
import { ButtonComponent } from '../../ui/buttonComponent/buttonComponent.tsx';
import { ModalComponent } from '../../modal/modalComponent/modalComponent.tsx';
import { UpdateUserForm } from '../../auth/form/update/updateUserComponent/UpdateUserComponent.tsx';

export const HeaderComponent: FC<IHeader> = ({
		setModalActive,
		searcControl
	}) => {

	//Получение данных пользователя
	const profile = useUserProfile();

	//Функция для получения названия текущей страницы из MENU
	const getPageTitle = () => {
		const path = window.location.pathname;
		for (const item of MENU) {
			for (const submenuItem of item.submenu) {
				// Проверка на точное совпадение URL или если это страница альбома
				if (path === submenuItem.url) {
					return submenuItem.title;
				} else if (path.match(/^\/albumPage\/\d+$/)) {
					return 'Альбом';
				}
				else if (path.match(/^\/categoryPage\/\d+$/)) {
					return 'Категория';
				}
				else if (path.match(/^\/singer\/\d+$/)) {
					return 'Певцы';
				}
			}
		}
		return 'Главная';
	};

	//Работа с модальным окном с данными пользователя
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	//Работа с модальным окном с данными пользователя
	const [isEditModalOpen2, setEditModalOpen2] = useState(false);

	//Функция для открытия окна для редактирования
	const openEditModal = useCallback(() => {
		setEditModalOpen(true);
	}, []);

	//Функция для открытия окна с данными пользователя
	const openEditModal2 = useCallback(() => {
		setEditModalOpen2(true);
	}, []);

	return (
		<>
			<header className='px-8 h-[75px] w-full flex items-end xl:px-16'>
				<div className='w-full flex items-center justify-between'>
					{/* Название текущей страницы */}
					<h1 className='text-royalBlue text-xl'>
						{getPageTitle()}
					</h1>
					{/* Правая панель управления */}
					<div className='gap-5 xl:gap-9 flex items-center transition-all'>
						{/* Компонент поиска */}
						{searcControl}
						{/* Компонент управления заголовком */}
						<HeaderControlComponent />
						{/* Блок профиля пользователя */}
						<div className='flex items-center'>
							{profile ? (
								<div className='flex items-center gap-3 cursor-pointer'>
									{profile.role === 'user' ? (
										<div
											onClick={openEditModal}
											className='flex items-center gap-3'
										>
											<img
												src={profile.photo
													? `http://localhost:5000/uploads/imageUser/${profile.photo}`
													: 'path_to_default_image'
												}
												alt='Личный кабинет'
												title='Личный кабинет'
												className='w-[30px] h-[30px] border rounded-full transition-all duration-200 hover:scale-105'
											/>
											<span className='hidden xl:block'>
												<h1>
													{profile.login}
												</h1>
											</span>
										</div>
									) : (
										<Link
											to='/dashboardAdmin'
											title='Личный кабинет'
											className='flex items-center gap-3'
										>
											<img
												src={profile.photo
													? `http://localhost:5000/uploads/imageUser/${profile.photo}`
													: 'path_to_default_image_admin'
												}
												alt='Админ кабинет'
												title='Админ кабинет'
												className='w-[35px] h-[35px] border rounded-full transition-all duration-200 hover:scale-105'
											/>
											<span className='hidden xl:block'>
												<h1>
													{profile.login}
												</h1>
											</span>
										</Link>
									)}
								</div>
							) : (
								// Кнопка для открытия модального окна регистрации/авторизации
								<div>
									<button
										type='button'
										onClick={() => setModalActive(true)}>
										<FaUserCircle
											size={30}
											className='text-royalBlue transition-all duration-300 cursor-pointer hover:scale-105'
										/>
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>
			{/*Окно с профилем пользователя*/}
			<DashboardUserComponent
				active={isEditModalOpen}
				setActive={setEditModalOpen}
				className='border-royalBlue mt-0'
				classNameModal='fixed top-[75px] right-0 z-50 px-10'
			>
				<ProfileComponent
					className='flex flex-col justify-center items-center'
					className2='flex items-center gap-2'
				>
					{/*Кнопка для изменения аккаунта*/}
					<ButtonComponent
						className='border-royalBlue w-[200px] my-2'
						onClick={openEditModal2}
					>
						Изменить аккаунт
					</ButtonComponent>
					{/*Кнопка для удаления аккаунта*/}
					<ButtonComponent className='border-royalBlue w-[200px]'>
						Удалить аккаунт
					</ButtonComponent>
				</ProfileComponent>
			</DashboardUserComponent>
			{/*Окно для изменения данных пользователя*/}
			{isEditModalOpen && (
				<ModalComponent
					active={isEditModalOpen2}
					setActive={setEditModalOpen2}
					className='absolute border-royalBlue mb-[10px] mt-[10px]'
				>
					<UpdateUserForm/>
				</ModalComponent>
			)}
		</>
	);
};