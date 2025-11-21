import {
  FC,
  useMemo
} from 'react';
//React-icons
import { MdFavoriteBorder } from 'react-icons/md';
//Интерфейс
import { ILastSong } from './lastSongComponent.interface.ts';
//Картинки
import photo from '../../../assets/img/lastAlbum.png'

export const LastAlbumComponent:FC<ILastSong> = ({
    onClick,
    singer,
    songName,
    description,
    numberLikes,
  }) => {

  //Используем useMemo для оптимизации стилей
  const albumStyle = useMemo(() => ({
    backgroundImage: `url(${photo})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }), []);

  //Используем useMemo для оптимизации стилей
  const descriptionStyle = useMemo(() => ({
    display: '-webkit-box',
    WebkitLineClamp: 2, // Ограничиваем до 2 строк
    lineClamp: 2, // Для совместимости с другими браузерами
  }), []);

  return (
    <div
      style={albumStyle}
      className='h-[280px] bg-gray-600 flex flex-col items-center smLitle:items-start text-white rounded-xl pt-9 pl-0 smLitle:pl-7 transition-all custom-shadow'
    >
      <h4 className='mb-7 text-[#FFFFFF]'>
        {singer}
      </h4>

      <div className='flex flex-col items-center smLitle:items-start'>
        <h2 className='text-2xl mb-4 text-[#FFFFFF]'>
          {songName}
        </h2>
        <p
          className='w-[180px] sm:w-[400px] h-[50px] text-center smLitle:text-left mb-8 text-[#B6B6B6] overflow-hidden text-ellipsis '
          style={descriptionStyle}
        >
          {description}
        </p>
      </div>

      <div className='flex items-center gap-5 text-[#FFFFFF]'>
        <button
          type='button'
          onClick={onClick}
          className='h-10 w-36 border-2 rounded-md transition-all duration-700 hover:scale-105'
        >
          Прослушать
        </button>
        <div className='hidden sm:flex items-center gap-2'>
          <button type='button'>
            <MdFavoriteBorder size={22} />
          </button>
          {numberLikes}
        </div>
      </div>
    </div>
  );
};

