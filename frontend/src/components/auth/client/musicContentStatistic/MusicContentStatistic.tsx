//Функциональный компонент
import {
	FC,
	useCallback
} from 'react';
//Работа с запросами
import { useShowAlbum } from '../../../../utils/axios/useShowAlbum.tsx';
import { useShowSong } from '../../../../utils/axios/useShowSong.tsx';
import { useShowCategory } from '../../../../utils/axios/useShowCategory.tsx';
import { useShowSinger } from '../../../../utils/axios/useShowSinger.tsx';
//React-components
import { CardFromComponent } from '../../../containers/cardFromComponent/CardFromComponent.tsx';
//React-icons
import { IoMusicalNotes } from 'react-icons/io5';
import { TfiMenuAlt } from 'react-icons/tfi';
import { HiUsers } from 'react-icons/hi';
import { MdLibraryMusic } from 'react-icons/md';

export const MusicContentStatistic:FC = () => {

	//Получение данных альбома
	const { albums } = useShowAlbum();
	//Получение данных песни
	const song = useShowSong();
	//Получение данных категории
	const { categories } = useShowCategory();
	//Получение данных певца
	const { singers } = useShowSinger();

	//Количество альбомов
	const albumsCount = albums.length;
	//Количество песен
	const songsCount = song.length;
	//Количество категорий
	const categoriesCount = categories.length;
	//Количество певцов
	const singersCount = singers.length;

	//Функция для слова альбом
	const getAlbumWordForm = useCallback((count: number) => {
		if (count % 10 === 1 && count % 100 !== 11) {
			return 'Альбом';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			return 'Альбома';
		} else {
			return 'Альбомов';
		}
	}, []);

//Функция для слова песня
	const getSongWordForm = useCallback((count: number) => {
		if (count % 10 === 1 && count % 100 !== 11) {
			return 'Песня';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			return 'Песни';
		} else {
			return 'Песен';
		}
	}, []);

//Функция для слова категория
	const getCategoryWordForm = useCallback((count: number) => {
		if (count % 10 === 1 && count % 100 !== 11) {
			return 'Категория';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			return 'Категории';
		} else {
			return 'Категорий';
		}
	}, []);

//Функция для слова певец
	const getSingerWordForm = useCallback((count: number) => {
		if (count % 10 === 1 && count % 100 !== 11) {
			return 'Певец';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			return 'Певца';
		} else {
			return 'Певцов';
		}
	}, []);

	//Массив с данными для статистики
	const MUSIC_STATISTIC = [
		{
			icon: IoMusicalNotes,
			title: getSongWordForm(songsCount),
			number: songsCount
		},
		{
			icon: MdLibraryMusic,
			title: getAlbumWordForm(albumsCount),
			number: albumsCount
		},
		{
			icon: TfiMenuAlt,
			title: getCategoryWordForm(categoriesCount),
			number: categoriesCount
		},
		{
			icon: HiUsers,
			title: getSingerWordForm(singersCount),
			number: singersCount
		}
	]

	return (
		<CardFromComponent title='СТАТИСТИКА ПО САЙТУ'>
			<div className='flex flex-wrap gap-5 justify-around'>
				{MUSIC_STATISTIC.map((item, index) => (
					<div
						key={index}
						className='pl-[10px] justify-center myMd3:justify-start flex items-center gap-4 border border-borderBlock bg-blockWhite w-full myXl2:w-[250px] myMd2:w-[170px] my2xl:w-[170px] h-[70px] rounded-[10px]'
					>
						<div className='flex items-center justify-center w-[35px] h-[35px] border border-royalBlue rounded-[5px]'>
							{<item.icon
								size={20}
								color='#1B89D3'
							/>}
						</div>
						<div className='flex flex-col'>
						<span className='text-sm'>
							{item.title}
						</span>
							<span>
							{item.number}
						</span>
						</div>
					</div>
				))}
			</div>
		</CardFromComponent>
	);
};