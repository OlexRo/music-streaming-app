//Функциональный компонент
import {
	FC,
	useState,
	useEffect
} from 'react';
//Работа с запросами
import axios from 'axios';
//React-Coolie
import Cookies from 'js-cookie';
//Интерфейсы
import {
	IUpdateCategoryFormValues,
	IUpdateCategoryProps
} from './UpdateCategoryComponent.interface.ts';
//React-hook-form
import {
	useForm,
	SubmitHandler,
	FieldError
} from 'react-hook-form';
import { IoIosArrowForward } from 'react-icons/io';
//React-component
import { InputComponent } from '../../../../ui/inputComponent/inputComponent.tsx';
import { ButtonComponent } from '../../../../ui/buttonComponent/buttonComponent.tsx';
import { PSDWindowComponent } from '../../../../modal/PSDWindowComponent/PSDWindowComponent.tsx';

export const UpdateCategoryForm: FC<IUpdateCategoryProps> = ({ categoryId }) => {
	//Состояние для анимации загрузки
	const [loading, setLoading] = useState(false);
	//Состояние для данных фотографии
	const [photo, setPhoto] = useState<File | null>(null);
	//Состояние для управления отображением окна уведомлений
	const [PSDWindowActive, setPSDWindowActive] = useState(false);
	const [PSDMessage, setPSDMessage] = useState('');
	const [messageType, setMessageType] = useState<'success' | 'error'>('success');

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm<IUpdateCategoryFormValues>();

	//Получение данных категории при загрузке компонента
	useEffect(() => {
		const fetchCategory = async () => {
			try {
				//Получаем токен из cookie
				const token = Cookies.get('token');
				if (!token) return;
				//Запрашиваем данные альбома по его ID
				const response = await axios.get(`http://localhost:5000/category/${categoryId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const category = response.data;
				//Устанавливаем значения в поля формы
				setValue('title', category.title);
				setValue('description', category.description);
			} catch (error) {
				console.error('Ошибка при получении данных категории', error);
			}
		};
		fetchCategory().catch(error => {
			console.error('Ошибка вывода', error);
		});
	}, [categoryId, setValue]);

	//Обработчик отправки формы
	const onSubmit: SubmitHandler<IUpdateCategoryFormValues> = async (data) => {
		setLoading(true);
		try {
			// Получаем токен из cookie
			const token = Cookies.get('token');
			if (!token) return;
			//Создаем форму данных для отправки на сервер
			const formData = new FormData();
			if(data.title) formData.append('title', data.title);
			if(data.description) formData.append('description', data.description);
			if (photo) formData.append('photo', photo);
			//Отправляем запрос на обновление альбома
			await axios.patch(`http://localhost:5000/category/category-update?id=${categoryId}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			});
			setPSDMessage('Категория успешно обновлена');
			setMessageType('success');
			setPSDWindowActive(true); // Активируем окно с сообщением
			// Закрываем оба окна и останавливаем анимацию загрузки через 2 секунды
			setTimeout(() => {
				setPSDWindowActive(false) // Закрываем окно с сообщением
			}, 1000)
		} catch (error) {
			// Обрабатываем ошибку и показываем сообщение
			setPSDMessage('Ошибка при обновлении категории');
			setMessageType('error'); // Показываем окно с сообщением
			setPSDWindowActive(true);
			setTimeout(() => setPSDWindowActive(false), 1000);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
			{/* Окно для сообщения */}
			<PSDWindowComponent
				active={PSDWindowActive}
				setActive={setPSDWindowActive}
				message={PSDMessage}
				type={messageType}
			/>
			{/* Изменение названия */}
			<div className='flex flex-col gap-5'>
				<div>
					<InputComponent
						id='title'
						placeholder='Введите название категории...'
						{...register('title', { required: 'Название обязательно' })}
					/>
					{errors.title && (
						<span className='text-sm text-errorText'>
							{(errors.title as FieldError).message}
						</span>
					)}
				</div>
				{/* Изменение описания */}
				<div>
					<InputComponent
						id='description'
						placeholder='Введите описание категории...'
						{...register('description')}
					/>
					{errors.description && (
						<span className='text-sm text-errorText'>
							{(errors.description as FieldError).message}
						</span>
					)}
				</div>
				{/* Изменение фото */}
				<div className='flex flex-col space-y-2'>
					<input
						type='file'
						accept='image/*'
						onChange={(e) => setPhoto(e.target.files
							? e.target.files[0]
							: null)}
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
					{loading ? '' : 'Обновить категорию'}
				</ButtonComponent>
			</div>
		</form>
	);
};