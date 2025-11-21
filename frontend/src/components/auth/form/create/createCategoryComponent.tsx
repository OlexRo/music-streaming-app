//Функциональный компонент
import {
	FC,
	useState
} from 'react';
//Работа с запросами
import axios from 'axios';
//React-Cookie
import Cookies from 'js-cookie';
//React-hook-form
import {
	useForm,
	SubmitHandler,
	FieldError
} from 'react-hook-form';
//React-icons
import { IoIosArrowForward } from 'react-icons/io';
//React-components
import { InputComponent } from '../../../ui/inputComponent/inputComponent.tsx';
import { ButtonComponent } from '../../../ui/buttonComponent/buttonComponent.tsx';
import {MdSubtitles} from 'react-icons/md';

//Интерфейс для формы создания категории
interface IFormsDataCategory {
	title: string;
	description: string;
	photo: FileList;
}

export const CreateCategoryComponent: FC = () => {
	//Анимация загрузки
	const [loading, setLoading] = useState(false);
	//Данные фотографии
	const [photo, setPhoto] = useState<File | null>(null);
	//Настройки для работы с формой
	const {
		register,
		handleSubmit,
		formState: { errors } } = useForm<IFormsDataCategory>();

	//Кнопка для создания категории
	const onSubmit: SubmitHandler<IFormsDataCategory> = async (data: IFormsDataCategory) => {
		setLoading(true);
		try {
			//Получаем токен из cookie
			const token = Cookies.get('token');
			if (!token) return;
			const formData = new FormData();
			formData.append('title', data.title);
			formData.append('description', data.description);
			if (photo) formData.append('photo', photo);
			await axios.post('http://localhost:5000/category/create-category', formData, {
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

	return (
		<form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col gap-5'>
				{/* Поле для названия */}
				<div>
					<InputComponent
						id='title'
						icon={<MdSubtitles  />}
						placeholder='Введите название категории...'
						{...register('title', { required: 'Название категории обязательно' })}
					/>
					{errors.title && (
						<span className='text-sm text-errorText'>
							{(errors.title as FieldError).message}
						</span>
					)}
				</div>
				{/* Поле для описания */}
				<div>
					<textarea
						className='p-2 block w-full text-sm text-dullGray border border-[#DCDCDC] rounded-[5px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-royalBlue focus:border-transparent'
						id='description'
						placeholder='Введите описание категории...'
						{...register('description', {required: 'Описание категории обязательно'})}
					/>
					{errors.description && (
						<span className="text-sm text-errorText">
							{(errors.description as FieldError).message}
						</span>
					)}
				</div>
				{/* Поле для фото */}
				<div className="flex flex-col space-y-2">
					<input
						type="file"
						{...register('photo', { required: 'Требуется загрузить фотографию' })}
						accept="image/*"
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
				{/* Кнопка для отправки формы */}
				<ButtonComponent
					icon={<IoIosArrowForward />}
					className='border-royalBlue mb-[10px] mt-[10px]'
					loading={loading}
				>
					{loading ? 'Добавление...' : 'Добавить категорию'}
				</ButtonComponent>
			</div>
		</form>
	);
};