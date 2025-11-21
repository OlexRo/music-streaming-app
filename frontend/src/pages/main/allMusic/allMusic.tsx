//Функциональный компонент
import {
  FC,
  useEffect,
  useState,
  useCallback, useMemo
} from 'react';
//Интерфейсы
import {
  IAllMusic,
  Song
} from './allMusic.interface.ts';
//Работа с запросами
import axios from 'axios';
import { useUserProfile } from '../../../utils/axios/useUserProfile.tsx';
//React-component
import { LayoutComponent } from '../../../components/containers/layoutComponent/layoutComponent.tsx';
import { CardFromComponent } from '../../../components/containers/cardFromComponent/CardFromComponent.tsx';
import { MusicComponent } from '../../../components/object/musicComponent/musicComponent.tsx';
import { SortSongsComponent } from '../../../components/smart/sortSongsComponent.tsx';
import { LoadingComponent } from '../../../components/ui/loadingComponent.tsx';

export const AllMusic: FC<IAllMusic> = ({
    selectSong,
    updateSongList
  }) => {

  const profile = useUserProfile();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSingleColumn, setIsSingleColumn] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSingleColumn(window.innerWidth <= 1536);
    };
    handleResize(); // Проверка при первом рендере
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);

  const getAudioDuration = useCallback((url: string): Promise<number> => {
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
  }, []);

  const fetchSongs = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const response = await axios.get<Song[]>('http://localhost:5000/song/all-song');
      const songsWithDuration = await Promise.all(response.data.map(async (song: Song) => {
        const duration = await getAudioDuration(`http://localhost:5000/uploads/songFiles/${song.songFile}`);
        return { ...song, duration };
      }));
      setSongs(songsWithDuration);
      updateSongList(songsWithDuration, 'allMusic_page_list1');
    } catch (error) {
      console.error('Ошибка при загрузке песен:', error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [getAudioDuration, updateSongList]);

  useEffect(() => {
    fetchSongs(true).catch(error => console.error('Ошибка вывода', error));
    const intervalId = setInterval(() => fetchSongs(false), 3000);
    return () => clearInterval(intervalId);
  }, [fetchSongs]);

  const { leftSongs, rightSongs } = useMemo(() => {
    const halfIndex = Math.ceil(songs.length / 2);
    return {
      leftSongs: songs.slice(0, halfIndex),
      rightSongs: songs.slice(halfIndex),
    };
  }, [songs]);

  const renderSongs = useMemo(() => {
    return songs.map((song, index) => (
      <MusicComponent
        key={index}
        onClick={() => selectSong('allMusic_page_list1', index)}
        index={String(index + 1).padStart(2, '0')}
        src={song?.photo ? `http://localhost:5000/uploads/songPhoto/${song.photo}` : 'path_to_default_image'}
        title={song.title}
        album={song.album.title}
        singer={song.album.singer.name}
        category={song.category.title}
        songId={song.id}
        userId={profile?.id}
        className='flex justify-center items-center'
        duration={formatDuration(song.duration ?? 0)}
      />
    ));
  }, [songs, selectSong, formatDuration, profile?.id]);

  const renderLeftSongs = useMemo(() => (
    leftSongs.map((song, index) => (
      <MusicComponent
        key={index}
        onClick={() => selectSong('allMusic_page_list1', index)}
        index={String(index + 1).padStart(2, '0')}
        src={song?.photo ? `http://localhost:5000/uploads/songPhoto/${song.photo}` : 'path_to_default_image'}
        title={song.title}
        album={song.album.title}
        singer={song.album.singer.name}
        category={song.category.title}
        songId={song.id}
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
        onClick={() => selectSong('allMusic_page_list1', index + leftSongs.length)}
        index={String(index + leftSongs.length + 1).padStart(2, '0')}
        src={song?.photo ? `http://localhost:5000/uploads/songPhoto/${song.photo}` : 'path_to_default_image'}
        title={song.title}
        album={song.album.title}
        singer={song.album.singer.name}
        category={song.category.title}
        songId={song.id}
        userId={profile?.id}
        className='flex justify-center items-center'
        duration={formatDuration(song.duration ?? 0)}
      />
    ))
  ), [rightSongs, selectSong, leftSongs.length, formatDuration, profile?.id]);

  return (
    <main className='custom-scrollbar overflow-y-auto'>
      {loading ? (
        <LoadingComponent />
      ) : isSingleColumn ? (
        <div className="w-full flex flex-col gap-5">{renderSongs}</div>
      ) : (
        <LayoutComponent
          childrenLeft={
            <CardFromComponent title="ВСЕ ПЕСНИ" allCategory={<SortSongsComponent songs={leftSongs} />}>
              <div className='w-full flex flex-col gap-5'>{renderLeftSongs}</div>
            </CardFromComponent>
          }
          childrenRight={
            <CardFromComponent title="ВСЕ ПЕСНИ" allCategory={<SortSongsComponent songs={rightSongs} />}>
              <div className='w-full pr-5 flex flex-col gap-5'>{renderRightSongs}</div>
            </CardFromComponent>
          }
        />
      )}
    </main>
  );
};