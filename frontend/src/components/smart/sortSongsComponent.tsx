//Функциональный компонент
import {
	FC,
	useState,
	useMemo,
	useCallback,
	useEffect,
} from 'react';
//Работа с запросами
import { useUserProfile } from '../../utils/axios/useUserProfile.tsx';
//React-icons
import {
	IoDownloadOutline,
	IoTimeOutline
} from 'react-icons/io5';
import { LuFolderHeart } from 'react-icons/lu';
import { TbSettingsExclamation } from 'react-icons/tb';
//Интерфейс
import { Song } from '../../pages/main/home/Home.interface.ts'

//Интерфейс для SortSongsComponent
interface ISortSongsComponentProps {
	songs?: Song[];
	setSortedSongs?: (sortedSongs: Song[]) => void;
}

export const SortSongsComponent: FC<ISortSongsComponentProps> = ({
		songs = [],
		setSortedSongs
	}) => {

	//Получение данных пользователя
	const profile = useUserProfile();

	//Состояния для хранения критерия и направления сортировки
	const [sortCriteria, setSortCriteria] = useState<string | null>(null); // Изначально нет критерия
	const [isAscending, setIsAscending] = useState<boolean>(true);

	//Данные для отображения заголовков
	const MUSIC_DATA = [
		{ id: '1', title: 'Песня', criteria: 'title' },
		{ id: '2', title: 'Альбом', criteria: 'album.title' },
		{ id: '3', title: 'Певец', criteria: 'album.singer.name' },
		{ id: '4', title: 'Категория', criteria: 'category.title' },
	];

	//Вспомогательная функция для получения вложенного значения с очисткой пробелов и приведением к нижнему регистру
	const getNestedValue = (obj: any, path: string): any => {
		const value = path.split('.').reduce((value, key) => value?.[key], obj);
		return typeof value === 'string' ? value.trim().toLowerCase() : value;
	};

	//Мемоизированная сортировка песен
	const sortedSongs = useMemo(() => {
		if (!songs) return [];
		if (!sortCriteria) return songs; // Если критерия нет, возвращаем оригинальный массив
		return [...songs].sort((a, b) => {
			const aValue = getNestedValue(a, sortCriteria) ?? '';
			const bValue = getNestedValue(b, sortCriteria) ?? '';

			if (aValue < bValue) return isAscending ? -1 : 1;
			if (aValue > bValue) return isAscending ? 1 : -1;
			return 0;
		});
	}, [songs, sortCriteria, isAscending]);

	//Обновляем отсортированный массив песен в родительском состоянии
	useEffect(() => {
		if (setSortedSongs) {
			setSortedSongs(sortedSongs);
		}
	}, [setSortedSongs, sortCriteria, isAscending]);

	//Функция для обработки клика и изменения критериев сортировки
	const handleSortClick = useCallback((criteria: string) => {
		setSortCriteria(criteria);
		setIsAscending(prev => !prev);
	}, []);

	//Рендер компонента сортировки
	const sortedSongsDisplay = useMemo(() => (
		<div className='flex justify-center w-full'>
			{/* Номер и картинка песни */}
			<div className='flex items-center gap-2'>
				<span className='w-[20px] hidden sm:flex justify-center items-center'>#</span>
				<span className='w-[48px] flex justify-center items-center'>Фото</span>
			</div>
			{/* Данные песни */}
			<div className='w-full flex justify-around items-center'>
				{MUSIC_DATA.map(item => (
					<div
						key={item.id}
						className={item.id === '2'
							? 'hidden xl:flex myXl2:hidden flex w-[90px] myXl2:w-[90px] myXl:w-[190px] cursor-pointer'
							: item.id === '4'
								? 'hidden myMd1:inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px] cursor-pointer'
								: item.id === '3'
									? 'hidden sm:inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px] cursor-pointer'
									: item.id === '1'
										? 'flex sm:inline-block justify-center w-[90px] myXl2:w-[90px] myXl:w-[190px] cursor-pointer'
										: 'inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[90px] myXl2:w-[90px] myXl:w-[190px] cursor-pointer' }
					>
						<button onClick={() => handleSortClick(item.criteria)}>
							{item.title}
						</button>
					</div>
				))}
			</div>
			{/* Иконки для избранного/скаченного/времени песни */}
			<div className='flex items-center justify-center gap-6'>
				<span className='w-[30px] flex justify-center items-center'><IoTimeOutline size={20} /></span>
				<span className="hidden sm:flex w-[20px] justify-center items-center"><LuFolderHeart size={20} /></span>
				<span className='hidden w-[20px] md:flex items-center justify-center'><IoDownloadOutline size={22} /></span>
				{profile?.role === 'admin' && (
					<span className='w-[20px] flex items-center justify-center'><TbSettingsExclamation size={22} /></span>
				)}
			</div>
		</div>
	), [handleSortClick, profile?.role]);

	return (
		<div className='pb-2 mb-3 border-b-[1px] border-[#DCDCDC] flex flex-col'>
			{sortedSongsDisplay}
		</div>
	);
};