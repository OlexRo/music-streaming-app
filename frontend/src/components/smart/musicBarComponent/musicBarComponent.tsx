import {
	FC,
	ChangeEvent,
	useEffect,
	useRef,
	useState
} from 'react';
// Интерфейс
import { IMusicBar } from './musicBarComponent.interface.ts';
// React-components
import { ModalComponent } from '../../modal/modalComponent/modalComponent.tsx';
// React-icons
import {
	FaCirclePause,
	FaCirclePlay
} from 'react-icons/fa6';
import { LiaRandomSolid } from 'react-icons/lia';
import {
	TbPlayerTrackNextFilled,
	TbPlayerTrackPrevFilled,
	TbRepeat,
	TbRepeatOff
} from 'react-icons/tb';
import {
	ImVolumeMedium,
	ImVolumeMute2
} from 'react-icons/im';

	export const MusicBarComponent: FC<IMusicBar> = ({
		currentSongIndex: initialSongIndex,
		currentSongListName,
		songLists,
		isPlaying,
		setIsPlaying
	}) => {

	//Локальный индекс текущей песни
	const [localSongIndex, setLocalSongIndex] = useState<number | undefined>(initialSongIndex);
	const [currentTime, setCurrentTime] = useState(0); // Текущее время воспроизведения
	const [duration, setDuration] = useState(0); // Продолжительность песни
	const [volume, setVolume] = useState(1); // Уровень громкости
	const [isMuted, setIsMuted] = useState(false); // Состояние отключения звука
	const [isLooping, setIsLooping] = useState(false); // Состояние повторного воспроизведения
	const [, setIsSeeking] = useState(false); // Состояние поиска позиции
	const audioRef = useRef<HTMLAudioElement>(null); // Ссылка на аудио элемент
	const [isAudioReady, setIsAudioReady] = useState(false); // Готовность аудио к воспроизведению

	//Оптимизация для модального окна
	const [isEditModalOpen, setEditModalOpen] = useState(false);

	//Безопасная проверка списка песен
	const safeSongLists = Array.isArray(songLists) ? songLists : [];
	const currentSongList = safeSongLists.find(list => list.listName === currentSongListName)?.songs || [];

	//Работа с шириной экрана
	const [isWideScreen, setIsWideScreen] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 1024px)');
		const handleMediaChange = (event: MediaQueryListEvent) => {
			setIsWideScreen(event.matches);
		};
		mediaQuery.addEventListener('change', handleMediaChange);
		//Инициализируем состояние
		setIsWideScreen(mediaQuery.matches);
		//Убираем обработчик при размонтировании
		return () => {
			mediaQuery.removeEventListener('change', handleMediaChange);
		};
	}, []);

	//Функция для открытия окна редактирования
	const openEditModal = () => {
		setEditModalOpen(true);
	}

	//Хук для отслеживания, была ли загружена первая песня
	const [isFirstSongLoaded, setIsFirstSongLoaded] = useState(false);

	//Эффект для загрузки первой песни при монтировании
	useEffect(() => {
		if (currentSongList.length > 0 && !isFirstSongLoaded) {
			// Первая песня в списке
			const firstSong = currentSongList[0];
			const fileUrl = `http://localhost:5000/uploads/songFiles/${firstSong.songFile}`;
			// Проверяем, если источник не изменился
			if (audioRef.current && audioRef.current.src !== fileUrl) {
				audioRef.current.src = fileUrl;
				audioRef.current.load();
				// Устанавливаем готовность аудио
				audioRef.current.addEventListener('loadedmetadata', () => {
					setDuration(audioRef.current!.duration);
					setIsAudioReady(true);
				});
				// Отмечаем, что первая песня загружена
				setIsFirstSongLoaded(true);
			}
		}
	}, [currentSongList, isFirstSongLoaded]);

	useEffect(() => {
		const audio = audioRef.current;
		if (audio && isPlaying) {
			const updateTime = () => setCurrentTime(audio.currentTime);
			audio.addEventListener('timeupdate', updateTime);
			return () => audio.removeEventListener('timeupdate', updateTime);
		}
	}, [isPlaying]);

	//Эффект для загрузки и воспроизведения аудио
	useEffect(() => {
		const audio = audioRef.current;
		if (audio && localSongIndex !== undefined && currentSongList[localSongIndex]) {
			const song = currentSongList[localSongIndex];
			const fileUrl = `http://localhost:5000/uploads/songFiles/${song.songFile}`;
			if (audio.src !== fileUrl) {
				audio.src = fileUrl;
				audio.load();
				setIsAudioReady(false);
				// Подписываемся на событие 'loadedmetadata' для корректного отображения длительности
				const handleLoadedMetadata = () => {
					setDuration(audio.duration); // Устанавливаем продолжительность
					setIsAudioReady(true); // Аудио готово к воспроизведению
				};
				audio.addEventListener('loadedmetadata', handleLoadedMetadata);
				const loadAndPlayAudio = async () => {
					try {
						await new Promise((resolve) => {
							audio.addEventListener('canplaythrough', resolve, { once: true });
						});
						if (isPlaying) {
							await audio.play();
						}
					} catch (error) {
						console.error('Ошибка воспроизведения:', error);
					}
				};
				loadAndPlayAudio().catch(error => {
					console.error('Ошибка загрузки аудио:', error);
				});
				return () => {
					audio.removeEventListener('loadedmetadata', handleLoadedMetadata); // Очищаем слушатель
				};
			} else if (isPlaying && isAudioReady) {
				audio.play().catch(error => {
					console.error('Ошибка воспроизведения:', error);
				});
			}
		} else {
			setIsPlaying(false);
		}
	}, [localSongIndex, currentSongList, isPlaying]);

	//Функция для перехода к следующей песне
	const nextSong = async () => {
		if (currentSongList.length > 0) {
			//Проверка на существование prevIndex перед его использованием
			setLocalSongIndex((prevIndex) => (prevIndex !== undefined ? (prevIndex + 1) % currentSongList.length : 0));
			setIsPlaying(true);
		}
	};

	//Функция для перехода к предыдущей песне
	const prevSong = async () => {
		if (currentSongList.length > 0) {
			//Аналогичная проверка на существование prevIndex
			setLocalSongIndex((prevIndex) => (prevIndex !== undefined
				? (prevIndex - 1 + currentSongList.length) % currentSongList.length
				: 0));
			setIsPlaying(true);
		}
	};

	//Эффект для управления воспроизведением на основе изменения isPlaying
	useEffect(() => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.play().catch((error) => {
					console.error('Ошибка воспроизведения:', error);
				});
			} else {
				audioRef.current.pause();
			}
		}
	}, [isPlaying]); // Убираем initialSongIndex

	//Логика для обновления индекса песни при выборе
	useEffect(() => {
		if (initialSongIndex !== undefined) {
			setLocalSongIndex(initialSongIndex);  // Обновляем индекс песни при выборе новой
		}
	}, [initialSongIndex]);

	//Эффект для обновления данных о песне и времени
	useEffect(() => {
		const audio = audioRef.current;
		if (audio) {
			const handleLoadedMetadata = () => {
				setDuration(audio.duration); // Установка продолжительности
				setVolume(audio.volume); // Установка громкости
			};
			const handleTimeUpdate = () => setCurrentTime(audio.currentTime); // Обновление текущего времени
			const handleEnded = () => {
				if (isLooping) {
					audio.currentTime = 0; // Начать сначала при повторе
					audio.play().catch(error => {
						console.error('Ошибка воспроизведения:', error);
					});
				} else {
					nextSong().catch(error => {
						console.error('Ошибка перехода к следующей песне:', error);
					});
				}
			};
			audio.addEventListener('loadedmetadata', handleLoadedMetadata);
			audio.addEventListener('timeupdate', handleTimeUpdate);
			audio.addEventListener('ended', handleEnded);
			return () => {
				audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
				audio.removeEventListener('timeupdate', handleTimeUpdate);
				audio.removeEventListener('ended', handleEnded);
			};
		}
	}, [isLooping, localSongIndex]);

	// Эффект для управления громкостью и состоянием воспроизведения
	useEffect(() => {
		const audio = audioRef.current;
		if (audio) {
			audio.volume = isMuted ? 0 : volume; // Изменение громкости при отключении звука
			if (isPlaying && isAudioReady) {
				audio.play().catch(error => {
					console.error('Ошибка воспроизведения:', error);
				});
			} else {
				audio.pause();
			}
		}
	}, [isPlaying, volume, isMuted, isAudioReady]);


	const handlePlayPause = () => {
		// Переключение состояния воспроизведения
		setIsPlaying(!isPlaying);
		if (!isPlaying) {
			// Если музыка не играет, пытаемся начать воспроизведение
			audioRef.current?.play().catch(error => {
				console.error('Ошибка вывода', error); // Обработка ошибки воспроизведения
			});
		} else {
			// Если музыка уже играет, ставим на паузу
			audioRef.current?.pause();
		}
	};

	const handleSeekStart = () => {
		// Начало перемотки (установки позиции воспроизведения)
		setIsSeeking(true);
		if (audioRef.current) {
			// Во время перемотки отключаем звук, чтобы не было звука
			audioRef.current.volume = 0;
		}
	};

	const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
		// Обновляем время воспроизведения при перемотке
		const newTime = parseFloat(event.target.value);
		if (audioRef.current) {
			// Устанавливаем новое время в аудио элементе
			audioRef.current.currentTime = newTime;
		}
		setCurrentTime(newTime); // Обновляем состояние текущего времени
	};

	const handleSeekEnd = () => {
		// Завершение перемотки
		setIsSeeking(false);
		if (audioRef.current) {
			// Восстанавливаем громкость после перемотки (с учётом состояния звука)
			audioRef.current.volume = isMuted ? 0 : volume;
		}
	};

	const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
		// Обновление уровня громкости
		const newVolume = parseFloat(event.target.value);
		setVolume(newVolume); // Обновляем состояние громкости
		if (audioRef.current) {
			// Устанавливаем новое значение громкости в аудио элементе
			audioRef.current.volume = newVolume;
		}
	};

	const toggleMute = () => {
		// Переключаем состояние звука (включить/выключить)
		setIsMuted(prev => !prev);
	};

	const toggleLoop = () => {
		// Переключаем режим повтора трека
		setIsLooping(prev => !prev);
	};

	const playRandomSong = () => {
		// Воспроизведение случайного трека из текущего плейлиста
		if (currentSongList.length > 0) {
			// Выбираем случайный индекс песни
			const randomIndex = Math.floor(Math.random() * currentSongList.length);
			// Устанавливаем новый индекс песни и начинаем воспроизведение
			setLocalSongIndex(randomIndex);
			setIsPlaying(true);
			setCurrentTime(0); // Обнуляем текущее время воспроизведения
		}
	};

	const formatTime = (timeInSeconds: number) => {
		// Форматирование времени в минуты и секунды
		const minutes = Math.floor(timeInSeconds / 60);
		const seconds = Math.floor(timeInSeconds % 60);
		// Возвращаем форматированное время с ведущим нулём для секунд
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

// Проверяем, если список песен пустой, возвращаем пустой элемент
	if (currentSongList.length === 0) {
		return <></>;
	}

// Получаем URL изображения обложки песни
	const photoUrl = (localSongIndex !== undefined && currentSongList[localSongIndex]?.photo)
		? `http://localhost:5000/uploads/songPhoto/${currentSongList[localSongIndex].photo}` // Если фото есть, формируем URL
		: 'path_to_default_image'; // Если фото нет, используем изображение по умолчанию

	return (
		<div className='h-20 w-full bg-blockWhite flex border-t border-r-[1px] border-[#DCDCDC]'>
			<div className='h-full w-full justify-around px-5 md:px-[60px] md:justify-between items-center flex'>
				<div
					className='flex items-center gap-5 w-full lg:w-auto'
					onClick={isWideScreen ? openEditModal : undefined}
				>
					{localSongIndex !== undefined && currentSongList[localSongIndex] ? (
						<>
							<img
								src={photoUrl}
								title={currentSongList[localSongIndex].title}
								alt={currentSongList[localSongIndex].title}
								className='w-[50px] h-[50px] rounded-[10px] object-cover'
							/>
							<div>
								<div className='flex items-center'>
									<h2 className='w-full lg:w-[120px] font-medium truncate'>
										{currentSongList[localSongIndex].title || 'Нет названия'}
									</h2>
								</div>
								<div className='flex items-center'>
									<h3 className='w-[80px] md:w-[120px] text-sm truncate'>
										{currentSongList[localSongIndex].album?.singer?.name || 'Нет группы'}
									</h3>
								</div>
							</div>
							<audio ref={audioRef}/>
						</>
					) : (
						<p>Нет доступной песни</p>
					)}
				</div>
				<div className='hidden lg:flex flex-col items-center'>
					<div className='h-12 w-230px xl:w-[430px] flex justify-center gap-1 md:gap-3 '>
						<div className='flex items-center gap-3 cursor-pointer'>
							<button onClick={playRandomSong}>
								<LiaRandomSolid size={20}/>
							</button>
							<button onClick={prevSong}>
								<TbPlayerTrackPrevFilled
									color='#1B89D3'
									size={25}
								/>
							</button>
							<button
								className='flex items-center justify-center w-[50px] h-[47px]'
								onClick={handlePlayPause}
							>
								{isPlaying ? (
									<FaCirclePause color='#1B89D3' size={30}/>
								) : (
									<FaCirclePlay color='#1B89D3' size={30}/>
								)}
							</button>
							<button onClick={nextSong}>
								<TbPlayerTrackNextFilled color='#1B89D3' size={25}/>
							</button>
							<button onClick={toggleLoop}>
								{isLooping ? (
									<TbRepeat size={20} color='#1B89D3'/>
								) : (
									<TbRepeatOff size={20}/>
								)}
							</button>
						</div>
					</div>
					<div className='w-full flex items-center gap-2 md:5'>
						<div className='text-sm'>
							{formatTime(currentTime)}
						</div>
						<input
							type='range'
							min='0'
							max={duration || 1}
							value={currentTime}
							onChange={handleSeek}
							onMouseDown={handleSeekStart}
							onMouseUp={handleSeekEnd}
							step='0.01'
							className='w-20 h-1 bg-[#cbcbcb] rounded-lg appearance-none cursor-pointer range-sm custom-range'
						/>
						<div className='text-sm'>
							{formatTime(duration)}
						</div>
					</div>
				</div>
				<div className='flex lg:hidden'>
					<button
						className='flex items-center justify-center w-[50px] h-[47px]'
						onClick={handlePlayPause}
					>
						{isPlaying ? (
							<FaCirclePause color='#1B89D3' size={30}/>
						) : (
							<FaCirclePlay color='#1B89D3' size={30}/>
						)}
					</button>
					<button onClick={nextSong}>
						<TbPlayerTrackNextFilled color='#1B89D3' size={25}/>
					</button>
				</div>
				<div className='hidden lg:flex gap-3 items-center'>
					<button onClick={toggleMute}>
						{isMuted ? (
							<ImVolumeMute2 color='#1B89D3' size={18}/>
						) : (
							<ImVolumeMedium size={18}/>
						)}
					</button>
					<input
						type='range'
						min='0'
						max='1'
						value={volume}
						onChange={handleVolumeChange}
						step='0.01'
						className='w-full h-1 bg-[#cbcbcb] rounded-lg appearance-none cursor-pointer range-sm custom-range'
					/>
				</div>
			</div>
			{/*Модальное окно для маленьких экранов*/}
			<ModalComponent
				active={isEditModalOpen}
				setActive={setEditModalOpen}
				className='border-royalBlue mt-[10px]'
				// classNameModal='w-[350px]'
			>
				{/*Картинка/название песни/имя автора*/}
				{localSongIndex !== undefined && currentSongList[localSongIndex] ? (
					<div className='w-full px-10 mb-4'>
						<div className='w-full flex flex-col justify-center items-center mb-5'>
							<img
								src={photoUrl}
								title={currentSongList[localSongIndex].title}
								alt={currentSongList[localSongIndex].title}
								className='w-[200px] h-[200px] mb-3 rounded-[10px] object-cover'
							/>
						</div>
						<div className='flex items-center'>
							<h2 className='w-full lg:w-[120px] font-medium truncate'>
								{currentSongList[localSongIndex].title || 'Нет названия'}
							</h2>
						</div>
						<div className='flex items-center'>
							<h3 className='w-[80px] md:w-[120px] text-sm truncate'>
								{currentSongList[localSongIndex].album?.singer?.name || 'Нет группы'}
							</h3>
						</div>
						<audio ref={audioRef}/>
					</div>
				) : (
					<p>Нет доступной песни</p>
				)}
				{/*Перемотка песни*/}
				<div className='w-full flex items-center px-10 gap-2 md:5'>
					<div className='text-sm'>
						{formatTime(currentTime)}
					</div>
					<input
						type='range'
						min='0'
						max={duration || 1}
						value={currentTime}
						onChange={handleSeek}
						onMouseDown={handleSeekStart}
						onMouseUp={handleSeekEnd}
						step='0.01'
						className='w-20 h-1 bg-[#cbcbcb] rounded-lg appearance-none cursor-pointer range-sm custom-range'
					/>
					<div className='text-sm'>
						{formatTime(duration)}
					</div>
				</div>
				{/*Бар для управления*/}
				<div className='flex w-full justify-between mb-5 px-10'>
					<button onClick={playRandomSong}>
						<LiaRandomSolid size={20}/>
					</button>
					<button onClick={prevSong}>
						<TbPlayerTrackPrevFilled color='#1B89D3' size={30}/>
					</button>
					<button
						className='flex items-center justify-center w-[50px] h-[47px]'
						onClick={handlePlayPause}
					>
						{isPlaying ? (
							<FaCirclePause color='#1B89D3' size={30}/>
						) : (
							<FaCirclePlay color='#1B89D3' size={30}/>
						)}
					</button>
					<button onClick={nextSong}>
						<TbPlayerTrackNextFilled color='#1B89D3' size={30}/>
					</button>
					<button onClick={toggleLoop}>
						{isLooping ? (
							<TbRepeat size={20} color='#1B89D3'/>
						) : (
							<TbRepeatOff size={20}/>
						)}
					</button>
				</div>
				{/*Управление громкостью*/}
				<div className='flex w-full gap-3 items-center px-10'>
					<ImVolumeMute2 size={18}/>
					<input
						type='range'
						min='0'
						max='1'
						value={volume}
						onChange={handleVolumeChange}
						step='0.01'
						className='w-full h-1 bg-[#cbcbcb] rounded-lg appearance-none cursor-pointer range-sm custom-range'
					/>
					<ImVolumeMedium size={18}/>
				</div>
			</ModalComponent>
		</div>
	);
};