// Функциональный компонент
import {
	FC,
	useState,
	useCallback,
	useMemo
} from 'react';
//React-Cookie
import Cookies from 'js-cookie';
// Работа с запросами
import axios from 'axios';
import { useUserProfile } from '../../utils/axios/useUserProfile.tsx';
// React-icons
import {
	MdDelete,
	MdModeEditOutline
} from 'react-icons/md';
// React-components
import { ButtonComponent } from '../ui/buttonComponent/buttonComponent.tsx';
import { PSDWindowComponent } from '../modal/PSDWindowComponent/PSDWindowComponent.tsx';
import { ModalComponent } from '../modal/modalComponent/modalComponent.tsx';
import { UpdateCategoryForm } from '../auth/form/update/updateCategoryComponent/UpdateCategoryComponent.tsx';

// Интерфейс для CategoryComponent
interface ICategoryComponent {
	id: number;
	onClick?: () => void;
	title?: string;
	photo?: string;
	className?: string;
}

// Компонент для отображения категории
export const CategoryComponent: FC<ICategoryComponent> = ({
		id,
		onClick,
		photo,
		className,
	}) => {

	//Получение данных профиля пользователя
	const profile = useUserProfile();
	//Управление модальным окном для редактирования
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	//Управление модальным окном для удаления
	const [confirmDelete, setConfirmDelete] = useState(false);

	//Функция для удаления категории
	const deleteCategory = useCallback(async () => {
		//Получаем токен из cookie
		const token = Cookies.get('token');
		if (!token || !id) return; // Проверка на наличие токена и ID категории
		try {
			await axios.delete(`http://localhost:5000/category/delete-category/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		} catch (error) {
			console.error('Ошибка при удалении категории:', error);
		}
	}, [id]);

	//Функция для открытия модального окна редактирования
	const openEditModal = useCallback(() => setEditModalOpen(true), []);

	//Функция для открытия окна подтверждения удаления
	const openDeleteConfirmation = useCallback(() => setConfirmDelete(true), []);

	//Функция для подтверждения удаления
	const handleDeleteConfirmation = useCallback(async () => {
		await deleteCategory(); // Удаление категории
		setConfirmDelete(false); // Закрытие окна подтверждения
	}, [deleteCategory]);

	//Функция для отмены удаления
	const cancelDelete = useCallback(() => setConfirmDelete(false), []);

	//Использование useMemo для оптимизации стилей
	const categoryStyle = useMemo(() => ({
		backgroundImage: `url(${photo})`,
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
	}), [photo]);

	return (
		<div
			className={`custom-adp custom-shadow rounded-[10px] cursor-pointer ${className}`}
			style={categoryStyle}
		>
			<div className='custom-adp flex flex-col items-center rounded-[10px] text-blockWhite'>
				{/* Окно подтверждения действия */}
				<PSDWindowComponent
					active={confirmDelete}
					setActive={setConfirmDelete}
					message='Вы уверены, что хотите удалить эту категорию?'
					type='error'
					actions={
						<div className='mt-5 flex gap-5 justify-between items-center'>
							<ButtonComponent
								onClick={handleDeleteConfirmation}
								className='w-[50%] border-royalBlue'
							>
								Удалить
							</ButtonComponent>
							<ButtonComponent
								onClick={cancelDelete}
								className='w-[50%] border-royalBlue'
							>
								Отмена
							</ButtonComponent>
						</div>
					}
				/>
				{/* Панель управления для администратора */}
				{profile?.role === 'admin' && (
					<div className='w-full flex justify-end items-start'>
						<div className='bg-testRoyalBlue p-1 rounded-[10px] rounded-br-none flex gap-3 justify-center items-center'>
							<button
								onClick={openEditModal}
								className='scale-1 transition-all duration-400 hover:scale-110'
							>
								<MdModeEditOutline size={22} />
							</button>
							<button
								onClick={openDeleteConfirmation}
								className='scale-1 transition-all duration-400 hover:scale-110'
							>
								<MdDelete size={22} />
							</button>
						</div>
					</div>
				)}
				<div
					className='flex flex-col justify-center items-center w-full'
					onClick={onClick}
				>
					<span className='h-[100px] m-12 w-[125px] text-xl text-center inline-block overflow-hidden text-ellipsis whitespace-nowrap'>
						{/*{title}*/}
					</span>
				</div>
			</div>
			{/* Модальное окно редактирования категории */}
			<ModalComponent
				active={isEditModalOpen}
				setActive={setEditModalOpen}
				className='hidden my2xl:flex h-auto w-[50%] object-cover rounded-[10px]'
			>
				<UpdateCategoryForm categoryId={id} />
			</ModalComponent>
		</div>
	);
};