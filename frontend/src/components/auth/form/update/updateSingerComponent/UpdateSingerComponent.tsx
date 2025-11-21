//Функциональный компонент
import {
	FC,
	useEffect,
	useState
} from 'react';
import Select, { components } from 'react-select';
import CountryFlag from 'react-country-flag';
//React-Cookie
import Cookies from 'js-cookie';
//Работа с запросами
import axios from 'axios';
import {
	useForm,
	SubmitHandler,
	FieldError
} from 'react-hook-form';
//React-component
import { InputComponent } from '../../../../ui/inputComponent/inputComponent.tsx';
import { ButtonComponent } from '../../../../ui/buttonComponent/buttonComponent.tsx';
import { PSDWindowComponent } from '../../../../modal/PSDWindowComponent/PSDWindowComponent.tsx';
//Массив со странами
import {countries} from '../../../../../utils/countryArray.ts';

//Интерфейс для UpdateSingerFormValues
interface IUpdateSingerFormValues {
	name: string;
	dateLive?: string;
	country?: string;
}

//Интерфейс для UpdateSingerProps
interface IUpdateSingerProps {
	id: number;
}

export const UpdateSingerForm: FC<IUpdateSingerProps> = ({ id }) => {

	//Анимация загрузки
	const [loading, setLoading] = useState(false);
	//Работа с фото
	const [photo, setPhoto] = useState<File | null>(null);
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
	} = useForm<IUpdateSingerFormValues>();

	//Вывод текущих данных певца
	useEffect(() => {
		const fetchSinger = async () => {
			try {
				//Получаем токен из cookie
				const token = Cookies.get('token');
				if (!token) return;
				const response = await axios.get(`http://localhost:5000/singer/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const singer = response.data;
				setValue('name', singer.name);
				setValue('dateLive', singer.dateLive);
				setValue('country', singer.country);
			} catch (error) {
				console.error('Ошибка', error);
			}
		};
		fetchSinger().catch(error => console.error('Ошибка вывода', error));
	}, [id, setValue]);

	//Кнопка для обновления
	const onSubmit: SubmitHandler<IUpdateSingerFormValues> = async (data) => {
		setLoading(true);
		try {
			// Получаем токен из cookie
			const token = Cookies.get('token');
			if (!token) return;
			const formData = new FormData();
			formData.append('name', data.name);
			if (data.dateLive) formData.append('dateLive', data.dateLive);
			if (data.country) formData.append('country', data.country);
			if (photo) formData.append('photo', photo);
			await axios.patch(`http://localhost:5000/singer/singer-update?id=${id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			});
			setPSDMessage('Певец успешно обновлен');
			setMessageType('success');
			setPSDWindowActive(true);
			setTimeout(() => setPSDWindowActive(false), 1000);
		} catch (error) {
			setPSDMessage('Ошибка при обновлении певца');
			setMessageType('error');
			setPSDWindowActive(true);
			setTimeout(() => setPSDWindowActive(false), 1000);
		} finally {
			setLoading(false);
		}
	};

	//Работа со странами
	const selectedCountry = watch('country');

	//Компонент отображения флагов
	const Option = (props: any) => (
		<components.Option {...props}>
			<CountryFlag
				countryCode={props.data.code}
				svg
				style={{ width: '20px', marginRight: '10px' }}
			/>
			{props.data.label}
		</components.Option>
	);

	return (
		<form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
			<PSDWindowComponent
				active={PSDWindowActive}
				setActive={setPSDWindowActive}
				message={PSDMessage}
				type={messageType}
			/>
			<div className='flex flex-col gap-5'>
				{/* Изменение имени */}
				<div>
					<InputComponent
						id='name'
						placeholder='Введите имя певца...'
						{...register('name', { required: 'Имя обязательно' })}
					/>
					{errors.name && (
						<span className='text-sm text-errorText'>
							{(errors.name as FieldError).message}
						</span>
					)}
				</div>
				{/* Изменение даты жизни */}
				<div>
					<InputComponent
						id='dateLive'
						placeholder='Введите дату жизни...'
						{...register('dateLive')}
					/>
				</div>
				{/* Изменение страны */}
				<div className='mb-5'>
					<Select
						options={countries}
						placeholder='Выберите страну...'
						onChange={(option) => setValue('country', option
							? option.label
							: '')}
						value={countries.find(c => c.label === selectedCountry) || null}
						getOptionLabel={(option) => option.label}
						getOptionValue={(option) => option.label}
						components={{Option}}
					/>
					{errors.country && (
						<span className='text-sm text-errorText'>
							{(errors.country as FieldError).message}
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
					className='border-royalBlue mb-[10px] mt-[10px]'
					loading={loading}
				>
					{loading ? '' : 'Обновить певца'}
				</ButtonComponent>
			</div>
		</form>
	);
};