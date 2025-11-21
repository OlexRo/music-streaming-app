//Функциональный компонент
import {
  FC,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
//Интерфейсы
import { FavoriteSong } from '../home/Home.interface.ts';
import {
  IExplore,
  Song
} from './Explore.ts';
//Работа с запросами
import axios from 'axios';
import { useUserProfile } from '../../../utils/axios/useUserProfile.tsx';
import { useShowAlbum } from '../../../utils/axios/useShowAlbum.tsx';
//React-component
import { AlbumComponent } from '../../../components/object/albumComponent.tsx';
import { CardFromComponent } from '../../../components/containers/cardFromComponent/CardFromComponent.tsx';
import { TopSingersComponent } from '../../../components/simple/topSingersComponent/topSingersComponent.tsx';
import { MusicComponent } from '../../../components/object/musicComponent/musicComponent.tsx';
import { LayoutComponent } from '../../../components/containers/layoutComponent/layoutComponent.tsx';
import { LastSongComponent } from '../../../components/simple/lastSongComponent.tsx';
import { SortSongsComponent } from '../../../components/smart/sortSongsComponent.tsx';
import { useShowLastSinger } from '../../../utils/axios/useShowLastSinger.tsx';
import { LoadingComponent } from '../../../components/ui/loadingComponent.tsx';
//Функции адаптации
import { useDisplayedSingers } from '../../../utils/adaptation/useDisplayedSingers.tsx';
import { useDisplayedSongs } from '../../../utils/adaptation/useScreenWidthSongs.tsx';
import { useDisplayedAlbums } from '../../../utils/adaptation/useDisplayedAlbums.tsx';
import Cookies from 'js-cookie';
import {useMediaQuery} from 'react-responsive';

export const Explore: FC<IExplore> = ({
    selectSong,
    updateSongList
  }) => {

  //Анимация загрузки
  const [loading, setLoading] = useState(true);
  //Работа с навигацией
  const navigate = useNavigate();
  //Получение данных пользователя
  const profile = useUserProfile();
  //Получение данных альбомов
  const { albums } = useShowAlbum();
  //Получение данных певца
  // const { singers } = useShowSinger();
  // Популярные песни
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  //Работа с песями
  const [songs, setSongs] = useState<Song[]>([]);
  //Получение данных последних певцов
  const { lastSingers } = useShowLastSinger();
  // //Адаптация для певцов
  const displayedSingers = useDisplayedSingers(lastSingers);
  //Адаптация для песен
  const displayedSongs = useDisplayedSongs(songs);
  //Адаптация для альбомов
  const displayedAlbums = useDisplayedAlbums(albums);
  //Песни по жанрам для пользователя
  const [userGenreSongs, setUserGenreSongs] = useState<Song[]>([]);

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

  //Обработка клика по альбому
  const handleAlbumClick = useCallback((albumId: number | undefined) => {
    navigate(`/albumPage/${albumId}`);
  }, [navigate]);

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
      updateSongList(songsWithDuration, 'Explore_page_list1');
    } catch (error) {
      console.error('Ошибка при загрузке песен:', error);
    } finally {
      if (showLoading) {
        setLoading(false); // Окончание загрузки после первой загрузки или обновления страницы
      }
    }
  }, [updateSongList]);

  //Вывод всех песен
  useEffect(() => {
    fetchSongs(true).catch(error => {
      console.error('Ошибка вывода', error);
    });
    // Обновляем данные каждую секунду без показа анимации загрузки
    const intervalId = setInterval(() => fetchSongs(false), 3000);
    return () => clearInterval(intervalId);
  }, [fetchSongs]);

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

  //Рекомендации
  const fetchFavoritesAndGenreCount = useCallback(async () => {
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
    fetchFavoritesAndGenreCount().catch(error => {
      console.error('Ошибка получения песен по жанрам:', error);
    });
  }, [fetchFavoritesAndGenreCount]);

  const isSmallScreen = useMediaQuery({ query: '(max-width: 500px)' });

  return (
    <main className='custom-scrollbar overflow-y-auto'>
      {loading ? (
        <LoadingComponent/>
      ) : (
        <LayoutComponent
          // Контент в левой части
          childrenLeft={
            <div>
              <CardFromComponent
                title='НОВЫЕ АЛЬБОМЫ'
                showEvery={!isSmallScreen ? 'Показать всех...' : ''}
                href='/albums'
              >
                <div className='w-full flex justify-around sm:justify-between gap-5'>
                  {displayedAlbums.map(album => (
                    <AlbumComponent
                      key={album.id}
                      id={album.id}
                      title={album.title}
                      singer={album.description}
                      photo={album?.photo
                        ? `http://localhost:5000/uploads/albumPhoto/${album.photo}`
                        : 'path_to_default_image'}
                      onClick={() => handleAlbumClick(album.id)}
                    />
                  ))}
                </div>
              </CardFromComponent>
              {/* Новые песни */}
              <CardFromComponent
                title='НОВЫЕ ПЕСНИ'
              >
                <div className='flex justify-around sm:justify-between gap-5'>
                  {displayedSongs.map((song, index) => (
                    <LastSongComponent
                      key={song.id}
                      onClick={() => selectSong('Explore_page_list1', index)}
                      src={song?.photo
                        ? `http://localhost:5000/uploads/songPhoto/${song.photo}`
                        : 'path_to_default_image'}
                      title={song.title}
                      singer={song.album.singer.name}
                      className='flex justify-center items-center'
                    />
                  ))}
                </div>
              </CardFromComponent>
              {/* Новые певцы */}
              <CardFromComponent
                title='НОВЫЕ ПЕВЦЫ'
                showEvery={!isSmallScreen ? 'Показать всех...' : ''}
                href='/singers'
                className='mt-12 smLitle:mt-0'
              >
                <div className="flex justify-between">
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
                allCategory={<SortSongsComponent />}
              >
                <div className='w-full flex flex-col gap-5'>
                  {songs.slice(0, 8).map((song, index) => (
                    <MusicComponent
                      key={index}
                      onClick={() => selectSong('Explore_page_list1', index)}
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
                      duration={formatDuration(song.duration ?? 0)}
                    />
                  ))}
                </div>
              </CardFromComponent>
            </div>
          }
          // Контент в правой части
          childrenRight={
            <div>
              {/* Самые популярные песни */}
              <CardFromComponent
                title='САМЫЕ ПОПУЛЯРНЫЕ ПЕСНИ'
                allCategory={<SortSongsComponent />}
              >
                <div className='w-full flex flex-col gap-5'>
                  {popularSongs.map((song, index) => (
                    <MusicComponent
                      key={index}
                      onClick={() => selectSong('Explore_page_list2', index)}
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
              <CardFromComponent
                title='ВАШИ РЕКОМЕНДАЦИИИ'
                allCategory={<SortSongsComponent />}
              >
                <div className='w-full flex flex-col gap-5'>
                  {userGenreSongs.slice(0, 9).map((song, index) => (
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
            </div>
          }
        />
      )}
    </main>
  );
};