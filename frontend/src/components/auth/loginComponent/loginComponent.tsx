//Функциональный компонент
import {
	FC,
	useState
} from 'react';
import { useNavigate } from 'react-router-dom';
//Работа с запросами
import axios from 'axios';
//Интерфейсы
import {
	IAuth,
	IAuthResponse,
	IFormsDataAuth
} from './loginComponent.interface.ts';
//React-hook-form
import {
	useForm,
	SubmitHandler,
	FieldError }
	from 'react-hook-form';
//React-icons
import { RiLockPasswordFill } from 'react-icons/ri';
import { ImHeadphones } from 'react-icons/im';
import {
	IoIosArrowForward,
	IoMdEye,
	IoMdEyeOff
} from 'react-icons/io';
import { FaAddressCard } from 'react-icons/fa';
//React-components
import { ButtonComponent } from '../../ui/buttonComponent/buttonComponent.tsx';
import { LogoComponent } from '../../ui/logoComponent/logoComponent.tsx';
import { InputComponent } from '../../ui/inputComponent/inputComponent.tsx';
//Функции валидации
import {
	passwordValidation,
	loginValidation
} from '../../../utils/registerUtils.ts';

import Cookies from 'js-cookie';

export const LoginComponent: FC<IAuth> = ({
		setModalActive,
		setPSDWindowActive,
		onMassage
	}) => {
	const navigate = useNavigate();
	//Анимация загрузки
	const [loading, setLoading] = useState(false);

	// Показ и сокрытие пароля
	const [showPassword, setShowPassword] = useState(false);
	const toggleShowPassword = () => {
		setShowPassword(prev => !prev);
	};

	//Состояние для чекбокса запомнить меня
	const [rememberMe, setRememberMe] = useState(false);

	const { register, handleSubmit, formState: { errors } } = useForm<IFormsDataAuth>();


	//Логика авторизации
	const onSubmit: SubmitHandler<IFormsDataAuth> = async (data: IFormsDataAuth) => {
		setLoading(true);
		try {
			const res = await axios.post<IAuthResponse>('http://localhost:5000/auth/login', data);
			//Запись токена в cookie с атрибутами
			Cookies.set('token', res.data.token, {
				expires: 7, // токен будет храниться 7 дней
				secure: process.env.NODE_ENV === 'production', // Использовать только по HTTPS в продакшене
				sameSite: 'strict', // Защита от CSRF
				path: '/' // Cookie доступен по всем путям
			});
			setTimeout(() => {
				setLoading(false);
				setModalActive(false);
				setPSDWindowActive(true);
				onMassage('Вы успешно вошли в аккаунт');
				navigate('/');
				setTimeout(() => {
					location.reload();
				}, 1000);
			}, 1000);
		} catch (error) {
			setLoading(false);
			onMassage('Ошибка при авторизации, попробуйте снова');
		}
	};

	return (
		<form
			className='flex flex-col'
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className='mb-[20px]'>
				<LogoComponent
					className='items-start'
					onClick={() => setModalActive(false)}
				/>
			</div>
			<h2 className='text-xl mb-[5px] text-royalBlue'>
				Идеальное пространство для музыки
			</h2>
			<h3 className='mb-[20px] text-royalBlue'>
				Где каждая нота находит своё место
			</h3>
			{/* Выбор аватара */}
			<div className='mb-[20px]'>
				<div className='flex gap-5'>
					<div className='w-[50px] h-[50px] flex justify-center items-center border border-royalBlue rounded-full'>
						<ImHeadphones
							size={25}
							color='#1B89D3'
						/>
					</div>
					<div className='flex flex-col justify-center'>
						<h3>
							Добро пожаловать
						</h3>
						<h2 className='text-sm'>
							Мы рады, что вы с нами
						</h2>
					</div>
				</div>
				{/* Отображение ошибок валидации фото */}
				{errors.photo &&
					<span className='text-sm text-errorText'>
						{(errors.photo as FieldError).message}
					</span>}
			</div>
			{/* Поля для авторизации */}
			<div className="flex flex-col gap-5">
				{/* Поле для ввода логина */}
				<div>
					<InputComponent
						id='login'
						icon={<FaAddressCard />}
						placeholder='Введите логин...'
						{...register('login', loginValidation())}
					/>
					{errors.login &&
						<span className='text-sm text-errorText'>
							{(errors.login as FieldError).message}
						</span>}
				</div>
				{/* Поле для пароля */}
				<div>
					<InputComponent
						id='password'
						icon={<RiLockPasswordFill />}
						placeholder='Введите пароль...'
						type={showPassword ? 'text' : 'password'}
						icon2={<button
							type='button'
							onClick={toggleShowPassword}
						>
							{showPassword ?
								<IoMdEyeOff size={20} /> :
								<IoMdEye size={20} />}
						</button>}
						{...register('password', passwordValidation())}
					/>
					{errors.password &&
						<span className='text-sm text-errorText'>
							{(errors.password as FieldError).message}
						</span>}
				</div>
				{/* Чекбокс запомнить меня */}
				<div className='flex items-center'>
					<input
						id='rememberMe'
						type='checkbox'
						checked={rememberMe}
						onChange={() => setRememberMe(!rememberMe)}
						className='mr-2'
					/>
					<label htmlFor='rememberMe'>
						Запомнить меня
					</label>
				</div>
				{/* Кнопка авторизации */}
				<ButtonComponent
					icon={<IoIosArrowForward />}
					className='border-royalBlue mb-[10px] mt-[10px]'
					loading={loading}
				>
					{loading ? '' : 'Войти'}
				</ButtonComponent>
			</div>
		</form>
	);
};