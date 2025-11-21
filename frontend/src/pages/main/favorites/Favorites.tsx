//Функциональный компонент
import {
  FC,
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react';
//Интерфейсы
import {
  IFavorites, IMainFavorite,
  ISong
} from './Favorites.interface.ts';
//Работа с Cookies
import Cookies from 'js-cookie';
//Работа с запросами
import axios from 'axios';
import { useUserProfile } from '../../../utils/axios/useUserProfile.tsx';
//React-components
import { CardFromComponent } from '../../../components/containers/cardFromComponent/CardFromComponent.tsx';
import { MusicComponent } from '../../../components/object/musicComponent/musicComponent.tsx';
import { LayoutComponent } from '../../../components/containers/layoutComponent/layoutComponent.tsx';
import { SortSongsComponent } from '../../../components/smart/sortSongsComponent.tsx';
import { LoadingComponent } from '../../../components/ui/loadingComponent.tsx';

export const Favorites: FC<IFavorites> = ({
                                            selectSong,
                                            updateSongList
                                          }) => {

  const profile = useUserProfile();
  const [songs, setSongs] = useState<ISong[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSingleColumn, setIsSingleColumn] = useState(false);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);

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

  const fetchSongs = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      if (!token) return;
      setLoading(true);
      const response = await axios.get<IMainFavorite[]>('http://localhost:5000/favorite/all-favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const songsWithDuration = await Promise.all(response.data.map(async (item) => {
        const songFileUrl = `http://localhost:5000/uploads/songFiles/${item.song.songFile}`;
        const duration = await getAudioDuration(songFileUrl);
        return {
          songId: item.songId,
          ...item.song,
          duration,
        };
      }));
      setSongs(songsWithDuration);
      updateSongList(songsWithDuration, 'list2');
    } catch (error) {
      console.error('Ошибка при загрузке песен:', error);
    } finally {
      setLoading(false);
    }
  }, [updateSongList]);

  useEffect(() => {
    fetchSongs().catch(error => {
      console.error('Ошибка, попробуйте еще раз', error);
    });
  }, [fetchSongs]);

  useEffect(() => {
    const handleResize = () => {
      setIsSingleColumn(window.innerWidth <= 1980 && window.innerWidth <= 1536);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const halfIndex = Math.ceil(songs.length / 2);
  const firstHalfSongs = isSingleColumn ? songs : songs.slice(0, halfIndex);
  const secondHalfSongs = isSingleColumn ? [] : songs.slice(halfIndex);

  const renderedFirstHalfSongs = useMemo(() => (
    firstHalfSongs.map((song, index) => (
      <MusicComponent
        key={`first-${index}`}
        onClick={() => selectSong('Download_page_list1', index)}
        index={String(index + 1).padStart(2, '0')}
        src={song.photo ? `http://localhost:5000/uploads/songPhoto/${song.photo}` : 'path_to_default_image'}
        title={song.title || 'Название не указано'}
        album={song.album?.title || 'Альбом не указан'}
        singer={song.album?.singer?.name || 'Исполнитель не указан'}
        category={song.category.title || 'Категория не указана'}
        songId={song.songId || 'Неизвестный ID'}
        userId={profile?.id}
        className='flex justify-center items-center'
        duration={formatDuration(song.duration ?? 0)}
      />
    ))
  ), [firstHalfSongs, selectSong, profile?.id, formatDuration]);

  const renderedSecondHalfSongs = useMemo(() => (
    secondHalfSongs.map((song, index) => (
      <MusicComponent
        key={`second-${index}`}
        onClick={() => selectSong('Download_page_list1', index + halfIndex)}
        index={String(index + halfIndex + 1).padStart(2, '0')}
        src={song.photo ? `http://localhost:5000/uploads/songPhoto/${song.photo}` : 'path_to_default_image'}
        title={song.title || 'Название не указано'}
        album={song.album?.title || 'Альбом не указан'}
        singer={song.album?.singer?.name || 'Исполнитель не указан'}
        category={song.category.title || 'Категория не указана'}
        songId={song.songId || 'Неизвестный ID'}
        userId={profile?.id}
        className='flex justify-center items-center'
        duration={formatDuration(song.duration ?? 0)}
      />
    ))
  ), [secondHalfSongs, selectSong, profile?.id, formatDuration]);

  return (
    <main className='custom-scrollbar overflow-y-auto'>
      {loading ? (
        <LoadingComponent/>
      ) : (
        <LayoutComponent
          childrenLeft={
            <div>
              <CardFromComponent
                title='ВСЕ МОИ ПЕСНИ'
                allCategory={<SortSongsComponent songs={firstHalfSongs}/>}
              >
                <div className='w-full flex flex-col gap-5'>
                  {renderedFirstHalfSongs}
                </div>
              </CardFromComponent>
            </div>
          }
          childrenRight={
            !isSingleColumn && (
              <div>
                <CardFromComponent
                  title='ВСЕ МОИ ПЕСНИ'
                  allCategory={<SortSongsComponent songs={secondHalfSongs}/>}
                >
                  <div className='w-full flex flex-col gap-5'>
                    {renderedSecondHalfSongs}
                  </div>
                </CardFromComponent>
              </div>
            )
          }
        />
      )}
    </main>
  );
};