//Функциональный компонент
import {
	FC, useCallback,
	useEffect,
	useState
} from 'react';
//Работа с запросами
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUserProfile } from '../../../utils/axios/useUserProfile.tsx';
//Интерфейсы
import {
	Album,
	IAlbumPage, Song,
} from './AlbumPage.ts';
//React-icons
import { MdFavoriteBorder } from 'react-icons/md';
//React-components
import { ButtonComponent } from '../../../components/ui/buttonComponent/buttonComponent.tsx';
import { CardFromComponent } from '../../../components/containers/cardFromComponent/CardFromComponent.tsx';
import { MusicComponent } from '../../../components/object/musicComponent/musicComponent.tsx';
import { SortSongsComponent } from '../../../components/smart/sortSongsComponent.tsx';
import { LoadingComponent } from '../../../components/ui/loadingComponent.tsx';

export const AlbumPage: FC<IAlbumPage> = ({
		selectSong,
		updateSongList,
		updateAlbumSongs
	}) => {

	//Получаем id
	const { albumId } = useParams();
	//Получение данных пользователя
	const profile = useUserProfile();
	//Получение данных альбома
	const [album, setAlbum] = useState<Album | null>(null);
	//Для хранения отсортированных песен
	const [sortedSongs, setSortedSongs] = useState<Song[]>([]);
	//Состояние для отслеживания загрузки
	const [loading, setLoading] = useState(true);
	//Количество песен в альбоме
	const songCount = album?.songs?.length || 0;
	//Вывод количества лайков
	const [favoriteSongs, setFavoriteSongs] = useState<Set<number>>(new Set());

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

	//Загрузка песен по категориям
	useEffect(() => {
		const fetchFavoriteSongs = async () => {
			try {
				const response = await axios.get('http://localhost:5000/favorite/all-favorites-public');
				const favoriteSongsSet = new Set<number>(response.data.map((fav: { songId: number }) => fav.songId));
				setFavoriteSongs(favoriteSongsSet);
			} catch (error) {
				console.error('Ошибка при загрузке избранных песен:', error);
			}
		};
		fetchFavoriteSongs().catch((error) => {
			console.error('Ошибка, попробуйте еще раз', error);
		});
	}, []);

	//Считаем количество песен в альбоме
	const favoriteCount = album?.songs.filter(song => favoriteSongs.has(song.id)).length || 0;

	//Получение данных альбома по albumId
	useEffect(() => {
		const fetchAlbum = async () => {
			setLoading(true); //Устанавливаем состояние загрузки в true перед началом загрузки
			try {
				const response = await axios.get(`http://localhost:5000/album/${albumId}`);
				const albumData = response.data;
				//Получение длительности для каждой песни альбома
				const songsWithDuration = await Promise.all(albumData.songs.map(async (song: Song) => {
					const duration = await getAudioDuration(`http://localhost:5000/uploads/songFiles/${song.songFile}`); // Путь к аудиофайлу
					return { ...song, duration }; //Добавляем длительность в объект песни
				}));
				setAlbum({ ...albumData, songs: songsWithDuration }); //Обновляем состояние альбома с длительностями песен
				updateAlbumSongs({ ...albumData, songs: songsWithDuration }); //Обновляем песни альбома
				updateSongList(songsWithDuration, `albumSongs_${albumId}`); //Обновляем список песен с длительностями
				setSortedSongs(songsWithDuration); //Изначально песни не сортированы
			} catch (error) {
				console.error('Ошибка при загрузке альбома:', error);
			} finally {
				setLoading(false); //Устанавливаем состояние загрузки в false после завершения загрузки
			}
		};
		fetchAlbum().catch((error) => {
			console.error('Ошибка, попробуйте еще раз', error);
		});
	}, [albumId, updateAlbumSongs, updateSongList]);

	//Функция для выбора правильной формы слова песня
	const getSongWordForm = (count: number) => {
		if (count % 10 === 1 && count % 100 !== 11) {
			return 'песня';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			return 'песни';
		} else {
			return 'песен';
		}
	};

	//Функция для выбора правильной формы слова лайк
	const getLikeWordForm = (count: number) => {
		if (count % 10 === 1 && count % 100 !== 11) {
			return 'лайк';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			return 'лайка';
		} else {
			return 'лайков';
		}
	};

	return (
		<main className='custom-scrollbar overflow-y-auto'>
				{loading ? (
					<LoadingComponent />
				) : (
					<>
						<div>
							<div className='flex flex-col items-center gap-5 md:flex-row justify-between'>
								<img
									src={album?.photo
										? `http://localhost:5000/uploads/albumPhoto/${album?.photo}`
										: 'path_to_default_image'}
									alt={album?.title}
									title={album?.title}
									className='w-[270px] h-[200px] rounded-[10px] object-cover custom-shadow'
								/>
								<div className='w-full h-auto flex flex-col justify-between items-center gap-2 md:gap-2 md:items-start'>
									<h1
										className='text-2xl text-royalBlue inline-block overflow-hidden text-ellipsis whitespace-nowrap'>
										{album?.title}
									</h1>
									<h2>
										{album?.singer.name}
									</h2>
									<h2
										className="w-[250px] sm:w-[370px] md:w-full text-center md:text-left overflow-hidden"
										style={{
											display: '-webkit-box',
											WebkitBoxOrient: 'vertical',
											WebkitLineClamp: 2, // Ограничиваем до 3 строк
											lineClamp: 3, // Для совместимости с другими браузерами
										}}
									>
										{album?.description}
									</h2>
									<h2>
										{album?.yearRelease} год
									</h2>
									<div className='w-full gap-5 flex flex-col md:flex-row items-center justify-center md:justify-start'>
										<ButtonComponent className='w-[150px] border-royalBlue'>
											Прослушать
										</ButtonComponent>
										<span className='flex items-center gap-3'>
												<MdFavoriteBorder size='20'/>
											{favoriteCount} {getLikeWordForm(favoriteCount)}
											</span>
										<span className='flex items-center gap-5'>
												<span className='text-2xl'>&#8226;</span>
											{songCount} {getSongWordForm(songCount)}
											</span>
									</div>
								</div>
							</div>
							{/*Песни из альбома*/}
							<CardFromComponent
								title='ВСЕ ПЕСНИ ИЗ АЛЬБОИА'
								className='mt-12'
								allCategory={<SortSongsComponent/>}
							>
								<div className='w-full flex flex-col gap-5'>
									{sortedSongs?.map((song, index) => (
										<MusicComponent
											key={index}
											onClick={() => selectSong(`albumSongs_${albumId}`, index)}
											index={String(index + 1).padStart(2, '0')}
											src={
												song?.photo
													? `http://localhost:5000/uploads/songPhoto/${song.photo}`
													: 'path_to_default_image'
											}
											title={song.title}
											singer={song.album.singer.name}
											album={song.album.title}
											category={song?.category?.title}
											songId={song.id}
											userId={profile?.id}
											className='flex justify-center items-center'
											duration={formatDuration(song.duration ?? 0)}
										/>
									))}
								</div>
							</CardFromComponent>
						</div>
					</>
				)}
		</main>
	);
};