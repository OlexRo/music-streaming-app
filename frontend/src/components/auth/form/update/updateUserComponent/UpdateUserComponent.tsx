// Функциональный компонент
import {FC, useEffect, useState} from 'react';
import axios from 'axios';
import {useForm, SubmitHandler, FieldError} from 'react-hook-form';
import { InputComponent } from '../../../../ui/inputComponent/inputComponent.tsx';
import { ButtonComponent } from '../../../../ui/buttonComponent/buttonComponent.tsx';
import { PSDWindowComponent } from '../../../../modal/PSDWindowComponent/PSDWindowComponent.tsx';
import Cookies from 'js-cookie';
import {IoIosArrowForward} from 'react-icons/io';
import {FaAddressCard} from 'react-icons/fa'; // Убедитесь, что вы импортируете Cookies

interface UpdateUserDTO {
	login?: string;
	surname?: string;
	name?: string;
	password?: string;
	photo?: File | null;
}

export const UpdateUserForm: FC = () => {
	const [loading, setLoading] = useState(false);
	const [photo, setPhoto] = useState<File | null>(null);
	const [PSDWindowActive, setPSDWindowActive] = useState(false);
	const [PSDMessage, setPSDMessage] = useState('');
	const [messageType, setMessageType] = useState<'success' | 'error'>('success');

	// Используем useForm с defaultValues
	const { register, handleSubmit, setValue, formState: { errors } } = useForm<UpdateUserDTO>({
		defaultValues: {
			login: '',  // Задайте пустые значения по умолчанию
			surname: '',
			name: ''
		}
	});

	//Эффект для загрузки данных пользователя и установки значений по умолчанию
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				// Получаем токен из cookie
				const token = Cookies.get('token');
				if (!token) return;
				const res = await axios.get('http://localhost:5000/user/profile', {
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});

				const userData = res.data;
				// Установка значений по умолчанию в инпуты
				setValue('login', userData.login);
				setValue('surname', userData.surname);
				setValue('name', userData.name);

			} catch (error) {
				console.error('Ошибка загрузки данных пользователя', error);
			}
		};

		fetchUserData();
	}, [setValue]);

	//Обработчик отправки формы
	const onSubmit: SubmitHandler<UpdateUserDTO> = async (data) => {
		setLoading(true);
		try {
			//Получаем токен из cookie
			const token = Cookies.get('token');
			if (!token) return;
			const formData = new FormData();
			if (photo) formData.append('photo', photo); // Добавляем файл фото
			Object.entries(data).forEach(([key, value]) => {
				if (value) formData.append(key, value); // Отправляем только непустые значения
			});

			const res = await axios.patch('http://localhost:5000/user/user-update', formData, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			// Запись нового токена в cookie
			Cookies.set('token', res.data.token, {
				expires: 7, // токен будет храниться 7 дней
				secure: process.env.NODE_ENV === 'production', // Только по HTTPS в продакшене
				sameSite: 'strict', // Защита от CSRF
				path: '/', // Cookie доступен по всем путям
			});

			setPSDMessage('Пользователь успешно обновлён');
			setMessageType('success');
			setPSDWindowActive(true);
			setTimeout(() => {
				setPSDWindowActive(false);
			}, 1000);
		} catch (error) {
			setPSDMessage('Ошибка при обновлении пользователя');
			setMessageType('error');
			setPSDWindowActive(true);
			setTimeout(() => {
				setPSDWindowActive(false);
			}, 1000);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
			<PSDWindowComponent
				active={PSDWindowActive}
				setActive={setPSDWindowActive}
				message={PSDMessage}
				type={messageType}
			/>
			<div className='flex flex-col gap-5'>

				<InputComponent
					id='login'
					icon={<FaAddressCard />}
					type='text'
					placeholder='Логин'
					{...register('login')}
				/>
				{errors.login && <span>{errors.login.message}</span>}

				<InputComponent
					id='name'
					type='text'
					icon={<FaAddressCard />}
					placeholder='Имя'
					{...register('name')}
				/>
				{errors.name && <span>{errors.name.message}</span>}

				<InputComponent
					id='surname'
					type='text'
					icon={<FaAddressCard />}
					placeholder='Фамилия'
					{...register('surname')}
				/>
				{errors.surname && <span>{errors.surname.message}</span>}

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

				<ButtonComponent
					icon={<IoIosArrowForward/>}
					className='border-royalBlue mb-[10px] mt-[10px]'
					loading={loading}
				>
					{loading ? 'Загрузка...' : 'Обновить пользователя'}
				</ButtonComponent>
			</div>
		</form>
	);
};