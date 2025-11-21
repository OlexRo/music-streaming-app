//Функциональный компонент
import {
	FC,
	useState,
	useEffect
} from 'react';
import Select from 'react-select';
//Работа с запросами
import axios from 'axios';
import { useShowSinger } from '../../../../../utils/axios/useShowSinger.tsx';
//React-Coolie
import Cookies from 'js-cookie';
//Интерфейсы
import {
	IUpdateAlbumFormValues,
	IUpdateAlbumProps
} from './UpdateAlbumComponent.interface.ts';
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

export const UpdateAlbumForm: FC<IUpdateAlbumProps> = ({ albumId }) => {
	// Состояние для анимации загрузки
	const [loading, setLoading] = useState(false);
	// Состояние для данных фотографии
	const [photo, setPhoto] = useState<File | null>(null);
	// Получаем данные о певцах
	const { singers } = useShowSinger();
	// Состояние для управления отображением окна уведомлений
	const [PSDWindowActive, setPSDWindowActive] = useState(false);
	const [PSDMessage, setPSDMessage] = useState('');
	const [messageType, setMessageType] = useState<'success' | 'error'>('success');

	// Настройки для работы с формой
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm<IUpdateAlbumFormValues>();

	// Вывод текущих данных альбома при загрузке компонента
	useEffect(() => {
		const fetchAlbum = async () => {
			try {
				//Получаем токен для аутентификации
				const token = Cookies.get('token');
				if (!token) return;
				//Запрашиваем данные альбома по его ID
				const response = await axios.get(`http://localhost:5000/album/${albumId}`, {
					headers: {
						Authorization: `Bearer ${token}`
					},
				});
				const album = response.data;
				// Устанавливаем значения в поля формы
				setValue('title', album.title);
				setValue('singerId', album.singerId);
				setValue('yearRelease', album.yearRelease);
				setValue('description', album.description);
			} catch (error) {
				console.error('Ошибка', error);
			}
		};
		fetchAlbum().catch(error => {
			console.error('Ошибка вывода', error);
		});
	}, [albumId, setValue]);

	//Обработчик отправки формы
	const onSubmit: SubmitHandler<IUpdateAlbumFormValues> = async (data) => {
		setLoading(true);
		try {
			//Получаем токен для аутентификации
			const token = Cookies.get('token');
			if (!token) return;
			//Создаем форму данных для отправки на сервер
			const formData = new FormData();
			if (data.title) formData.append('title', data.title);
			if (data.singerId) formData.append('singerId', data.singerId);
			if (data.yearRelease) formData.append('yearRelease', data.yearRelease.toString());
			if (data.description) formData.append('description', data.description);
			if (photo) formData.append('photo', photo);
			//Отправляем запрос на обновление альбома
			await axios.patch(`http://localhost:5000/album/albumPage-update?id=${albumId}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			});
			//Уведомляем пользователя об успешном обновлении
			setPSDMessage('Альбом успешно обновлён');
			setMessageType('success');
			setPSDWindowActive(true); //Активируем окно с сообщением
			//Закрываем оба окна и останавливаем анимацию загрузки через 2 секунды
			setTimeout(() => {
				setPSDWindowActive(false); //Закрываем окно с сообщением
			}, 1000);
		} catch (error) {
			//Обрабатываем ошибку и показываем сообщение
			setPSDMessage('Ошибка при обновлении альбома');
			setMessageType('error');
			setPSDWindowActive(true); //Показываем окно с сообщением
			setTimeout(() => {
				setPSDWindowActive(false);
			}, 1000);
		} finally {
			setLoading(false);
		}
	};

	// Опции для выпадающего списка с певцами
	const singerOptions = singers.map(singer => ({
		value: singer.id,
		label: singer.name,
	}));

	return (
		<form
			className='flex flex-col'
			onSubmit={handleSubmit(onSubmit)}
		>
			{/* Окно для сообщения */}
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
						placeholder='Введите название альбома...'
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
						id='yearRelease'
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
							: undefined)) || null}					/>
					{errors.singerId && (
						<span className='text-sm text-errorText'>
							{(errors.singerId as FieldError).message}
						</span>
					)}
				</div>
				{/* Изменение фото */}
				<div className='flex flex-col space-y-2'>
					<input
						type='file'
						accept='image/*'
						onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
						className={`block w-full text-sm text-dullGray border border-[#DCDCDC] rounded-[5px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-royalBlue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:bg-royalBlue file:border-0 file:text-blockWhite 
						${photo
							? 'ring-1 ring-royalBlue border-transparent'
							: ''
						}`}
					/>
				</div>
				{/* Кнопка для отправки формы */}
				<ButtonComponent
					icon={<IoIosArrowForward />}
					className='border-royalBlue mb-[10px] mt-[10px]'
					loading={loading}
				>
					{loading ? '' : 'Обновить альбом'}
				</ButtonComponent>
			</div>
		</form>
	);
};