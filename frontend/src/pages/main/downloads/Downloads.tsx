//Функциональный компонент
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
//Интерфейсы
import {
  IDownload,
  IMainDownload,
  ISong
} from './Download.interface.ts';
//Работа с Cookies
import Cookies from 'js-cookie';
//Работа с запросами
import axios from 'axios';
import { useUserProfile } from '../../../utils/axios/useUserProfile.tsx';
//React-component
import { MusicComponent } from '../../../components/object/musicComponent/musicComponent.tsx';
import { LayoutComponent } from '../../../components/containers/layoutComponent/layoutComponent.tsx';
import { CardFromComponent } from '../../../components/containers/cardFromComponent/CardFromComponent.tsx';
import { SortSongsComponent } from '../../../components/smart/sortSongsComponent.tsx';
import { LoadingComponent } from '../../../components/ui/loadingComponent.tsx';

export const Downloads: FC<IDownload> = ({
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
      const response = await axios.get<IMainDownload[]>('http://localhost:5000/download/all-downloads', {
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
      updateSongList(songsWithDuration, 'Download_page_list1');
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

  const { leftSongs, rightSongs } = useMemo(() => {
    const halfIndex = Math.ceil(songs.length / 2);
    return {
      leftSongs: isSingleColumn ? songs : songs.slice(0, halfIndex),
      rightSongs: isSingleColumn ? [] : songs.slice(halfIndex),
    };
  }, [songs, isSingleColumn]);

  const renderLeftSongs = useMemo(() => (
    leftSongs.map((song, index) => (
      <MusicComponent
        key={index}
        onClick={() => selectSong('Download_page_list1', index)}
        index={String(index + 1).padStart(2, '0')}
        src={song?.photo
          ? `http://localhost:5000/uploads/songPhoto/${song.photo}`
          : 'path_to_default_image'}
        title={song.title || 'Название не указано'}
        album={song.album?.title || 'Альбом не указан'}
        singer={song.album?.singer?.name || 'Исполнитель не указан'}
        category={song.category.title || 'Категория не указана'}
        songId={song.songId}
        userId={profile?.id}
        className='flex justify-center items-center'
        duration={formatDuration(song.duration ?? 0)}
      />
    ))
  ), [leftSongs, selectSong, formatDuration, profile?.id]);

  const renderRightSongs = useMemo(() => (
    rightSongs.map((song, index) => (
      <MusicComponent
        key={index + leftSongs.length}
        onClick={() => selectSong('Download_page_list1', index + leftSongs.length)}
        index={String(index + leftSongs.length + 1).padStart(2, '0')}
        src={song?.photo
          ? `http://localhost:5000/uploads/songPhoto/${song.photo}`
          : 'path_to_default_image'}
        title={song.title || 'Название не указано'}
        album={song.album?.title || 'Альбом не указан'}
        singer={song.album?.singer?.name || 'Исполнитель не указан'}
        category={song.category.title || 'Категория не указана'}
        songId={song.songId}
        userId={profile?.id}
        className='flex justify-center items-center'
        duration={formatDuration(song.duration ?? 0)}
      />
    ))
  ), [rightSongs, selectSong, formatDuration, profile?.id]);

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
                allCategory={<SortSongsComponent songs={leftSongs}/>}
              >
                <div className='w-full flex flex-col gap-5'>
                  {renderLeftSongs}
                </div>
              </CardFromComponent>
            </div>
          }
          childrenRight={
            !isSingleColumn && (
              <div>
                <CardFromComponent
                  title='ВСЕ МОИ ПЕСНИ'
                  allCategory={<SortSongsComponent songs={rightSongs}/>}
                >
                  <div className='w-full flex flex-col gap-5'>
                    {renderRightSongs}
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