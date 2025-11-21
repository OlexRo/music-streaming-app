//Функциональный компонент
import {
	FC,
	useCallback,
	useEffect,
	useState
} from 'react';
//Навигация по сайту
import { useNavigate } from 'react-router-dom';
//Интерфейсы
import {
	FavoriteSong,
	IHome,
	Song
} from './Home.interface.ts';
//Работа с Cookies
import Cookies from 'js-cookie';
//Работа с запросами
import axios from 'axios';
import { useUserProfile } from '../../../utils/axios/useUserProfile.tsx';
import { useShowLastSinger } from '../../../utils/axios/useShowLastSinger.tsx';
//React-component
import { MusicComponent } from '../../../components/object/musicComponent/musicComponent.tsx';
import { LayoutComponent } from '../../../components/containers/layoutComponent/layoutComponent.tsx';
import { CardFromComponent } from '../../../components/containers/cardFromComponent/CardFromComponent.tsx';
import { TopSingersComponent } from '../../../components/simple/topSingersComponent/topSingersComponent.tsx';
import { LastAlbumComponent } from '../../../components/simple/lastAlbumComponent/lastAlbumComponent.tsx';
import { SortSongsComponent } from '../../../components/smart/sortSongsComponent.tsx';
import { LoadingComponent } from '../../../components/ui/loadingComponent.tsx';
//Функции адаптации
import { useDisplayedSingers } from '../../../utils/adaptation/useDisplayedSingers.tsx';

export const Home: FC<IHome> = ({
		selectSong,
		updateSongList
	}) => {

	//Анимация загрузки
	const [loading, setLoading] = useState(true);
	//Работа с навигацией
	const navigate = useNavigate();
	//Получение данных певца
	const profile = useUserProfile();
	//Получение данных последних певцов
	const { lastSingers } = useShowLastSinger();
	//Адаптация для певцов
	const displayedSingers = useDisplayedSingers(lastSingers);
	//Работа с песями
	const [songs, setSongs] = useState<Song[]>([]);
	//Работа с популярными песнями из альбомов
	const [favoriteAlbums, setFavoriteAlbums] = useState<any[]>([]);
	//Популярные песни
	const [popularSongs, setPopularSongs] = useState<Song[]>([]);
	//Песни по жанрам для пользователя
	const [userGenreSongs, setUserGenreSongs] = useState<Song[]>([]);

	//Функция для формирования правильного времени для песни
	const formatDuration = useCallback((seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60); // Округляем до целого числа
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	}, []);

	//Функция для удаления песен
	const handleDeleteSong = useCallback(async (songId: number) => {
		//Получаем токен из cookie
		const token = Cookies.get('token');
		if (!token) return;
		try {
			if (!token || !songId) return;
			//Объект конфигурации запроса
			const config: { headers: { Authorization: string } } = {
				headers: {
					Authorization: `Bearer ${token}`,
				}
			};
			// Передайте объект конфигурации в запрос axios
			await axios.delete(`http://localhost:5000/song/delete-song/${songId}`, config);
			setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
		} catch (error) {
			console.error('Ошибка при удалении песни:', error);
		}
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

	//Получение всех избранных песен для вывода популярного альбома
	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				const response = await axios.get<FavoriteSong[]>('http://localhost:5000/favorite/all-favorites-public');
				const favorites = response.data;
				const albumMap: { [key: number]: { album: any; favoriteCount: number } } = {};
				favorites.forEach((favorite: any) => {
					const albumId = favorite.song.albumId;
					const album = favorite.song.album;
					if (albumMap[albumId]) {
						albumMap[albumId].favoriteCount++;
					} else {
						albumMap[albumId] = { album, favoriteCount: 1 };
					}
				});
				const albumList = Object.values(albumMap).sort(
					(a, b) => b.favoriteCount - a.favoriteCount
				);
				setFavoriteAlbums(albumList);
			} catch (error) {
				console.error('Ошибка при получении избранных песен:', error);
			}
		};
		fetchFavorites().catch(error => {
			console.error('Ошибка вывода', error);
		});
		const intervalId = setInterval(fetchFavorites, 3000);
		return () => clearInterval(intervalId);
	}, []);
	const mostFavoritesAlbum = favoriteAlbums.length > 0 ? favoriteAlbums[0] : null;
	const handleAlbumClick = useCallback((albumId: number | undefined) => {
		if (albumId !== undefined) {
			navigate(`/albumPage/${albumId}`);
		}
	}, [navigate]);
	const getLikeWordForm = useCallback((count: number) => {
		if (count % 10 === 1 && count % 100 !== 11) {
			return 'лайк';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			return 'лайка';
		} else {
			return 'лайков';
		}
	}, []);

	//Переход на страницу с певцами
	const handleSingerClick = useCallback((id: number) => {
		navigate(`/singer/${id}`);
	}, [navigate]);

	//Функция для получения песен
	const fetchSongs = useCallback(async (showLoading = false) => {
		if (showLoading) {
			setLoading(true); // Устанавливаем состояние загрузки только при первой загрузке или обновлении страницы
		}
		try {
			const response = await axios.get<Song[]>('http://localhost:5000/song/last-song');
			const songsWithDuration = await Promise.all(response.data.map(async (song: Song) => {
				const duration = await getAudioDuration(`http://localhost:5000/uploads/songFiles/${song.songFile}`); // Путь к аудиофайлу
				return { ...song, duration }; // Добавляем длительность в объект песни
			}));
			setSongs(songsWithDuration);
			updateSongList(songsWithDuration, 'Home_page_list1');
		} catch (error) {
			console.error('Ошибка при загрузке песен:', error);
		} finally {
			if (showLoading) {
				// Окончание загрузки после первой загрузки или обновления страницы
				setLoading(false);
			}
		}
	}, [updateSongList]);

	//Вывод всех песен
	useEffect(() => {
		fetchSongs(true).catch(error => {
			console.error('Ошибка вывода', error);
		});
		//Обновляем данные каждую секунду без показа анимации загрузки
		const intervalId = setInterval(() => fetchSongs(false), 3000);
		return () => clearInterval(intervalId);
	}, [fetchSongs]);

	//Рекомендации
	const fetchFavoritesAndGenreCounts = useCallback(async () => {
		try {
			//Получаем токен из cookie
			const token = Cookies.get('token');
			if (!token) return;
			//Запрашиваем избранные песни
			const favoriteResponse = await axios.get<FavoriteSong[]>('http://localhost:5000/favorite/all-favorites', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const favorites = favoriteResponse.data;
			//Запрашиваем скачанные песни
			const downloadResponse = await axios.get<FavoriteSong[]>('http://localhost:5000/download/all-downloads', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const downloadedSongs = downloadResponse.data;
			//Собираем все songId из избранных и скачанных песен
			const favoriteSongIds = favorites.map(favorite => favorite.song.id);
			const downloadedSongIds = downloadedSongs.map(download => download.song.id);
			//Подсчет количества песен по categoryId
			const categoryCountMap: { [categoryId: number]: number } = {};
			favorites.forEach((favorite: FavoriteSong) => {
				const categoryId = favorite.song.category.id;
				categoryCountMap[categoryId] = (categoryCountMap[categoryId] || 0) + 1;
			});
			//Массив с категориями, отсортированный по количеству песен
			const sortedCategories = Object.entries(categoryCountMap).sort(([, countA], [, countB]) => countB - countA);
			//Получаем по одной песне из каждой категории (жанра)
			const initialGenreSongsPromises = sortedCategories.map(async ([categoryId]) => {
				const genreResponse = await axios.get<Song[]>(`http://localhost:5000/song/all-Recommended?categoryId=${categoryId}&limit=3`);
				const songs = genreResponse.data;
				//Фильтруем песни, чтобы убрать те, которые уже есть в избранном или уже скачаны
				const validSongs = songs.filter(song => !favoriteSongIds.includes(song.id) && !downloadedSongIds.includes(song.id));
				//Берем первые три песни (если такие есть)
				const selectedSongs = await Promise.all(validSongs.slice(0, 3).map(async (song) => {
					const duration = await getAudioDuration(`http://localhost:5000/uploads/songFiles/${song.songFile}`);
					return { ...song, duration };
				}));
				return selectedSongs.length > 0 ? selectedSongs : null; //Возвращаем выбранные песни или null
			});
			//Ожидаем загрузку хотя бы одной песни для каждого жанра
			const initialGenreSongs = (await Promise.all(initialGenreSongsPromises)).flat().filter(song => song !== null);
			//Загружаем дополнительные песни для тех же жанров (опционально)
			const additionalSongsPromises = sortedCategories.slice(0, 3).map(async ([categoryId]) => {
				const genreResponse = await axios.get<Song[]>(`http://localhost:5000/song/all-Recommended?categoryId=${categoryId}`);
				return await Promise.all(genreResponse.data.map(async (song: Song) => {
					const duration = await getAudioDuration(`http://localhost:5000/uploads/songFiles/${song.songFile}`);
					return { ...song, duration }; // Добавляем длительность в объект песни
				}));
			});
			//Ожидаем загрузку всех дополнительных песен
			const additionalSongs = await Promise.all(additionalSongsPromises);
			//Фильтруем песни, чтобы убрать те, которые уже есть в избранном, уже скачаны или уже были добавлены в initialGenreSongs
			const recommendedSongs = additionalSongs.flat().filter(song =>
				song &&
				!favoriteSongIds.includes(song.id) &&
				!downloadedSongIds.includes(song.id) &&
				!initialGenreSongs.some(genreSong => genreSong.id === song.id)
			);
			//Объединяем песни из первой выборки с дополнительными песнями
			const finalSongList = [...initialGenreSongs, ...recommendedSongs];
			//Сохраняем песни в состояние
			setUserGenreSongs(finalSongList);
			updateSongList(finalSongList, 'Home_page_list4');
		} catch (error) {
			console.error('Ошибка при получении избранных песен и подсчета жанров:', error);
		} finally {
			setLoading(false); //Устанавливаем состояние загрузки в false после завершения загрузки
		}
	}, [updateSongList]);

	//Получение песен по жанрам
	useEffect(() => {
		fetchFavoritesAndGenreCounts().catch(error => {
			console.error('Ошибка получения песен по жанрам:', error);
		});
		const intervalId = setInterval(fetchFavoritesAndGenreCounts, 3000);
		return () => clearInterval(intervalId);
	}, [fetchFavoritesAndGenreCounts]);

	//Получение популярных песен
	const fetchPopularSongs = useCallback(async () => {
		try {
			//Выполняем запрос к API для получения списка любимых песен
			const response = await axios.get<FavoriteSong[]>('http://localhost:5000/favorite/all-favorites-public');
			const favorites = response.data; //favorites теперь массив объектов FavoriteSong
			//Подсчет количества каждого songId
			const songFrequencyMap = favorites.reduce((acc: any, item: FavoriteSong) => { //item имеет тип FavoriteSong
				const songId = item.song.id; //Получаем уникальный идентификатор песни
				if (!acc[songId]) {
					// Если такой songId еще не встречался, инициализируем его
					acc[songId] = { song: item.song, count: 0 };
				}
				acc[songId].count += 1; //Увеличиваем счетчик для этой песни
				return acc;
			}, {});
			//Преобразование в массив и сортировка по частоте и новизне
			const sortedSongs = Object.values(songFrequencyMap)
				.sort((a: any, b: any) => {
					//Сначала сортируем по частоте, затем по дате выпуска
					if (b.count === a.count) return b.song.date - a.song.date; //Сортировка по новизне
					return b.count - a.count; //Сортировка по частоте
				})
				.slice(0, 5) // Берем только первые 5 песен
				.map((item: any) => item.song); //Извлекаем сами песни из отсортированного массива
			// Получение длительности для каждой песни
			const songsWithDuration = await Promise.all(sortedSongs.map(async (song: Song) => {
				const duration = await getAudioDuration(`http://localhost:5000/uploads/songFiles/${song.songFile}`); //Путь к аудиофайлу
				return { ...song, duration }; //Добавляем длительность в объект песни
			}));
			//Устанавливаем популярные песни в состояние
			setPopularSongs(songsWithDuration);
			// Обновляем список песен в компоненте
			updateSongList(songsWithDuration, 'Home_page_list2');
		} catch (error) {
			//Обработка ошибок при загрузке популярных песен
			console.error('Ошибка при загрузке популярных песен:', error);
		}
	}, [updateSongList]);

	//Вывод самых популярных песен
	useEffect(() => {
		fetchPopularSongs().catch(error => {
			console.error('Ошибка воспроизведения:', error);
		});
		const intervalId = setInterval(() => {
			fetchPopularSongs().catch(error => {
				console.error('Ошибка воспроизведения:', error);
			});
		}, 3000);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<main className='custom-scrollbar overflow-y-auto'>
			{loading ? (
				<LoadingComponent/>
			) : (
				<LayoutComponent
					//Контент в левой части
					childrenLeft={
						<div>
							{/* Последняя добавленная песня */}
							{mostFavoritesAlbum && (
								<LastAlbumComponent
									onClick={() => handleAlbumClick(mostFavoritesAlbum.album.id)}
									singer={mostFavoritesAlbum.album.singer.name}
									songName={mostFavoritesAlbum.album.title}
									description={mostFavoritesAlbum.album.description}
									numberLikes={`${
										mostFavoritesAlbum.favoriteCount
									} ${getLikeWordForm(mostFavoritesAlbum.favoriteCount)}`}
								/>
							)}
							{/* Недавние певцы */}
							<CardFromComponent
								title='НОВЫЕ ПЕВЦЫ'
								showEvery='Показать всех...'
								href='/singers'
								className='mt-7'
							>
								<div className='flex justify-between'>
									{displayedSingers.map((item, index) => (
										<TopSingersComponent
											key={index}
											src={item?.photo
												? `http://localhost:5000/uploads/singerAvatar/${item.photo}`
												: 'path_to_default_image'}
											subtitle={item.name}
											onClick={() => handleSingerClick(item.id)}
										/>
									))}
								</div>
							</CardFromComponent>
							{/* Все песни */}
							<CardFromComponent
								title='ВСЕ ПЕСНИ'
								showEvery='Показать все...'
								href='/allMusic'
								allCategory={
									<SortSongsComponent
										songs={songs}
										setSortedSongs={setSongs}
									/>
								}
							>
								<div className='w-full flex flex-col gap-5'>
									{songs.map((song, index) => (
										<MusicComponent
											key={index}
											onClick={() => selectSong('Home_page_list1', index)}
											index={String(index + 1).padStart(2, '0')}
											src={song?.photo
												? `http://localhost:5000/uploads/songPhoto/${song.photo}`
												: 'path_to_default_image'}
											title={song.title}
											album={song.album.title}
											singer={song.album.singer.name}
											category={song.category.title}
											songId={song.id}
											userId={profile?.id}
											className='flex justify-center items-center'
											onDeleteSong={handleDeleteSong}
											duration={formatDuration(song.duration ?? 0)}
										/>
									))}
								</div>
							</CardFromComponent>
						</div>
					}
					//Контент в правой части
					childrenRight={
						<div>
							{/* Самые популярные песни */}
							<CardFromComponent
								title='САМЫЕ ПОПУЛЯРНЫЕ ПЕСНИ'
								allCategory={
									<SortSongsComponent
										songs={popularSongs}
										setSortedSongs={setPopularSongs}
									/>
								}
							>
								<div className='w-full flex flex-col gap-5'>
									{popularSongs.map((song, index) => (
										<MusicComponent
											key={index}
											onClick={() => selectSong('Home_page_list2', index)}
											index={String(index + 1).padStart(2, '0')}
											src={song?.photo
												? `http://localhost:5000/uploads/songPhoto/${song.photo}`
												: 'path_to_default_image'}
											title={song.title}
											singer={song.album.singer.name}
											category={song.category.title}
											songId={song.id}
											userId={profile?.id}
											className='flex justify-center items-center'
											duration={formatDuration(song.duration ?? 0)}
										/>
									))}
								</div>
							</CardFromComponent>
							{/* Рекомендации пользователя */}
							{userGenreSongs.length > 0 && (
								<CardFromComponent
									title='ВАШИ РЕКОМЕНДАЦИИ'
									allCategory={
										<SortSongsComponent
											songs={userGenreSongs}
											setSortedSongs={setUserGenreSongs}
										/>
									}
								>
									<div className='w-full flex flex-col gap-5'>
										{userGenreSongs.slice(0, 8).map((song, index) => (
											<MusicComponent
												key={index}
												onClick={() => selectSong('Home_page_list4', index)}
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
										))}
									</div>
								</CardFromComponent>
							)}
						</div>
					}
				/>
			)}
		</main>
	);
};
