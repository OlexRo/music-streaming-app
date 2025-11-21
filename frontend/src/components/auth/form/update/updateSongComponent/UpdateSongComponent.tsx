//Функциональный компонент
import {
	FC,
	useState,
	useEffect
} from 'react';
import Select from 'react-select';
//Работа с запросами
import axios from 'axios';
import { useShowAlbum } from '../../../../../utils/axios/useShowAlbum.tsx';
import { useShowSinger } from '../../../../../utils/axios/useShowSinger.tsx';
import { useShowCategory } from '../../../../../utils/axios/useShowCategory.tsx';
//React-Coolie
import Cookies from 'js-cookie';
//Интерфейсы
import {
	IUpdateSongFormValues,
	IUpdateSongProps
} from './UpdateSongComponent.interface.ts';
//React-hook-form
import {
	useForm,
	SubmitHandler,
	FieldError
} from 'react-hook-form';
//React-icons
import { IoIosArrowForward } from 'react-icons/io';
//React-component
import { InputComponent } from '../../../../ui/inputComponent/inputComponent.tsx';
import { ButtonComponent } from '../../../../ui/buttonComponent/buttonComponent.tsx';
import { PSDWindowComponent } from '../../../../modal/PSDWindowComponent/PSDWindowComponent.tsx';

export const UpdateSongForm: FC<IUpdateSongProps> = ({ songId }) => {
	//Анимация загрузки
	const [loading, setLoading] = useState(false);
	//Данные фотографии
	const [photo, setPhoto] = useState<File | null>(null);
	//Данные музыкального файла
	const [songFile, setSongFile] = useState<File | null>(null);
	//Данные альбома
	const { albums } = useShowAlbum();
	//Данные певца
	const { singers } = useShowSinger();
	//Данные категории
	const { categories } = useShowCategory();
	//Состояние для управления отображением окна уведомлений
	const [PSDWindowActive, setPSDWindowActive] = useState(false);
	const [PSDMessage, setPSDMessage] = useState('');
	const [messageType, setMessageType] = useState<'success' | 'error'>('success');

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm<IUpdateSongFormValues>();

	//Вывод текущих данных песни
	useEffect(() => {
		const fetchSong = async () => {
			try {
				//Получаем токен из cookie
				const token = Cookies.get('token');
				if (!token) return;
				const response = await axios.get(`http://localhost:5000/song/one_song/${songId}`, {
					headers: {
						Authorization: `Bearer ${token}`
					},
				});
				const song = response.data;
				setValue('title', song.title);
				setValue('albumId', song.albumId);
				setValue('singerId', song.singerId);
				setValue('categoryId', song.categoryId);
				setValue('yearRelease', song.yearRelease);
				console.log(song.title)
			} catch (error) {
				console.error('Ошибка', error);
			}
		};
		fetchSong().catch(error => {
			console.error('Ошибка вывода', error);
		});
	}, [songId, setValue]);

	//Кнопка для обновления
	const onSubmit: SubmitHandler<IUpdateSongFormValues> = async (data) => {
		setLoading(true);
		try {
			//Получаем токен из cookie
			const token = Cookies.get('token');
			if (!token) return;
			const formData = new FormData();
			if (data.title) formData.append('title', data.title);
			if (data.albumId) formData.append('albumId', data.albumId);
			if (data.singerId) formData.append('singerId', data.singerId);
			if (data.categoryId) formData.append('categoryId', data.categoryId);
			if (data.yearRelease) formData.append('yearRelease', data.yearRelease.toString());
			if (photo) formData.append('photo', photo);
			if (songFile) formData.append('songFile', songFile);
			// Обновляем данные песни
			await axios.patch(`http://localhost:5000/song/update-song?id=${songId}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			});
			//Устанавливаем сообщение об успехе
			setPSDMessage('Песня успешно обновлена');
			setMessageType('success');
			setPSDWindowActive(true);  // Активируем окно с сообщением
			//Закрываем оба окна и останавливаем анимацию загрузки через 2 секунды
			setTimeout(() => {
				setPSDWindowActive(false);  // Закрываем окно с сообщением
			}, 1000);
		} catch (error) {
			//Обрабатываем ошибку и показываем сообщение
			setPSDMessage('Ошибка при обновлении песни');
			setMessageType('error');
			setPSDWindowActive(true);  // Показываем окно с сообщением
			//Закрываем окно с сообщением об ошибке через 2 секунды
			setTimeout(() => {
				setPSDWindowActive(false);
			}, 1000);
		} finally {
			//Останавливаем анимацию загрузки сразу
			setLoading(false);
		}
	};

	//Формируем параметры для select
	const albumOptions = albums.map(album => ({
		value: album.id,
		label: album.title,
	}));
	const singerOptions = singers.map(singer => ({
		value: singer.id,
		label: singer.name,
	}));
	const categoryOptions = categories.map(category => ({
		value: category.id,
		label: category.title,
	}));

	return (
		<form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
			{/*Окно для сообщения*/}
			<PSDWindowComponent
				active={PSDWindowActive}
				setActive={setPSDWindowActive}
				message={PSDMessage}
				type={messageType}
			/>
			<div className='flex flex-col gap-5'>
				{/* Изменение названия */}
				<div>
					<InputComponent
						id='title'
						placeholder='Введите название песни...'
						{...register('title')}
					/>
					{errors.title && (
						<span className='text-sm text-errorText'>
							{(errors.title as FieldError).message}
						</span>
					)}
				</div>
				{/* Изменение даты */}
				<div>
					<InputComponent
						id='date'
						type='number'
						placeholder='Введите дату...'
						{...register('yearRelease')}
					/>
					{errors.yearRelease && (
						<span className='text-sm text-errorText'>
							{(errors.yearRelease as FieldError).message}
						</span>
					)}
				</div>
				{/* Изменение фото */}
				<div className="flex flex-col space-y-2">
					<input
						type='file'
						accept='image/*'
						onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
						className={`block w-full text-sm text-dullGray border border-[#DCDCDC] rounded-[5px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-royalBlue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:bg-royalBlue file:border-0 file:text-blockWhite ${
							photo
								? 'ring-1 ring-royalBlue border-transparent'
								: ''
						}`}
					/>
					{errors.photo && (
						<span className="text-sm text-red-500">
							{(errors.photo as FieldError).message}
						</span>
					)}
				</div>
				{/* Изменение файла песни */}
				<div className="flex flex-col space-y-2">
					<input
						type="file"
						accept="audio/*"
						onChange={(e) => setSongFile(e.target.files
							? e.target.files[0]
							: null)}
						className={`block w-full text-sm text-dullGray border border-[#DCDCDC] rounded-[5px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-royalBlue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:bg-royalBlue file:border-0 file:text-blockWhite 
						${songFile 
								? 'ring-1 ring-royalBlue border-transparent' 
								: ''
						}`}
					/>
					{errors.songFile && (
						<span className="text-sm text-errorText">
							{(errors.songFile as FieldError).message}
						</span>
					)}
				</div>
				{/* Изменение альбома */}
				<div>
				<Select
						options={albumOptions}
						onChange={option => setValue('albumId', option
							? String(option.value)
							: undefined)}
						placeholder='Выберите альбом...'
						value={albumOptions.find(option => option.value === Number(watch('albumId'))) || null}
					/>
					{errors.albumId && (
						<span className='text-sm text-errorText'>
							{(errors.albumId as FieldError).message}
						</span>
					)}
				</div>
				{/* Изменение певца */}
				<div>
					<Select
						options={singerOptions}
						onChange={option => setValue('singerId', option?.value
							? option.value.toString()
							: undefined)}
						placeholder='Выбрать певца...'
						value={singerOptions.find(option => option.value === (watch('singerId')
							? Number(watch('singerId'))
							: undefined)) || null}
					/>
					{errors.singerId && (
						<span className='text-sm text-errorText'>
							{(errors.singerId as FieldError).message}
						</span>
					)}
				</div>
				{/* Изменение категории */}
				<div>
					<Select
						options={categoryOptions}
						onChange={option => setValue('categoryId', option?.value
							? String(option.value)
							: undefined)}
						placeholder='Выбор категории...'
						value={categoryOptions.find(option => option.value === Number(watch('categoryId'))) || null}
					/>
					{errors.categoryId && (
						<span className='text-sm text-errorText'>
							{(errors.categoryId as FieldError).message}
						</span>
					)}
				</div>
				{/* Кнопка для отправки формы */}
				<ButtonComponent
					icon={<IoIosArrowForward/>}
					className='border-royalBlue mb-[10px] mt-[10px]'
					loading={loading}
				>
					{loading ? '' : 'Обновить песню'}
				</ButtonComponent>
			</div>
		</form>
	);
};