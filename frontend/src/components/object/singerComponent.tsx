//Функциональный компонент
import {
	FC,
	useState,
	useCallback,
	useMemo
} from 'react';
//Работа с запросами
import axios from 'axios';
import { useUserProfile } from '../../utils/axios/useUserProfile.tsx';
//React-Cookie
import Cookies from 'js-cookie';
//React-icons
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
//React-components
import { PSDWindowComponent } from '../modal/PSDWindowComponent/PSDWindowComponent.tsx';
import { ButtonComponent } from '../ui/buttonComponent/buttonComponent.tsx';
import { ModalComponent } from '../modal/modalComponent/modalComponent.tsx';
import { UpdateSingerForm } from '../auth/form/update/updateSingerComponent/UpdateSingerComponent.tsx';

//Интерфейс для SingerComponent
interface ISingerComponent {
	id: number;
	src: string;
	singer: string;
	onClick?: () => void;
	className?: string;
}

export const SingerComponent: FC<ISingerComponent> = ({
		id,
		src,
		singer,
		onClick,
		className
	}) => {

	//Получение данных профиля пользователя для проверки его роли (например, админ)
	const profile = useUserProfile();
	//Состояние для открытия модального окна редактирования
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	//Состояние для подтверждения удаления певца
	const [confirmDelete, setConfirmDelete] = useState(false);

	//Функция для удаления певца по его ID
	const deleteSinger = useCallback(async () => {
		//Получаем токен из cookie
		const token = Cookies.get('token');
		if (!token || !id) return;
		try {
			await axios.delete(`http://localhost:5000/singer/delete-singer/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		} catch (error) {
			console.error('Ошибка при удалении певца:', error);
		}
	}, [id]);

	//Открытие окна подтверждения удаления
	const openDeleteConfirmation = useCallback(() => setConfirmDelete(true), []);

	//Обработка подтверждения удаления и вызов функции удаления
	const handleDeleteConfirmation = useCallback(async () => {
		await deleteSinger();
		setConfirmDelete(false); // Закрытие окна после удаления
	}, [deleteSinger]);

	//Открытие модального окна для редактирования
	const openEditModal = useCallback(() => setEditModalOpen(true), []);

	//Отмена удаления и закрытие окна подтверждения
	const cancelDelete = useCallback(() => setConfirmDelete(false), []);

	//Использование useMemo для оптимизации стилей
	const singerName = useMemo(() => (
		<span className='inline-block overflow-hidden text-ellipsis whitespace-nowrap'>
			{singer}
		</span>
	), [singer]);

	return (
		<div className={className}>
			{/* Окно для подтверждения удаления певца */}
			<PSDWindowComponent
				active={confirmDelete}
				setActive={setConfirmDelete}
				message='Вы уверены, что хотите удалить этого певца?'
				type='error' // Тип сообщения (ошибка)
				actions={
					<div className='mt-5 flex gap-5 justify-between items-center'>
						{/* Кнопка подтверждения удаления */}
						<ButtonComponent
							onClick={handleDeleteConfirmation}
							className='w-[50%] border-royalBlue'
						>
							Удалить
						</ButtonComponent>
						{/* Кнопка отмены удаления */}
						<ButtonComponent
							onClick={cancelDelete}
							className='w-[50%] border-royalBlue'
						>
							Отмена
						</ButtonComponent>
					</div>
				}
			/>
			<div
				onClick={onClick}
				className='flex items-center gap-5 w-[130px] sm:w-[350px]'
				title={singer}
			>
				<img
					src={src}
					alt={singer}
					className='w-[70px] h-[70px] rounded-full object-cover'
				/>
				<span className='flex items-center'>
					<span className='w-[180px] hidden md:flex'>
						{singerName}
					</span>
					{/* Панель управления для админа (кнопки редактирования и удаления) */}
					{profile?.role === 'admin' && (
						<div className=''>
							<div className='p-1 rounded-br-none flex gap-3 flex-col md:flex-row justify-center items-center'>
								{/* Кнопка редактирования певца */}
								<button
									onClick={openEditModal}
									className='scale-1 transition-all duration-400 hover:scale-110'
								>
									<MdModeEditOutline
										size={22}
										color='#1B89D3'
									/>
								</button>
								{/* Кнопка удаления певца */}
								<button
									onClick={openDeleteConfirmation}
									className='scale-1 transition-all duration-400 hover:scale-110'
								>
									<MdDelete
										size={22}
										color='#1B89D3'
									/>
								</button>
							</div>
						</div>
					)}
				</span>
			</div>
			{/* Модальное окно для редактирования певца */}
			<ModalComponent
				active={isEditModalOpen}
				setActive={setEditModalOpen}
				className='hidden my2xl:flex h-auto w-[50%] object-cover rounded-[10px]'
			>
				{/* Форма обновления данных певца */}
				<UpdateSingerForm id={id} />
			</ModalComponent>
		</div>
	);
};
