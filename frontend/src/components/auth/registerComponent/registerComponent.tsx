// Функциональный компонент
import {
	FC,
	ChangeEvent,
	useState
} from 'react';
// Работа с запросами
import axios from 'axios';
// Интерфейсы
import {
	IFormsDataRegister,
	IRegister,
	IRegisterResponse
} from './registerComponent.interface.ts';
// Работа с формой
import {
	useForm,
	SubmitHandler,
	FieldError,
} from 'react-hook-form';
// React-icons
import { RiLockPasswordFill } from 'react-icons/ri';
import {
	IoIosArrowForward,
	IoMdEye,
	IoMdEyeOff
} from 'react-icons/io';
import { FaAddressCard } from 'react-icons/fa';
import { TbCameraUp } from 'react-icons/tb';
import { MdInsertPhoto } from 'react-icons/md';
// React-components
import { ButtonComponent } from '../../ui/buttonComponent/buttonComponent.tsx';
import { LogoComponent } from '../../ui/logoComponent/logoComponent.tsx';
import { InputComponent } from '../../ui/inputComponent/inputComponent.tsx';
// Импорт функций валидации
import {
	passwordValidation,
	loginValidation,
	nameValidation,
	surnameValidation,
} from '../../../utils/registerUtils.ts';
// Импорт reCAPTCHA
import ReCAPTCHA from 'react-google-recaptcha';

export const RegisterComponent: FC<IRegister> = ({
		setModalActive,
		setPSDWindowActive,
		onMassage
	}) => {

	// Анимация загрузки
	const [loading, setLoading] = useState(false);
	const [captchaValue, setCaptchaValue] = useState<string | null>(null); // Для хранения значения капчи

	// Показ и сокрытие пароля
	const [showPassword, setShowPassword] = useState(false);
	const isShowPassword = () => {
		setShowPassword(!showPassword);
	};

	// Добавление фото
	const [label, setLabel] = useState<JSX.Element | string>('Выберите фото');
	const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<IFormsDataRegister>();

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setValue('photo', event.target.files);
			setLabel(<div className='flex items-center justify-center gap-1'>
				<MdInsertPhoto
					color='#1B89D3'
					size={18}
				/>
				Фото добавлено
			</div>);
		} else {
			setLabel('Выберите фото');
		}
	};

	// Получаем текущее значение пароля для проверки
	const password = watch('password');

	// Отправка данных на сервер
	const onSubmit: SubmitHandler<IFormsDataRegister> = async (data: IFormsDataRegister) => {
		if (!captchaValue) {
			onMassage('Пожалуйста, пройдите проверку reCAPTCHA');
			return;
		}

		const { login, surname, name, password, photo } = data;
		const formData = new FormData();
		formData.append('login', login);
		formData.append('surname', surname);
		formData.append('name', name);
		formData.append('password', password);
		formData.append('photo', photo[0]);
		formData.append('captcha', captchaValue); // Добавление значения капчи в форму
		try {
			await axios.post<IRegisterResponse>('http://localhost:5000/auth/register', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setLoading(true);
			setTimeout(() => {
				setLoading(false);
				setModalActive(false);
				setPSDWindowActive(true);
				onMassage('Вы успешно зарегистрировались')
			}, 1000);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				onMassage(`${error.response.data.message || 'Произошла ошибка'}`)
			} else {
				onMassage('Произошла неизвестная ошибка ')
			}
		}
	};

	return (
		<form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
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
					<label
						htmlFor='file-upload'
						className='cursor-pointer'
					>
						<div className='w-[50px] h-[50px] flex justify-center items-center border border-royalBlue rounded-full'>
							<TbCameraUp
								size={30}
								color='#1B89D3'
							/>
						</div>
					</label>
					<input
						id='file-upload'
						type='file'
						className='hidden'
						accept='image/*'
						onChange={handleFileChange}
					/>
					<div className='flex flex-col justify-center'>
						<h3>
							Ваша аватарка
						</h3>
						<h2 className='text-sm'>
							{label}
						</h2>
					</div>
				</div>
				{/* Отображение ошибок валидации фото */}
				{errors.photo &&
					<span className='text-sm text-errorText'>
						{(errors.photo as FieldError).message}
					</span>}
			</div>
			{/* Поля для регистрации */}
			<div className='flex flex-col gap-5'>
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
				{/* Поле для имени */}
				<div>
					<InputComponent
						id='name'
						icon={<FaAddressCard />}
						placeholder='Введите имя...'
						{...register('name', nameValidation())}
					/>
					{errors.name &&
						<span className='text-sm text-errorText'>
							{(errors.name as FieldError).message}
						</span>}
				</div>
				{/* Поле для фамилии */}
				<div>
					<InputComponent
						id='surname'
						icon={<FaAddressCard />}
						placeholder='Введите фамилию...'
						{...register('surname', surnameValidation())}
					/>
					{errors.surname &&
						<span className='text-sm text-errorText'>
							{(errors.surname as FieldError).message}
						</span>}
				</div>
				{/* Поле для пароля */}
				<div>
					<InputComponent
						id='password'
						icon={<RiLockPasswordFill />}
						placeholder='Введите пароль...'
						type={showPassword ?
							'text' :
							'password'}
						icon2={<button
							type='button'
							onClick={isShowPassword}
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
				{/* Поле для повтора пароля */}
				<div>
					<InputComponent
						id='confirmPassword'
						icon={<RiLockPasswordFill />}
						placeholder='Повторите пароль...'
						type={showPassword ?
							'text' :
							'password'}
						{...register('confirmPassword', {
							required: 'Повторите пароль',
							validate: value =>
								value === password || 'Пароли не совпадают'
						})}
					/>
					{errors.confirmPassword &&
						<span className='text-sm text-errorText'>
							{(errors.confirmPassword as FieldError).message}
						</span>}
				</div>
			</div>
			{/* reCAPTCHA */}
			<div className='mt-[20px] flex justify-center items-center'>
				<ReCAPTCHA
					sitekey="6Lcj7GoqAAAAAER-2icYZR25fb9UjpviJ8XiLOHe"
					onChange={setCaptchaValue}
				/>
			</div>
			{/* Кнопка отправки формы */}
			<ButtonComponent
				className='border-royalBlue mb-[10px] mt-[10px]'			>
				{loading ? 'Загрузка...' : 'Зарегистрироваться'}
				<IoIosArrowForward
					size={20}
				/>
			</ButtonComponent>
		</form>
	);
};