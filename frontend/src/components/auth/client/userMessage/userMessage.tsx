//Функциональный компонент
import {
	FC,
	useCallback,
	useState
} from 'react';
//React-components
import { ModalComponent } from '../../../modal/modalComponent/modalComponent.tsx';

//Интерфейс для UserMessage
interface IUserMessage {
	date: string;
	login: string;
	status: string;
	img: string;
	text: string;
}

export const UserMessage:FC<IUserMessage> = ({
		date,
		login,
		status,
		img,
		text,
	}) => {

	//Оптимизация для модального окна
	const [isEditModalOpen, setEditModalOpen] = useState(false);

	//Функция для открытия окна редактирования
	const openEditModal = useCallback(() => {
		setEditModalOpen(true);
	}, []);

	return (
		<div className='flex justify-center items-center flex-col w-[250px] h-[100px] bg-blockWhite border border-borderBlock rounded-[10px] cursor-pointer'>
			<div
				className='flex justify-center items-center gap-5 border-b border-b-borderBlock mb-2 p-2 w-[90%]'
				onClick={openEditModal}
			>
				<img
					src={img}
					title={login}
					alt={login}
					className="w-[48px] h-[48px] object-cover rounded-full custom-shadow"
				/>
				<div className='flex flex-col justify-between h-full'>
					<span>
						{login}
					</span>
					<span className='text-sm text-green'>
						{status}
					</span>
				</div>
			</div>
			<div className='flex justify-center items-center mb-2 text-sm'>
				{date}
			</div>
			<ModalComponent
				active={isEditModalOpen}
				setActive={setEditModalOpen}
				className='border-royalBlue mb-[10px] mt-[10px]'
			>
				{text}
			</ModalComponent>
		</div>
	);
};

