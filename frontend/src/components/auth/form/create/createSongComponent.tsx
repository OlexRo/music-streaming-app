//Функциональный компонент
import {
	FC,
	useState,
} from 'react';
import Select from 'react-select';
//React-Cookie
import Cookies from 'js-cookie';
//Работа с запросами
import axios from 'axios';
import { useShowCategory } from '../../../../utils/axios/useShowCategory.tsx';
import { useShowSinger } from '../../../../utils/axios/useShowSinger.tsx';
import { useShowAlbum } from '../../../../utils/axios/useShowAlbum.tsx';
//React-hook-form
import {
	useForm,
	SubmitHandler,
	FieldError
} from 'react-hook-form';
//React-icons
import { IoIosArrowForward } from 'react-icons/io';
//React-component
import { InputComponent } from '../../../ui/inputComponent/inputComponent.tsx';
import { ButtonComponent} from '../../../ui/buttonComponent/buttonComponent.tsx';
//Валидация
import { IUpdateSongFormValues } from '../update/updateSongComponent/UpdateSongComponent.interface.ts';
import {RiCalendar2Fill} from 'react-icons/ri';
import {MdSubtitles} from 'react-icons/md';
import {
	albumIdValidation,
	dateValidation,
	songFileValidation,
	titleValidation
} from '../../../../utils/createSongUtils.ts';

//Интерфейс для SubmitHandler
interface IFormDataSong {
	title?: string;
	photo?: FileList;
	songFile?: FileList;
	albumId?: string;
	singerId?: string;
	categoryId?: string;
	yearRelease?: number;
}

export const CreateSongComponent: FC = () => {
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
	//Работа с валидацией
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors } } = useForm<IUpdateSongFormValues>();

	//Кнопка для создания песни
	const onSubmit: SubmitHandler<IFormDataSong> = async (data: IFormDataSong) => {
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
			if (data.yearRelease !== undefined) formData.append('yearRelease', data.yearRelease.toString());
			if (photo) formData.append('photo', photo);
			if (songFile) formData.append('songFile', songFile);
			await axios.post('http://localhost:5000/song/create-song', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			});
			setLoading(false);
			location.reload();
		}
		catch (error) {
			setLoading(false);
			if (axios.isAxiosError(error) && error.response) {
				alert(`${error.response.data.message || 'Произошла ошибка'}`);
			}
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
			<div className='flex flex-col gap-5'>
				{/* Поле для названия песни */}
				<div>
					<InputComponent
						id='title'
						icon={<MdSubtitles />}
						placeholder='Введите название песни...'
						{...register('title', titleValidation())} // Применение валидации названия
					/>
					{errors.title && (
						<span className='text-sm text-errorText'>
							{(errors.title as FieldError).message}
						</span>
					)}
				</div>
				{/* Поле для даты */}
				<div>
					<InputComponent
						id='date'
						type='number'
						icon={<RiCalendar2Fill />}
						placeholder='Введите дату релиза...'
						{...register('yearRelease', dateValidation())} // Применение валидации даты
					/>
					{errors.yearRelease && (
						<span className='text-sm text-errorText'>
							{(errors.yearRelease as FieldError).message}
						</span>
					)}
				</div>
				{/* Поле для фото */}
				<div className="flex flex-col space-y-2">
					<input
						type="file"
						accept="image/*"
						{...register('photo', { required: 'Требуется загрузить фотографию' })}
						onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
						className={`block w-full text-sm text-dullGray border border-[#DCDCDC] rounded-[5px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-royalBlue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:bg-royalBlue file:border-0 file:text-blockWhite ${photo ? 'ring-1 ring-royalBlue border-transparent' : ''}`}
					/>
					{errors.photo && (
						<span className="text-sm text-errorText">
							{(errors.photo as FieldError).message}
						</span>
					)}
				</div>
				{/* Поле для файла песни */}
				<div className="flex flex-col space-y-2">
					<input
						type='file'
						{...register('songFile', songFileValidation())} // Применение валидации файла песни
						accept='audio/*'
						onChange={(e) => setSongFile(e.target.files ? e.target.files[0] : null)}
						className={`block w-full text-sm text-dullGray border border-[#DCDCDC] rounded-[5px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-royalBlue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:bg-royalBlue file:border-0 file:text-blockWhite ${songFile ? 'ring-1 ring-royalBlue border-transparent' : ''}`}
					/>
					{errors.songFile && (
						<span className='text-sm text-errorText'>
							{(errors.songFile as FieldError).message}
						</span>
					)}
				</div>
				{/* Поле для выбора альбома */}
				<div>
					<Select
						options={albumOptions}
						{...register('albumId', albumIdValidation())} // Применение валидации альбома
						onChange={option => setValue('albumId', option ? String(option.value) : undefined)}
						placeholder='Выберите альбом...'
						value={albumOptions.find(option => option.value === Number(watch('albumId'))) || null}
					/>
					{errors.albumId && (
						<span className='text-sm text-errorText'>
							{(errors.albumId as FieldError).message}
						</span>
					)}
				</div>
				{/* Поле для выбора певца */}
				<div>
					<Select
						options={singerOptions}
						{...register('singerId', { required: 'Требуется выбрать певца' })} // Валидация выбора певца
						onChange={option => setValue('singerId', option?.value ? option.value.toString() : undefined)}
						placeholder='Выбрать певца...'
						value={singerOptions.find(option => option.value === (watch('singerId') ? Number(watch('singerId')) : undefined)) || null}
					/>
					{errors.singerId && (
						<span className='text-sm text-errorText'>
							{(errors.singerId as FieldError).message}
						</span>
					)}
				</div>
				{/* Поле для выбора категории */}
				<div>
					<Select
						options={categoryOptions}
						{...register('categoryId', { required: 'Требуется выбрать категорию' })} // Валидация выбора категории
						onChange={option => setValue('categoryId', option?.value ? String(option.value) : undefined)}
						placeholder='Выбор категории...'
						value={categoryOptions.find(option => option.value === Number(watch('categoryId'))) || null}
					/>
					{errors.categoryId && (
						<span className='text-sm text-errorText'>
							{(errors.categoryId as FieldError).message}
						</span>
					)}
				</div>
				{/* Кнопка отправки */}
				<ButtonComponent
					icon={<IoIosArrowForward />}
					className='border-royalBlue mb-[10px] mt-[10px]'
					loading={loading}
				>
					{loading ? 'Добавление...' : 'Добавить песню'}
				</ButtonComponent>
			</div>
		</form>
	);
};