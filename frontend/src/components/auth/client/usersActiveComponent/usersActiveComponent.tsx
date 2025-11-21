//Функциональный компонент
import {
	FC,
	useCallback
} from 'react';
//Работа с запросами
import { useShowAllUser } from '../../../../utils/axios/useShowAllUsers.tsx';
//React-components
import { CardFromComponent } from '../../../containers/cardFromComponent/CardFromComponent.tsx';

export const UsersActiveComponent:FC = () => {

	//Получение данных пользователей
	const { users } = useShowAllUser();

	//Фильтрация пользователей по ролям
	const admins = users.filter(user => user.role === 'admin');
	const regularUsers = users.filter(user => user.role === 'user');
	const banUsers = users.filter(user => user.status === '1');

	//Склонение слова админ
	const getAdminWordForm = useCallback((count: number) => {
		if (count % 10 === 1 && count % 100 !== 11) {
			return 'админ';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			return 'админа';
		} else {
			return 'админов';
		}
	}, []);

	//Склонение слова юзер
	const getUserWordForm = useCallback((count: number) => {
		if (count % 10 === 1 && count % 100 !== 11) {
			return 'юзер';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			return 'юзера';
		} else {
			return 'юзеров';
		}
	}, []);

	return (
		<CardFromComponent
			title='АКТИВНОСТЬ ПОЛЬЗОВАТЕЛЕЙ'
			className='w-wull sm:w-[350px] hidden my3_2xl:flex flex-col'
		>
			<div className='flex flex-col'>
				<div className='flex mb-3 justify-center my2xl:justify-start'>
					{users.filter(user => user.role !== 'admin').slice(0, 5).map((user, index) => (
							<div
								key={user.id}
								className={`${index > 0 
									? '-ml-4' 
									: ''}`}
							>
								<img
									src={`http://localhost:5000/uploads/imageUser/${user.photo}`}
									alt={user.login}
									className='w-12 h-12 rounded-full'
								/>
							</div>
						))}
				</div>
				<span className='flex justify-center my2xl:justify-start'>
					Оценка активности на сайте
				</span>
			</div>
			<div className='flex flex-col my2xl:flex-row gap-5 mt-2'>
				<div className='border border-royalBlue bg-adminColor text-royalBlue rounded-[5px] py-[2px] px-[10px]'>
					{admins.length} {getAdminWordForm(admins.length)}
				</div>
				<div className='border border-green bg-userColor text-green rounded-[5px] py-[2px] px-[10px]'>
					{regularUsers.length} {getUserWordForm(regularUsers.length)}
				</div>
				<div className='border border-red bg-banUser text-red rounded-[5px] py-[2px] px-[10px]'>
					{banUsers.length} в бане
				</div>
			</div>
		</CardFromComponent>
	);
};

