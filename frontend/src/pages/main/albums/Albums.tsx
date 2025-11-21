//Функциональный компонент
import {
  FC,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
//Работа с запросами
import { useNavigate } from 'react-router-dom';
import { useShowAlbum } from '../../../utils/axios/useShowAlbum.tsx';
//React-component
import { CardFromComponent } from '../../../components/containers/cardFromComponent/CardFromComponent.tsx';
import { AlbumComponent } from '../../../components/object/albumComponent.tsx';
import { LoadingComponent } from '../../../components/ui/loadingComponent.tsx';

export const Albums: FC = () => {
  //Состояние для отслеживания загрузки
  const [loading, setLoading] = useState(true);
  //Работа с навигацией
  const navigate = useNavigate();
  //Получение данных альбома
  const { albums } = useShowAlbum();

  //Эффект для управления состоянием загрузки
  useEffect(() => {
    if (albums.length > 0) {
      setLoading(false); // Установите loading в false, когда данные загружены
    }
  }, [albums]);

  //Переход на страницу альбома
  const handleAlbumClick = useCallback((albumId: number | undefined) => {
    navigate(`/albumPage/${albumId}`);
  }, [navigate]);

  //Мемоизация альбомов, если нужно (например, если хотите фильтровать или сортировать)
  const memoizedAlbums = useMemo(() => albums, [albums]);

  return (
    <main>
      {loading ? (
        <LoadingComponent/>
      ) : (
        <CardFromComponent
          title='ВСЕ АЛЬБОМЫ'
          href='/singers'
        >
          <div className='w-full flex flex-wrap justify-between gap-0 sm:gap-5'>
            {memoizedAlbums.map(album => (
              <AlbumComponent
                key={album.id}
                id={album.id}
                title={album.title}
                singer={album.description}
                photo={album?.photo
                  ? `http://localhost:5000/uploads/albumPhoto/${album.photo}`
                  : 'path_to_default_image'}
                onClick={() => handleAlbumClick(album?.id)}
                className='mb-5'
              />
            ))}
          </div>
        </CardFromComponent>
      )}
    </main>
  );
};