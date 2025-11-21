//Подключение React
import {
  FC,
  useCallback, useEffect,
  useState
} from 'react';
//React-router
import {
  Route,
  Routes, useNavigate
} from 'react-router-dom';
//React-Cookie
import Cookies from 'js-cookie';
//Работа с запросами
import axios from 'axios';
//Работа с формами
import { useForm } from 'react-hook-form';
//Страницы информационной системы
import { Home }  from '../pages/main/home/Home.tsx';
import { DashboardAdmin } from '../pages/client/admin/dashboardAdmin.tsx';
import { DashboardUser } from '../pages/client/user/dashboardUser.tsx';
import { Explore } from '../pages/main/explore/Explore.tsx';
import { AllMusic } from '../pages/main/allMusic/allMusic.tsx';
import { Albums } from '../pages/main/albums/Albums.tsx';
import { Singers } from '../pages/main/singers/Singers.tsx';
import { Categories } from '../pages/main/categories/Categories.tsx';
import { Favorites } from '../pages/main/favorites/Favorites.tsx';
import { Downloads } from '../pages/main/downloads/Downloads.tsx';
import { AlbumPage } from '../pages/other/albumPage/AlbumPage.tsx';
import { CategoryPage } from '../pages/other/categoryPage/CategoryPage.tsx';
//React-компоненты
import { SideBarComponent } from '../components/smart/sideBarComponent/sideBarComponent.tsx';
import { HeaderComponent } from '../components/smart/headerComponent/headerComponent.tsx';
import { MusicBarComponent } from '../components/smart/musicBarComponent/musicBarComponent.tsx';
import { ModalComponent } from '../components/modal/modalComponent/modalComponent.tsx';
import { RegisterComponent } from '../components/auth/registerComponent/registerComponent.tsx';
import { LoginComponent } from '../components/auth/loginComponent/loginComponent.tsx';
import { PSDWindowComponent } from '../components/modal/PSDWindowComponent/PSDWindowComponent.tsx';
import { Song } from '../components/smart/musicBarComponent/musicBarComponent.interface.ts';
import { SearchComponent } from '../components/smart/searchComponent.tsx';
import { ButtonComponent } from '../components/ui/buttonComponent/buttonComponent.tsx';
import { IoIosArrowForward } from 'react-icons/io';
import { InputComponent } from '../components/ui/inputComponent/inputComponent.tsx';
//Функции
import { useUserProfile } from '../utils/axios/useUserProfile.tsx';
import { useShowUser } from '../utils/axios/useShowUser.tsx';
//Фото для фона
import modalPhoto1 from '../assets/img/modalPhoto.png';
import bun from '../../src/assets/img/ban.png';

//Интерфейс для useForm
interface CreateMessageForm {
  text: string;
}

//Интерфейс для пользователя
interface User {
  id: number;
  status: string;
}

export const App: FC = () => {
  //Состояние для хранения текущего индекса песни
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  //Состояние для хранения текущего списка песен
  const [currentSongList, setCurrentSongList] = useState('list1');
  //Состояние для управления отображением модального окна
  const [modalActive, setModalActive] = useState(false);
  //Состояние для управления отображением окна уведомлений
  const [PSDWindowActive, setPSDWindowActive] = useState(false);
  //Сообщения для окна уведомлений
  const [PSDMessage, setPSDMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  //Состояние для управления переключением между авторизацией и регистрацией
  const [showAuth, setShowAuth] = useState(false);
  //Состояние для отслеживания, какая форма отображается (авторизация или регистрация)
  const [isAuth, setAuth] = useState(false);
  //Управление воспроизведением музыки
  const [isPlaying, setIsPlaying] = useState(false);
  //Получение данных профиля
  const profile = useUserProfile();
  //Получаем список всех пользователей
  const users = useShowUser();
  //Хук для работы с формами из библиотеки react-hook-form
  const { register, handleSubmit, formState: { errors }} = useForm<CreateMessageForm>();
  //Состояние для отслеживания, было ли сообщение отправлено
  const [, setIsMessageSent] = useState(false);
  //Состояние для хранения информации о пользователе, который соответствует текущему профилю
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  //Состояние для отслеживания загрузки (например, во время отправки сообщения)
  const [loading, setLoading] = useState(false);
  //Используется для определения состояния (например, успешной отправки сообщения)
  const [flag, setFlag] = useState<boolean | null>(null);

  //Состояние для хранения списков песен
  const [songLists, setSongLists] = useState<{ listName: string; songs: Song[] }[]>([
    { listName: 'Home_page_list1', songs: [] },
    { listName: 'Home_page_list2', songs: [] },
    { listName: 'Home_page_list3', songs: [] },
    { listName: 'Home_page_list4', songs: [] },
    { listName: 'Explore_page_list1', songs: [] },
    { listName: 'Explore_page_list2', songs: [] },
    { listName: 'allMusic_page_list1', songs: [] },
    { listName: 'albumSongs', songs: [] },
    { listName: 'list2', songs: [] },
    { listName: 'categorySongs', songs: [] },
    { listName: 'Home_page_search', songs: [] },
  ]);

  //Управление навигацией
  const navigate = useNavigate();

  //Функция для обновления песен в альбоме
  const updateAlbumSongs = useCallback((album: any) => {
    console.log('Обновлены данные альбома:', album);
  }, []);

  //Обновляем список песен
  const updateSongList = useCallback((songs: Song[], listName: string) => {
    setSongLists((prevLists) => {
      const updatedLists = prevLists.filter((list) => list.listName !== listName);
      return [...updatedLists, { listName, songs }];
    });
  }, []);

  //Функция для выбора песни и установки ее как текущую
  const selectSong = (listName: string, songIndex: number) => {
    setCurrentSongList(listName);
    setCurrentSongIndex(songIndex);
    setIsPlaying(true); // Включить воспроизведение
  };

  //Функция переключения между регистрацией и авторизацией
  const buttonAuth = () => {
    setAuth((prev) => !prev);
    setShowAuth((prev) => !prev);
  };

  //Установка первой песни по умолчанию
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  //Установка первой песни по умолчанию
  useEffect(() => {
    if (isFirstLoad && songLists.length > 0) {
      const firstList = songLists.find((list) => list.songs.length > 0);
      if (firstList) {
        setCurrentSongList(firstList.listName);
        setCurrentSongIndex(0); // Устанавливаем индекс на первую песню
        setIsPlaying(false); // Включаем воспроизведение
        setIsFirstLoad(false); // Обновляем состояние, чтобы предотвратить повторную загрузку
      }
    }
  }, [songLists, isFirstLoad]);

  //Функция отображения ошибки
  const handleMassage = (errorMessage: string) => {
    setPSDMessage(errorMessage);
    setMessageType('error');
    setPSDWindowActive(true);
  };

  //Функция выхода из аккаунта
  const handleLogout = useCallback(async () => {
    try {
      //Выполняем запрос на сервер для выхода из аккаунта
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
      //Удаляем токен из localStorage и sessionStorage
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      //Удаляем токен из cookie
      Cookies.remove('token'); // Здесь удаляем токен
      //Переходим на главную страницу
      navigate('/');
      setPSDWindowActive(true);
      //Обновляем страницу через 1 секунду
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      console.error('Ошибка при выходе из аккаунта:', error);
    }
  }, [navigate, setPSDWindowActive]);

  // Кнопка отправки сообщения
  const onSubmit = async (data: CreateMessageForm) => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      if (!token) return;

      const messageData = { ...data, flag: 1 };
      const response = await axios.post('http://localhost:5000/message/create-message', messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Message created:', response.data);
      setIsMessageSent(true); // Устанавливаем состояние отправки сообщения в true
    } catch (error: any) {
      if (error.response?.status === 409) {
        setIsMessageSent(true);
      } else {
        console.log('Ошибка:', error);
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  //Проверка текущего пользователя
  useEffect(() => {
    if (profile && users.length > 0) {
      const user = users.find((user) => user.id === profile.id);
      setMatchedUser(user || null);
    }
  }, [profile, users]);

  //Проверка статуса пользователя
  useEffect(() => {
    //Функция для проверки статуса пользователя
    const checkUserStatus = () => {
      if (matchedUser) {
        if (matchedUser.status === '1') {}
        else if (matchedUser.status === '0') {}
      }
    };
    //Первоначальная проверка статуса при монтировании компонента
    checkUserStatus();
    //Установка интервала для повторной проверки каждые 5 секунд
    const intervalId = setInterval(checkUserStatus, 3000);
    //Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [matchedUser, navigate]);

  //Проверка отпрвленно ли сообщение
  useEffect(() => {
    const fetchUserMessages = async () => {
      const token = Cookies.get('token');
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:5000/message/user-messages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //Проверяем, есть ли сообщения и извлекаем флаг из первого сообщения
        if (response.data && response.data.length > 0) {
          const firstMessage = response.data[0];
          setFlag(firstMessage.flag); // Извлекаем флаг из первого сообщения
        } else {
          setFlag(null); //Если сообщений нет, устанавливаем флаг в null
        }
      } catch (error) {
        console.error('Ошибка при получении пользовательских сообщений:', error);
      }
    };
    if (matchedUser) {
      fetchUserMessages().catch(error => {
        console.error('Ошибка:', error);
      });
    }
  }, [matchedUser]);

  //Роутеры и модальные окна
  const renderedContent = (
    <>
      {/* Окно уведомлений */}
      <PSDWindowComponent
        active={PSDWindowActive}
        setActive={setPSDWindowActive}
        message={PSDMessage}
        type={messageType}
      />
      {/* Модальное окно для авторизации/регистрации */}
      <ModalComponent
        active={modalActive}
        setActive={setModalActive}
        img={modalPhoto1}
        className='hidden my2xl:flex h-auto w-[50%] object-cover rounded-l-[50px] rounded-r-[10px] shadow-[-6px_0_12px_-2px_rgba(0,0,0,0.3)]'
      >
        {/* Отображение формы авторизации или регистрации */}
        {isAuth ? (
          <RegisterComponent
            setModalActive={setModalActive}
            setPSDWindowActive={setPSDWindowActive}
            onMassage={handleMassage}
          />
        ) : (
          <LoginComponent
            setModalActive={setModalActive}
            setPSDWindowActive={setPSDWindowActive}
            onMassage={handleMassage}
          />
        )}
        {/* Кнопка переключения между формами */}
        <button
          type='button'
          onClick={buttonAuth}
        >
          {showAuth ? (
            <span className='flex gap-1'>
            <span>У вас есть аккаунт?</span>
            <span className='text-royalBlue'>Войдите в него...</span>
          </span>
          ) : (
            <span className='flex gap-1'>
            <span>У вас нет аккаунта?</span>
            <span className='text-royalBlue'>Создайте его...</span>
          </span>
          )}
        </button>
      </ModalComponent>
      {/* Боковая панель (SideBar) */}
      <SideBarComponent
        setPSDWindowActive={setPSDWindowActive}
        onMassage={handleMassage}
      />
      {/* Основной контент */}
      <div className='w-full h-full grid grid-rows-[auto,1fr,auto] relative'>
        {/* Верхняя часть - заголовок */}
        <HeaderComponent
          searcControl={
            <SearchComponent
              selectSong={selectSong}
              updateSongList={updateSongList}
            />}
          setModalActive={setModalActive}
        />
        {/* Содержимое страниц */}
        <div className='row-span-2'>
          <Routes>
            <Route
              path='/'
              element={
                <Home
                  selectSong={selectSong}
                  updateSongList={updateSongList}
                />}
            />
            <Route path='/dashboardAdmin' element={<DashboardAdmin />} />
            <Route path='/dashboardUser' element={<DashboardUser />} />
            <Route
              path='/explore'
              element={
                <Explore
                  selectSong={selectSong}
                  updateSongList={updateSongList}
                />}
            />
            <Route
              path='/allMusic'
              element={
                <AllMusic
                  selectSong={selectSong}
                  updateSongList={updateSongList}
                />}
            />
            <Route path='/albums' element={<Albums />} />
            <Route
              path='/singers'
              element={
                <Singers/>}
            />
            <Route
              path='/categories'
              element={<Categories />}
            />
            <Route
              path='/favorite'
              element={<Favorites
                selectSong={selectSong}
                updateSongList={updateSongList}
              />}
            />
            <Route path='/download' element={
              <Downloads
                selectSong={selectSong}
                updateSongList={updateSongList}
              />}
            />
            <Route path='/singer/:id' element={<Singers />} />
            <Route
              path='/albumPage/:albumId'
              element={
                <AlbumPage
                  selectSong={selectSong}
                  updateSongList={updateSongList}
                  updateAlbumSongs={updateAlbumSongs}
                />}
            />
            <Route
              path='/categoryPage/:categoryId'
              element={
                <CategoryPage
                  selectSong={selectSong}
                  updateSongList={updateSongList}
                  updateCategorySongs={updateAlbumSongs}
                />}
            />
          </Routes>
        </div>
        {/* Музыкальный плеер */}
        <div className='absolute bottom-0 left-0 right-0'>
          <MusicBarComponent
            currentSongIndex={currentSongIndex}
            currentSongListName={currentSongList}
            songLists={songLists}
            selectSong={selectSong}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        </div>
      </div>
    </>
  )

  return (
    <div className='w-full h-full flex'>
      {matchedUser ? (
        <div className='w-full flex justify-center items-center'>
          {matchedUser.status !== undefined ? (
            <>
              {matchedUser.status === '1' ? (
                <div className='flex flex-col justify-center items-center'>
                  <h1 className='text-royalBlue uppercase text-xl'>
                    Вы были заблокированы администратором
                  </h1>
                  <h2>
                    Оставьте заявку для разблокировки аккаунта
                  </h2>
                  <br />
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='w-full flex flex-col justify-center items-center'
                  >
                  {flag === true ? (
                    <h2 className='text-royalBlue text-xl'>Удачи!</h2>
                  ) : (
                    <>
                      <InputComponent
                        id='text'
                        className='w-full'
                        className2='bg-crayola'
                        {...register('text',
                          {required: 'Введите сообщение'})}
                      />
                      {errors.text
                        &&
                        <span className='text-sm text-errorText'>
                          {errors.text.message}
                        </span>
                      }
                    </>
                  )}
                  <br />
                  {/* Кнопка отправки */}
                  {flag === true ? (<></>) :(
                    <ButtonComponent
                      icon={<IoIosArrowForward />}
                      className='border-royalBlue w-[300px] mb-[10px] mt-[10px]'
                      loading={loading}
                    >
                      {loading ? 'Отправка...' : 'Отправить сообщение'}
                    </ButtonComponent>
                  )}
                  </form>
                  <ButtonComponent
                    className='border-royalBlue w-[300px] mb-[10px] mt-[10px]'
                    onClick={handleLogout}
                  >
                    Выйти
                  </ButtonComponent>
                  <img
                    src={bun}
                    alt='Вы забаненны'
                    title='Вы забаненны'
                    className='w-[300px]'
                  />
                </div>
              ) : (
                <>
                  {renderedContent}
                </>
              )}
            </>
          ) : (
            <span>
              Статус не найден
            </span>
          )}
        </div>
      ) : (
        <>
          {renderedContent}
        </>
      )}
    </div>
  );
};