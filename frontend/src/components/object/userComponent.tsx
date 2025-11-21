import { FC, useState, useMemo } from 'react';
import axios from 'axios';
import { TbLockOff, TbLockOpen } from 'react-icons/tb';
import Cookies from 'js-cookie';

// Интерфейс для свойств компонента UserComponent
interface IUserComponent {
	index?: string;
	src?: string;
	name?: string;
	surname?: string;
	login?: string;
	status?: string;
	onClick?: () => void;
	date?: string;
	role?: string;
	userId: number | string | undefined; 
	initialStatus: string;
	showStatus?: boolean;
	isToggleButtonVisible?: boolean;
	bun?: string;
}

// Основной компонент UserComponent
export const UserComponent: FC<IUserComponent> = ({
		index,
		src,
		login,
		onClick,
		date,
		role,
		userId,
		initialStatus,
		showStatus = true, // по умолчанию статус отображается
		isToggleButtonVisible = true, // по умолчанию кнопка видима
		bun, // принимаем bun, если передан
	}) => {

	const [status2, setStatus] = useState(initialStatus); // состояние для статуса пользователя

	// Функция для переключения статуса и удаления сообщения
	const toggleStatusAndRemoveMessage = async () => {
		try {
			const token = Cookies.get('token'); // получаем токен из Cookies
			if (!token) return;

			// Если пользователь в бане, удаляем сообщение
			if (status2 === '1') {
				await axios.post(
				'http://localhost:5000/message/remove-message',
					{ userId },
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
			}

			// Запрос на обновление статуса пользователя
			const response = await axios.patch(
				`http://localhost:5000/user/update-status/${userId}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// Если статус обновлен успешно, изменяем его в состоянии
			if (response.status === 200) {
				const updatedStatus = status2 === '1' ? '0' : '1'; // меняем статус
				setStatus(updatedStatus); // обновляем статус в компоненте
			}
		} catch (error) {
			console.error('Ошибка при обновлении статуса или удалении сообщения', error);
		}
	};

	// Массив данных пользователя, созданный с использованием useMemo
	const USER_DATA = useMemo(
		() => [
			{ id: '1', title: `${login}` },
			{ id: '2', title: bun ?? (status2 === '1' ? 'В бане' : 'Не в бане') }, // статус или bun
			{ id: '3', title: `${date}` }, // дата
			{ id: '4', title: `${role}` }, // роль
		],
		[login, bun, status2, date, role] // зависимость для обновления при изменении этих значений
	);

	return (
		<div className='flex'>
			{/* Основная информация о пользователе */}
			<div className='flex justify-center w-full' onClick={onClick}>
				<div className='flex items-center gap-2'>
					{/* Индекс пользователя */}
					<span className='w-[20px] hidden smLitle:flex'>
						{index}
					</span>
					<span className='w-[48px] flex justify-center items-center'>
						{/* Изображение пользователя */}
						<img
							src={src}
							alt={login}
							title={login}
							className='w-[48px] h-[48px] object-cover rounded-full custom-shadow'
						/>
					</span>
				</div>
				{/* Отображение данных пользователя */}
				<div className='w-full flex justify-around items-center'>
					{USER_DATA.map((item) => (
						<div
							key={item.id}
							className={
								item.id === '3'
									? 'hidden my2xl:hidden inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px] cursor-pointer'
									: item.id === '4'
										? 'hidden my2xl:hidden myMd1:inline-block hidden overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px]'
										: item.id === '2' && !showStatus // скрыть статус, если showStatus равен false
											? 'hidden'
											: item.id === '2'
												? 'hidden sm:inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px]'
												: 'text-center inline-block sm:inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px]'
							}
						>
							<span>{item.title}</span>
						</div>
					))}
				</div>
			</div>
			{/* Кнопка переключения статуса пользователя */}
			{isToggleButtonVisible && (
				<div className='flex items-center justify-center gap-6'>
					<span className='w-[30px] flex justify-center items-center'>
						<button type='button' onClick={toggleStatusAndRemoveMessage}>
							{/* Отображение иконки статуса (замок) */}
							{status2 === '1' ? (
								<TbLockOff size={22} color='#D99C88' />
							) : (
								<TbLockOpen size={22} color='#4ab767' />
							)}
						</button>
					</span>
				</div>
			)}
		</div>
	);
};