//Функциональный компонент
import {
	FC,
	useEffect,
	useState,
	useCallback,
	useMemo
} from 'react';
//Cookies
import Cookies from 'js-cookie';
//Работа с запросами
import axios from 'axios';
import { useUserProfile } from '../../../utils/axios/useUserProfile.tsx';
//Интерфейс
import {IMusicComponent} from './musicComponent.interface.ts';
//React-icons
import {
	MdDelete,
	MdFavorite,
	MdFavoriteBorder,
	MdModeEditOutline
} from 'react-icons/md';
import {
	RiFolderDownloadFill,
	RiFolderDownloadLine
} from 'react-icons/ri';
import { BsThreeDotsVertical} from 'react-icons/bs';
//React-component
import { Modal } from '../../modal/musicModalWindow.tsx';
import { ModalComponent } from '../../modal/modalComponent/modalComponent.tsx';
import { UpdateSongForm } from '../../auth/form/update/updateSongComponent/UpdateSongComponent.tsx';
import { PSDWindowComponent } from '../../modal/PSDWindowComponent/PSDWindowComponent.tsx';
import { ButtonComponent } from '../../ui/buttonComponent/buttonComponent.tsx';

export const MusicComponent: FC<IMusicComponent> = ({
		index,
		src,
		title,
		singer,
		category,
		album,
		songId,
		userId,
		onClick,
		modal,
		duration
	}) => {

	//Получение данных профиля
	const profile = useUserProfile();
	//Работа с избранным
	const [isFavorites, setFavorites] = useState(false);
	//Работа со скачиванием
	const [isDownload, setDownload] = useState(false);
	//Открытие модального окна для редактирования и удаления
	const [isModalOpen, setModalOpen] = useState(false);
	//Оптимизация для модального окна
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	//Управление модальным окном для удаления
	const [confirmDelete, setConfirmDelete] = useState(false);

	//Получение статуса избранного
	useEffect(() => {
		const fetchFavoriteStatus = async () => {
			try {
				//Получаем токен из cookie
				const token = Cookies.get('token');
				if (!token || !songId) return;
				const response = await axios.get<{ flag: number }>('http://localhost:5000/favorite/status', {
					headers: { Authorization: `Bearer ${token}` },
					params: { songId },
				});
				setFavorites(response.data.flag === 1);
			} catch (error) {
				console.error('Error fetching favorite status:', error);
			}
		};
		fetchFavoriteStatus().catch(error => {
			console.error('Ошибка вывода', error);
		});
	}, [songId]);

	//Получение статуса скаченного
	useEffect(() => {
		const fetchDownloadStatus = async () => {
			try {
				//Получаем токен из cookie
				const token = Cookies.get('token');
				if (!token || !songId) return;
				const response = await axios.get<{ flag: number }>('http://localhost:5000/download/get-status-download', {
					headers: { Authorization: `Bearer ${token}` },
					params: { songId },
				});
				setDownload(response.data.flag === 1);
			} catch (error) {
				console.error('Ошибка при выборе статуса избранного:', error);
			}
		};
		fetchDownloadStatus().catch(error => {
			console.error('Ошибка вывода', error);
		});
	}, [songId]);

	//Функция для переключения статуса скаченного
	const toggleDownload = useCallback(async () => {
		try {
			const token = Cookies.get('token');
			if (!token) return;
			const url = 'http://localhost:5000/download/create-download'; // Только добавление в скачивание
			await axios.post(url, { songId, userId, flag: 1 }, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setDownload(true); // Обновляем статус на скачанный
		} catch (error) {
			console.error('Error toggling download status:', error);
		}
	}, [songId, userId]);

	//Функция для переключения статуса избранного
	const toggleFavorites = useCallback(async () => {
		try {
			//Получаем токен из cookie
			const token = Cookies.get('token');
			if (!token) return;
			const url = isFavorites
				? 'http://localhost:5000/favorite/remove-favorite'
				: 'http://localhost:5000/favorite/create-favorite';
			await axios.post(url, { songId, userId, flag: isFavorites ? 0 : 1 }, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setFavorites(prev => !prev);
		} catch (error) {
			console.error('Error toggling favorite status:', error);
		}
	}, [isFavorites, songId, userId]);

	//Функция для удаления песни
	const deleteSong = useCallback(async () => {
		try {
			//Получаем токен из cookie
			const token = Cookies.get('token');
			if (!token || !songId) return;
			await axios.delete(`http://localhost:5000/song/delete-song/${songId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
		} catch (error) {
			console.error('Ошибка при удалении песни:', error);
		}
	}, [songId]);

	//Функция для переключения модального окна
	const toggleModal = useCallback(() => {
		setModalOpen(prev => !prev);
	}, []);

	//Функция для открытия окна редактирования
	const openEditModal = useCallback(() => {
		setEditModalOpen(true);
	}, []);

	//Функция для подтверждения удаления песни
	const handleDeleteConfirmation = useCallback(async () => {
		await deleteSong();
		setConfirmDelete(false);
	}, [deleteSong]);

	//Иконка избранного загрузки
	const favoriteIcon = useMemo(() => (
		<button onClick={toggleFavorites}>
			{isFavorites
				? <MdFavorite size={22} color='#1B89D3' />
				: <MdFavoriteBorder size={22} />
			}
		</button>
	), [isFavorites, toggleFavorites]);


	const handleDownload = useCallback(async () => {
		try {
			const token = Cookies.get('token');
			if (!token || !songId) return;
			const response = await axios({
				url: `http://localhost:5000/song/${songId}`,
				method: 'GET',
				responseType: 'blob', // Указываем, что ожидаем бинарные данные
				headers: { Authorization: `Bearer ${token}` },
			});
			// Проверяем, что мы получили файл
			if (response.status === 200) {
				// Создание ссылки для скачивания
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', `${title}.mp3`);
				document.body.appendChild(link);
				link.click();
				link.remove();
				window.URL.revokeObjectURL(url); // Освобождаем память
			} else {
				console.error('Ошибка при скачивании: ', response);
			}
		} catch (error) {
			console.error('Ошибка при скачивании песни:', error);
		}
	}, [songId, title]);

	// Промежуточная функция для вызова двух функций
	const handleClick = useCallback(() => {
		//Переключаем статус скачивания
		toggleDownload().catch(error => {
			console.error('Произошла ошибка', error);
		});
		//Начинаем скачивание
		handleDownload().catch(error => {
			console.error('Произошла ошибка', error);
		});
	}, [toggleDownload, handleDownload]);

	// Иконка загрузки
	const downloadIcon = useMemo(() => (
		<button onClick={handleClick}>
			{isDownload
				? <RiFolderDownloadFill
					size={22}
					color='#1B89D3'
				/>
				: <RiFolderDownloadLine size={22} />}
		</button>
	), [isDownload, handleClick]);

	const adminActions = useMemo(() => (
		profile?.role === 'admin' && (
			<span className='relative flex h-auto w-auto'>
				<button onClick={toggleModal}>
					<BsThreeDotsVertical size={22} />
				</button>
				{isModalOpen && (
					<Modal
						isOpen={isModalOpen}
						onClose={toggleModal}
					>
						<button
							onClick={openEditModal}
							className='scale-1 transition-all duration-400 hover:scale-110'
						>
							<MdModeEditOutline size={22} />
						</button>
						<button
							onClick={() => setConfirmDelete(true)}
							className='scale-1 transition-all duration-400 hover:scale-110'
						>
							<MdDelete size={22} />
						</button>
						{modal}
					</Modal>
				)}
			</span>
		)
	), [profile, toggleModal, isModalOpen]);

	//Данные о музыке
	const MUSIC_DATA = useMemo(() => [
		{ id: '1', title: `${title}` },
		{ id: '2', title: `${album}` },
		{ id: '3', title: `${singer}` },
		{ id: '4', title: `${category}` }
	], [title, album, singer, category]);

	return (
		<div className='flex'>
			<PSDWindowComponent
				active={confirmDelete}
				setActive={setConfirmDelete}
				message='Вы уверены, что хотите удалить эту песню?'
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
							onClick={() => setConfirmDelete(false)}
							className='w-[50%] border-royalBlue'
						>
							Отмена
						</ButtonComponent>
					</div>
				}
			/>
			<div
				className='flex justify-center w-full'
				onClick={onClick}
			>
				<div className='flex items-center gap-2'>
					<span className='w-[20px] hidden smLitle:flex'>
						{index}
					</span>
					<span className='w-[48px] flex justify-center items-center'>
						<img
							src={src}
							alt={title}
							title={title}
							className='w-[48px] h-[48px] object-cover rounded-[10px] custom-shadow'
						/>
					</span>
				</div>
				<div className='w-full flex justify-around items-center'>
					{MUSIC_DATA.map(item => (
						<div
							key={item.id}
							className={item.id === '2'
								? 'hidden xl:inline-block myXl2:hidden inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px] cursor-pointer'
								: item.id === '4'
									? 'hidden myMd1:inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px]'
									: item.id === '3'
										? 'hidden sm:inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px]'
										: item.id === '1'
											? 'inline-block sm:inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px]'
											: 'inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px]'}
						>
							<span>
								{item.title}
							</span>
						</div>
					))}
				</div>
			</div>
			<div className='flex items-center justify-center gap-6'>
				<span className='w-[30px] flex justify-center items-center'>
					{duration}
				</span>
				<span className='hidden sm:flex w-[20px] justify-center items-center'>
					{favoriteIcon}
				</span>
				<span className='hidden w-[20px] md:flex items-center justify-center'>
					{downloadIcon}
				</span>
				{adminActions}
				{isEditModalOpen && (
					<ModalComponent
						active={isEditModalOpen}
						setActive={setEditModalOpen}
						className='border-royalBlue mb-[10px] mt-[10px]'
					>
						<UpdateSongForm songId={songId} />
					</ModalComponent>
				)}
			</div>
		</div>
	);
};