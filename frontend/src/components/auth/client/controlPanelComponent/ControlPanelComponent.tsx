//Функциональный компонент
import {
	FC,
	useState
} from 'react';
//React-components
import { CreateAlbumComponent } from '../../form/create/createAlbumComponent.tsx';
import { CreateSingerComponent } from '../../form/create/createSingerComponent.tsx';
import { CreateSongComponent } from '../../form/create/createSongComponent.tsx';
import { CreateCategoryComponent } from '../../form/create/createCategoryComponent.tsx';
import { CardFromComponent } from '../../../containers/cardFromComponent/CardFromComponent.tsx';
//React-icons
import { HiUsers } from 'react-icons/hi';
import { MdLibraryMusic } from 'react-icons/md';
import { IoMusicalNotes } from 'react-icons/io5';
import { TfiMenuAlt } from 'react-icons/tfi';

export const ControlPanelComponent: FC = () => {

	//Устанавливаем CreateSingerComponent как начальное значение
	const [componentToShow, setComponentToShow] = useState<JSX.Element | string>(<CreateSingerComponent />);
	//Состояния для создания форм
	const [activeButton, setActiveButton] = useState<string>('singer');

	//Функция для переключения между формами
	const handleClick = (component: JSX.Element | string, buttonName: string) => {
		setComponentToShow(component);
		setActiveButton(buttonName);
	};

	return (
		<CardFromComponent title='СТАТИСТИКА  ПОЛЬЗОВАТЕЛЕЙ'>
			<div className='p-7 border border-borderBlock bg-blockWhite rounded-[10px]'>
				<div className='mb-5 flex justify-between'>
					<button
						onClick={() => handleClick(<CreateSingerComponent/>, 'singer')}
						className={`w-[30px] border-royalBlue pb-[5px] flex justify-center 
						${activeButton === 'singer'
							? 'border-b-2 border-sky-500'
							: ''}`}
					>
						<HiUsers size={20}/>
					</button>
					<button
						onClick={() => handleClick(<CreateAlbumComponent />, 'album')}
						className={`w-[30px] border-royalBlue pb-[5px] flex justify-center 
						${activeButton === 'album'
							? 'border-b-2 border-sky-500'
							: ''}`}
					>
						<MdLibraryMusic size={20}/>
					</button>
					<button
						onClick={() => handleClick(<CreateCategoryComponent />, 'category')}
						className={`w-[30px] border-royalBlue pb-[5px] flex justify-center 
						${activeButton === 'category'
							? 'border-b-2 border-sky-500'
							: ''}`}
					>
						<TfiMenuAlt size={20}/>
					</button>
					<button
						onClick={() => handleClick(<CreateSongComponent />, 'song')}
						className={`w-[30px] border-royalBlue pb-[5px] flex justify-center 
						${activeButton === 'song'
							? 'border-b-2 border-sky-500'
							: ''}`}
					>
						<IoMusicalNotes size={20}/>
					</button>
				</div>
				<div>
					{typeof componentToShow === 'string'
						? <h1>
							{componentToShow}
						</h1>
						: componentToShow}
				</div>
			</div>
		</CardFromComponent>
	);
};
