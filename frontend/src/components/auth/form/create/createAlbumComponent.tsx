//Функциональный компонент
import {
	FC,
	useState,
} from 'react';
import { useShowSinger } from '../../../../utils/axios/useShowSinger.tsx';
import Select from 'react-select';
//Работа с запросами
import axios from 'axios';
//React-Coolie
import Cookies from 'js-cookie';
//React-hook-form
import {
	useForm,
	SubmitHandler,
	FieldError
} from 'react-hook-form';
//React-icons
import { RiCalendar2Fill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import { MdSubtitles } from 'react-icons/md';
//React-components
import { InputComponent } from '../../../ui/inputComponent/inputComponent.tsx';
import { ButtonComponent } from '../../../ui/buttonComponent/buttonComponent.tsx';
//Функции валидации
import {
	descriptionValidation,
	titleValidation, yearValidation
} from '../../../../utils/createAlbumUtils.ts';
//Интерфейс
import { IUpdateAlbumFormValues } from '../update/updateAlbumComponent/UpdateAlbumComponent.interface.ts';

//Интерфейс для формы создания альбома
interface IFormsDataAlbum {
	title?: string;
	photo?: FileList;
	description?: string;
	singerId?: string;
	yearRelease?: number;
}

export const CreateAlbumComponent: FC = () => {
	//Анимация загрузки
	const [loading, setLoading] = useState(false);
	//Данные фотографии
	const [photo, setPhoto] = useState<File | null>(null);
	//Данные певца
	const { singers } = useShowSinger();
	//Настройки для работы с формой
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm<IUpdateAlbumFormValues>();

	//Кнопка для создания альбома
	const onSubmit: SubmitHandler<IFormsDataAlbum> = async (data: IFormsDataAlbum) => {
		setLoading(true);
		try {
			//Получаем токен из cookie
			const token = Cookies.get('token');
			if (!token) return;
			// Сбор данных из полей
			const formData = new FormData();
			if (data.title) formData.append('title', data.title);
			if (data.description) formData.append('description', data.description);
			if (data.singerId) formData.append('singerId', data.singerId);
			if (data.yearRelease !== undefined) formData.append('yearRelease', data.yearRelease.toString());
			if (photo) formData.append('photo', photo);
			await axios.post('http://localhost:5000/album/create-album', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			});
			setLoading(false);
			location.reload();
		} catch (error) {
			setLoading(false);
			if (axios.isAxiosError(error) && error.response) {
				alert(`${error.response.data.message || 'Произошла ошибка'}`);
			}
		}
	};

	// Опции для выпадающего списка с певцами
	const singerOptions = singers.map(singer => ({
		value: singer.id,
		label: singer.name,
	}));

	return (
		<form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col gap-5'>
				{/* Поле для названия альбома */}
				<div>
					<InputComponent
						id='title'
						icon={<MdSubtitles  />}
						placeholder='Введите название альбома...'
						{...register('title', titleValidation())}
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
						id='year'
						type='number'
						icon={<RiCalendar2Fill />}
						placeholder='Введите год релиза...'
						{...register('yearRelease', yearValidation())}
					/>
					{errors.yearRelease && (
						<span className='text-sm text-errorText'>
							{(errors.yearRelease as FieldError).message}
						</span>
					)}
				</div>
				{/* Поле для описания */}
				<div>
				<textarea
					className='p-2 block w-full text-sm text-dullGray border border-[#DCDCDC] rounded-[5px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-royalBlue focus:border-transparent'
					id='description'
					placeholder='Введите описание альбома...'
					{...register('description', descriptionValidation())}
				/>
					{errors.description && (
						<span className='text-sm text-errorText'>
							{(errors.description as FieldError).message}
						</span>
					)}
				</div>
				{/* Поле для выбора певца */}
				<div>
					<Select
						options={singerOptions}
						{...register('singerId', { required: 'Требуется выбрать певца' })}
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
				{/* Поле для фото */}
				<div className='flex flex-col space-y-2'>
					<input
						type='file'
						accept='image/*'
						{...register('photo', { required: 'Требуется загрузить фотографию' })}
						onChange={(e) => setPhoto(e.target.files
							? e.target.files[0]
							: null)}
						className={`block w-full text-sm text-dullGray border border-[#DCDCDC] rounded-[5px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-royalBlue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:bg-royalBlue file:border-0 file:text-blockWhite
						${photo 
							? 'ring-1 ring-royalBlue border-transparent' 
							: ''}`}
					/>
					{errors.photo && (
						<span className='text-sm text-errorText'>
							{(errors.photo as FieldError).message}
						</span>
					)}
				</div>
				{/* Кнопка отправки */}
				<ButtonComponent
					icon={<IoIosArrowForward />}
					className='border-royalBlue mb-[10px] mt-[10px]'
					loading={loading}
				>
					{loading
						? 'Добавление...'
						: 'Добавить альбом'}
				</ButtonComponent>
			</div>
		</form>
	);
};