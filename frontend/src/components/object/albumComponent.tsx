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
//React-icons
import {
	MdDelete,
	MdModeEditOutline
} from 'react-icons/md';
//React-components
import { ModalComponent } from '../modal/modalComponent/modalComponent.tsx';
import { UpdateAlbumForm } from '../auth/form/update/updateAlbumComponent/UpdateAlbumComponent.tsx';
import { PSDWindowComponent } from '../modal/PSDWindowComponent/PSDWindowComponent.tsx';
import { ButtonComponent } from '../ui/buttonComponent/buttonComponent.tsx';
import Cookies from 'js-cookie';

//Интерфейс для AlbumComponent
interface IAlbumComponent {
	id?: number;
	onClick?: () => void;
	title?: string;
	singer?: string;
	photo?: string;
	className?: string;
}

export const AlbumComponent: FC<IAlbumComponent> = ({
		id,
		onClick,
		title,
		singer,
		photo,
		className
	}) => {

	//Получение данных пользователя
	const profile = useUserProfile();
	//Управление модальным окном для редактирования
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	//Управление модальным окном для удаления
	const [confirmDelete, setConfirmDelete] = useState(false);

	//Функция для удаления альбома по его ID
	const deleteAlbum = useCallback(async () => {
		if (!id) return;
		//Получаем токен из cookie
		const token = Cookies.get('token');
		if (!token) return;
		try {
			await axios.delete(`http://localhost:5000/album/delete-albumPage/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
		} catch (error) {
			console.error('Ошибка при удалении альбома:', error);
		}
	}, [id]);

	//Открытие модального окна редактирования альбома
	const openEditModal = useCallback(() => setEditModalOpen(true), []);

	//Открытие окна подтверждения удаления
	const openDeleteConfirmation = useCallback(() => setConfirmDelete(true), []);

	//Обработка подтверждения удаления
	const handleDeleteConfirmation = useCallback(async () => {
		await deleteAlbum();
		setConfirmDelete(false); // Закрытие окна после удаления
	}, [deleteAlbum]);

	//Отмена удаления
	const cancelDelete = useCallback(() => setConfirmDelete(false), []);

	//Использование useMemo для оптимизации стилей
	const albumStyle = useMemo(() => ({
		backgroundImage: `url(${photo})`,
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center'
	}), [photo]);

	return (
		<div
			className={`custom-adp custom-shadow rounded-[10px] cursor-pointer custom-grad ${className}`}
			style={albumStyle}
		>
			<div className='custom-adp flex flex-col items-center rounded-[10px] custom-grand text-blockWhite'>
				{/* Окно для подтверждения удаления альбома */}
				<PSDWindowComponent
					active={confirmDelete}
					setActive={setConfirmDelete}
					message='Вы уверены, что хотите удалить этот альбом?'
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
				{/* Панель управления для админа (кнопки редактирования и удаления) */}
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
				{/* Информация об альбоме */}
				<div
					className='flex flex-col justify-center items-center w-full'
					onClick={onClick}
				>
					<span className='mt-5 sm:mt-12 w-[80px] sm:w-[125px] text-sm sm:text-xl text-center inline-block overflow-hidden text-ellipsis whitespace-nowrap'>
						{title}
					</span>
					<span className='text-sm text-borderBlock mt-2 w-[80px] sm:w-[125px] text-center inline-block overflow-hidden text-ellipsis whitespace-nowrap'>
						{singer}
					</span>
				</div>
			</div>
			{/* Модальное окно для редактирования альбома */}
			<ModalComponent
				active={isEditModalOpen}
				setActive={setEditModalOpen}
				className='hidden my2xl:flex h-auto w-[50%] object-cover rounded-[10px]'
			>
				<UpdateAlbumForm albumId={id} />
			</ModalComponent>
		</div>
	);
};

