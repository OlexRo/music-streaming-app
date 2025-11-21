//Функциональный компонент
import { FC } from 'react';
// React-components
import { CardFromComponent } from '../../../containers/cardFromComponent/CardFromComponent.tsx';
import { UserComponent } from '../../../object/userComponent.tsx';
import { useShowAllUser } from '../../../../utils/axios/useShowAllUsers.tsx';
import { formatDates } from '../../../../utils/formatDateUtils.ts';

export const AllUserComponent: FC = () => {
	// Получение данных пользователей
	const { users } = useShowAllUser();

	return (
		<CardFromComponent title='ВСЕ ПОЛЬЗОВАТЕЛИ'>
			<div className='w-full flex flex-col gap-5 h-[330px] overflow-auto custom-scrollbar'>
				{users
					.filter((user) => user.role !== 'admin')
					.map((user, index) => {
						const formattedDate = formatDates(user.date);
						return (
							<UserComponent
								key={index}
								index={String(index + 1).padStart(2, '0')}
								src={`http://localhost:5000/uploads/imageUser/${user.photo}`}
								login={user.login}
								surname={user.surname}
								name={user.name}
								role={user.role === 'user' ? 'Пользователь' : 'Администратор'}
								date={formattedDate}
								userId={user.id}
								initialStatus={user.status}
							/>
						);
					})}
			</div>
		</CardFromComponent>
	);
};

