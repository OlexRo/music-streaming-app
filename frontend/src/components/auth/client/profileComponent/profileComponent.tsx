//Функциональный компонент
import {
	FC,
	ReactNode,
	useState
} from 'react';
//Работа с запросами
import { useUserProfile } from '../../../../utils/axios/useUserProfile.tsx';
//React-icons
import {
	FaCalendarAlt,
	FaUser
} from 'react-icons/fa';
//React-components
import { ModalComponent } from '../../../modal/modalComponent/modalComponent.tsx';
import { UpdateUserForm } from '../../form/update/updateUserComponent/UpdateUserComponent.tsx';
//Функция работы с датой
import { formatDates } from '../../../../utils/formatDateUtils.ts';

interface IProfileComponent {
	className?: string,
	className2?: string,
	children?: ReactNode,
}

export const ProfileComponent:FC<IProfileComponent> = ({
		className,
		className2,
		children
	}) => {

	//Получение данных пользователя
	const profile = useUserProfile();
	//Оптимизация для модального окна
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	//Форматированная дата
	const formattedDate = formatDates(profile?.date);

	return (
		<div className={
			`flex flex-col sm:flex-row gap-2 my3xl:gap-10 justify-between
			${className}`}
		>
			{/*Аватарка с логином пользователя*/}
			<div className='flex flex-col items-center'>
				{/*Аватарка пользователя*/}
				<div className='flex justify-center items-center w-[120px] h-[120px] relative'>
					<img
						src={profile?.photo
							? `http://localhost:5000/uploads/imageUser/${profile.photo}`
							: 'path_to_default_image'}
						alt={profile?.login}
						title={profile?.login}
						className='w-[100px] h-[100px] rounded-full'
					/>
					<div
						className='absolute w-[120px] h-[120px] rounded-full border-[4px] border-royalBlue'
						style={{clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'}}
					>
					</div>
				</div>
				{/*Логин пользователя*/}
				<span className='text-royalBlue'>
					{profile?.login}
				</span>
			</div>
			{/*Данные пользователя и кнопка редактирования */}
			<div className={`flex flex-col items-center gap-2 sm:gap-0 sm:items-start justify-between ${className2}`}>
				<span>
					{profile?.surname} {profile?.name}
				</span>
				<span className='flex items-center gap-2 my-2'>
					<FaUser/>
					{profile?.role === 'user' ?
						'Пользователь' :
						'Администратор'}
				</span>
				<span className='flex items-center gap-2'>
					<FaCalendarAlt/>
					{formattedDate}
				</span>
				{children}
				{isEditModalOpen && (
					<ModalComponent
						active={isEditModalOpen}
						setActive={setEditModalOpen}
						className='absolute border-royalBlue mb-[10px] mt-[10px]'
					>
						<UpdateUserForm/>
					</ModalComponent>
				)}
			</div>
		</div>
	);
};