//Функциональный компонент
import {
	FC,
	useCallback,
	useEffect,
	useState
} from 'react';
//Работа с запросами
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUserProfile } from '../../../utils/axios/useUserProfile.tsx';
//Интерфейсы
import {
	Category,
	ICategoryPage
} from './CategoryPage.ts';
//React-components
import { CardFromComponent } from '../../../components/containers/cardFromComponent/CardFromComponent.tsx';
import { MusicComponent } from '../../../components/object/musicComponent/musicComponent.tsx';
import { LayoutComponent } from '../../../components/containers/layoutComponent/layoutComponent.tsx';
import { SortSongsComponent } from '../../../components/smart/sortSongsComponent.tsx';
import { Song } from '../albumPage/AlbumPage.ts';
import { LoadingComponent } from '../../../components/ui/loadingComponent.tsx';

export const CategoryPage:FC<ICategoryPage> = ({
		selectSong,
		updateSongList,
		updateCategorySongs
	}) => {

	//Получение categoryId
	const { categoryId } = useParams();
	//Получение данных из категории
	const [category, setCategory] = useState<Category | null>(null);
	//Получение данных пользователя
	const profile = useUserProfile();
	//Для хранения отсортированных песен
	const [sortedSongs, setSortedSongs] = useState<Song[]>([]);
	//Состояние для отслеживания загрузки
	const [loading, setLoading] = useState(true);
	//Динамический путь для списков с песнями из категории по id
	const categorySongListName = `categorySongListName_${categoryId}`;

	//Функция для формирования правильного времени для песни
	const formatDuration = useCallback((seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60); // Округляем до целого числа
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	}, []);

	//Загрузка аудиофайла
	const getAudioDuration = (url: string): Promise<number> => {
		return new Promise((resolve, reject) => {
			const audio = new Audio(url);
			audio.addEventListener('loadedmetadata', () => {
				resolve(audio.duration); // Длительность в секундах
			});
			audio.addEventListener('error', (e) => {
				console.error('Ошибка при загрузке аудиофайла:', e);
				reject(e);
			});
		});
	};

	//Получение данных категории по categoryId
	useEffect(() => {
		const fetchCategory = async () => {
			setLoading(true); //Устанавливаем состояние загрузки
			try {
				const response = await axios.get(`http://localhost:5000/category/${categoryId}`);
				const categoryData = response.data;
				//Получение длительности для каждой песни в категории
				const songsWithDuration = await Promise.all(categoryData.songs.map(async (song: Song) => {
					const duration = await getAudioDuration(`http://localhost:5000/uploads/songFiles/${song.songFile}`); // Путь к аудиофайлу
					return { ...song, duration }; //Добавляем длительность в объект песни
				}));
				setCategory({ ...categoryData, songs: songsWithDuration }); //Обновляем состояние категории с длительностями песен
				updateCategorySongs({ ...categoryData, songs: songsWithDuration }); //Обновляем песни категории
				updateSongList(songsWithDuration, categorySongListName); //Обновляем список песен
				setSortedSongs(songsWithDuration); //Изначально песни не сортированы
			} catch (error) {
				console.error('Ошибка при загрузке категории:', error);
			} finally {
				setLoading(false); //Устанавливаем состояние загрузки в false после завершения загрузки
			}
		};
		fetchCategory().catch((error) => {
			console.error('Ошибка, попробуйте еще раз', error);
		});
	}, [categoryId, updateCategorySongs, updateSongList, categorySongListName]);

	return (
		<main className="custom-scrollbar overflow-y-auto">
			{loading ? (
				<LoadingComponent />
			) : (
				<LayoutComponent
					childrenLeft={
						<div>
							<CardFromComponent
								title='ВСЕ КАТЕГОРИИ'
								allCategory={<SortSongsComponent/>}
							>
								<div className='w-full flex flex-col gap-5'>
									{sortedSongs?.map((song, index) => (
										<MusicComponent
											key={song.id}
											onClick={() => selectSong(`categorySongListName_${categoryId}`, index)}
											index={String(index + 1).padStart(2, '0')}
											src={song.photo
												? `http://localhost:5000/uploads/songPhoto/${song.photo}`
												: 'path_to_default_image'}
											singer={song.album.singer.name}
											title={song.title}
											album={song.album.title}
											category={category?.title || 'Нет категории'}
											songId={song.id}
											userId={profile?.id}
											className='flex justify-center items-center'
											duration={formatDuration(song.duration ?? 0)}
										/>
									))}
								</div>
							</CardFromComponent>
						</div>
					}
				/>
			)}
		</main>
	);
};

