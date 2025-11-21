//Функциональный компонент
import {
	ChangeEvent,
	FC,
	useCallback,
	useEffect,
	useState
} from 'react';
//Работа с запросами
import axios from 'axios';
//React-icons
import { IoSearch } from 'react-icons/io5';
import { ModalComponent } from '../modal/modalComponent/modalComponent.tsx';
//React-components
import { Song } from '../../pages/main/explore/Explore.ts';
import { MusicComponent } from '../object/musicComponent/musicComponent.tsx';
import { useUserProfile } from '../../utils/axios/useUserProfile.tsx';

// Интерфейс для SearchComponent
export interface ISearchComponent {
	selectSong: (listName: string, songIndex: number) => void;
	updateSongList: (songs: Song[], listName: string) => void;
}
export const SearchComponent: FC<ISearchComponent> = ({
		selectSong,
		updateSongList,
	}) => {
	//Состояние для поискового запроса
	const [searchQuery, setSearchQuery] = useState<string>('');
	//Состояние для результатов запроса
	const [searchResults, setSearchResults] = useState<Song[]>([]);
	//Состояние для модального окна
	const [isModalOpen, setModalOpen] = useState<boolean>(false);
	//Состояние для второго окна
	const [isModalOpen1, setModalOpen2] = useState<boolean>(false);
	//Получение данных пользователя
	const profile = useUserProfile();

	//Функция для формирования правильного времени для песни
	const formatDuration = useCallback((seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	}, []);

	//Загрузка аудиофайла
	const getAudioDuration = (url: string): Promise<number> => {
		return new Promise((resolve, reject) => {
			const audio = new Audio(url);
			audio.addEventListener('loadedmetadata', () => {
				resolve(audio.duration);
			});
			audio.addEventListener('error', (e) => {
				console.error('Ошибка при загрузке аудиофайла:', e);
				reject(e);
			});
		});
	};

	//Работа с полем для поиска
	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	//Функция для загрузки песен
	const handleSearch = useCallback(async () => {
		if (!searchQuery.trim()) {
			return;
		}
		try {
			const response = await axios.get<Song[]>(`http://localhost:5000/song/search?query=${searchQuery}`);
			const songs = response.data;
			const songsWithDurationPromises = songs.map(async (song: Song) => {
				const duration = await getAudioDuration(`http://localhost:5000/uploads/songFiles/${song.songFile}`);
				return { ...song, duration };
			});
			const songsWithDuration = await Promise.all(songsWithDurationPromises);
			setSearchResults(songsWithDuration);
			updateSongList(songsWithDuration, `searchSongList_${searchQuery.replace(/\s+/g, '_')}`);
		} catch (error) {
			console.error('Ошибка при поиске песен:', error);
		}
	}, [searchQuery, updateSongList]);

	//Проверяем, что searchQuery не пустая
	useEffect(() => {
		if (searchQuery.trim()) {
			handleSearch().catch(error => {
				console.error('Ошибка получения песен по жанрам:', error);
			});
		}
	}, [searchQuery, handleSearch]);

	return (
		<>
			<div className='hidden md:flex items-center gap-2 border-b-[1px] border-[#DCDCDC] bg-crayola'>
				<IoSearch
					size={20}
					className='cursor-pointer'
					onClick={() => {
						handleSearch().catch(error => {
							console.error('Ошибка вывода', error);
						});
						setModalOpen(true);
					}}
				/>
				<input
					type='text'
					placeholder='Поиск...'
					className='w-80 text-gray-700 bg-crayola focus:outline-none'
					value={searchQuery}
					onChange={handleInputChange}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							handleSearch().catch(error => {
								console.error('Ошибка вывода', error);
							});
							setModalOpen(true);
						}
					}}
				/>
			</div>
			<button
				type='button'
				title='Поиск'
				onClick={() => {
					handleSearch().catch(error => {
						console.error('Ошибка вывода', error);
					});
					setModalOpen2(true);
				}}
			>
				<IoSearch
					title='Поиск'
					size={25}
					className='block md:hidden transition-all cursor-pointer hover:text-royalBlue'
				/>
			</button>
			{/* Модальное окно для поиска на маленьких экранах */}
			<ModalComponent
				active={isModalOpen1}
				setActive={setModalOpen2}
				classNameModal='w-auto max-h-[800px] overflow-hidden	 px-10'
			>
				<div className='flex items-center gap-2 border-b-[1px] border-[#DCDCDC] bg-crayola'>
					<IoSearch
						size={20}
						className='cursor-pointer'
						onClick={() => {
							handleSearch().catch(error => {
								console.error('Ошибка вывода', error);
							});
							setModalOpen(true);
						}}
					/>
					<input
						type='text'
						placeholder='Поиск...'
						className='w-80 text-gray-700 bg-crayola focus:outline-none'
						value={searchQuery}
						onChange={handleInputChange}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								handleSearch().catch(error => {
									console.error('Ошибка вывода', error);
								});
								setModalOpen(true);
							}
						}}
					/>
				</div>
			</ModalComponent>
			{/* Модальное окно с результатами поиска */}
			<ModalComponent
				active={isModalOpen}
				setActive={setModalOpen}
				classNameModal='w-[1000px] myXl2:w-[800px] max-h-[800px] overflow-hidden px-10'
			>
				<h2 className='text-lg mb-7'>
					РЕЗУЛЬТАТЫ ПОИСКА
				</h2>
				<div className='w-full max-h-[700px] custom-scrollbar overflow-x-hidden flex flex-col gap-5'>
					{searchResults.length > 0 ? (
						searchResults.map((song, index) => (
							<MusicComponent
								key={index}
								onClick={() => selectSong(`searchSongList_${searchQuery.replace(/\s+/g, '_')}`, index)}
								index={String(index + 1).padStart(2, '0')}
								src={song?.photo
									? `http://localhost:5000/uploads/songPhoto/${song.photo}`
									: 'path_to_default_image'}
								title={song?.title || 'Название не указано'}
								album={song?.album?.title || 'Альбом не указан'}
								singer={song?.album?.singer?.name || 'Исполнитель не указан'}
								category={song.category.title || 'Категория не указана'}
								songId={song.id}
								userId={profile?.id}
								className='flex justify-center items-center'
								duration={formatDuration(song.duration ?? 0)}
							/>
						))
					) : (
						<li className='flex justify-center items-center'>
							Нет результатов
						</li>
					)}
				</div>
			</ModalComponent>
		</>
	);
};

