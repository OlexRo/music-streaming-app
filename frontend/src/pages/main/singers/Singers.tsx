//Функциональный компонент
import {
  FC,
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react';
//Навигация по сайту
import {
  useNavigate,
  useParams
} from 'react-router-dom';
//Работа с запросами
import { useShowSinger } from '../../../utils/axios/useShowSinger.tsx';
//React-component
import { CardFromComponent } from '../../../components/containers/cardFromComponent/CardFromComponent.tsx';
import { SingerAlbumCardComponent } from '../../../components/containers/singerAlbumCardComponent.tsx';
import { SingerComponent } from '../../../components/object/singerComponent.tsx';
import { LoadingComponent } from '../../../components/ui/loadingComponent.tsx';

export const Singers: FC = () => {

  // Состояние для отслеживания загрузки
  const [loading, setLoading] = useState(true);
  //Навигация по сайту
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // Получение данных пользователя
  const { singers } = useShowSinger();
  // Состояние для выбранного певца, начальное значение null
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

// Функция для перехода на страницу певца
  const handleSingerClick = useCallback((person: any) => {
    navigate(`/singer/${person.id}`);
    setSelectedPerson(person);
  }, [navigate]);

  // Переход на страницу альбома по albumId
  const handleAlbumClick = useCallback((albumId: number | undefined) => {
    if (albumId !== undefined) {
      navigate(`/albumPage/${albumId}`);
    }
  }, [navigate]);

  // Загрузка массива с певцами
  useEffect(() => {
    setLoading(true); // Установить loading в true при монтировании компонента
    if (singers.length > 0) {
      const foundSinger = singers.find((singer) => singer.id === Number(id));
      if (foundSinger) {
        setSelectedPerson(foundSinger);
      } else if (!selectedPerson) {
        setSelectedPerson(singers[0]);
      }
      setLoading(false); // Установить loading в false после загрузки данных
    }
  }, [id, singers, selectedPerson]);

  // Функция для выбора правильной формы слова альбома
  const getAlbumWordForm = useCallback((count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return 'Альбом';
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
      return 'Альбома';
    } else {
      return 'Альбомов';
    }
  }, []);

  // Функция для выбора правильной формы слова песня
  const getSongWordForm = useCallback((count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return 'песня';
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
      return 'песни';
    } else {
      return 'песен';
    }
  }, []);

  // Используем useMemo для вычислений, зависящих от selectedPerson
  const albumInfo = useMemo(() => {
    if (!selectedPerson) return { albumCount: 0, songCount: 0 };
    const albumCount = selectedPerson.albums?.length || 0;
    const songCount = selectedPerson.albums.reduce((acc: number, album: any) => acc + (album.songs?.length || 0), 0);
    return { albumCount, songCount };
  }, [selectedPerson]);

  return (
    <main className='custom-scrollbar overflow-y-auto'>
      <div className='flex flex-col h-full'>
        {loading ? (
          <LoadingComponent/>
        ) : (
          <>
            {/* Все певцы */}
            <CardFromComponent title='ВСЕ ПЕВЦЫ'>
              <div className='flex gap-14 h-full'>
                {/* Данные певца */}
                <div className='flex h-full flex-col gap-5'>
                  {singers
                    .filter((singer) => singer.albums && singer.albums.length > 0)
                    .map((item, index) => (
                      <SingerComponent
                        id={item.id}
                        key={index}
                        src={item?.photo
                          ? `http://localhost:5000/uploads/singerAvatar/${item.photo}`
                          : 'path_to_default_image'}
                        singer={item.name}
                        className={`pl-2 flex items-center bg-crayola h-[75px] rounded-l-[5px] 
                              ${selectedPerson?.id === item.id
                          ? 'bg-royalHoverBlue border-r-4 border-royalBlue'
                          : ''}`}
                        onClick={() => handleSingerClick(item)}
                      />
                    ))}
                </div>
                {/* Альбомы певца */}
                <div className='w-full'>
                  {selectedPerson ? (
                    <div className='w-full flex flex-col justify-center'>
                      <span className='text-royalBlue text-xl'>{selectedPerson.name}</span>
                      <div className='flex gap-1 mt-1'>
                        <span>
                          {albumInfo.albumCount}{' '}
                          {getAlbumWordForm(albumInfo.albumCount)},
                        </span>
                        <span>
                          {albumInfo.songCount}{' '}
                          {getSongWordForm(albumInfo.songCount)}
                        </span>
                      </div>
                      <div className='mt-4 flex gap-2 justify-between h-full flex-wrap'>
                        {selectedPerson.albums.map((album: any, index: number) => (
                          <SingerAlbumCardComponent
                            key={index}
                            title={album.title}
                            date={album.yearRelease}
                            photo={album?.photo
                              ? `http://localhost:5000/uploads/albumPhoto/${album.photo}`
                              : 'path_to_default_image'}
                            onClick={() => handleAlbumClick(album.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span>Выберите певца, чтобы увидеть его альбомы.</span>
                  )}
                </div>
              </div>
            </CardFromComponent>
          </>
        )}
      </div>
    </main>
  );
};