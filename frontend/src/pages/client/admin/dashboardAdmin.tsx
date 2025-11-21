//Функциональный компонент
import {
  FC,
  useEffect,
  useState
} from 'react';
//React-components
import { LayoutProfileAdminComponent } from '../../../components/containers/layoutProfileAdminComponent/layoutProfileAdminComponent.tsx';
import { ProfileComponent } from '../../../components/auth/client/profileComponent/profileComponent.tsx';
import { UsersActiveComponent } from '../../../components/auth/client/usersActiveComponent/usersActiveComponent.tsx';
import { AllUserComponent } from '../../../components/auth/client/allUserComponent/AllUserComponent.tsx';
import { MusicContentStatistic } from '../../../components/auth/client/musicContentStatistic/MusicContentStatistic.tsx';
import { UsersStatisticsComponent } from '../../../components/auth/client/usersStatisticsComponent/UsersStatisticsComponent.tsx';
import { ControlPanelComponent } from '../../../components/auth/client/controlPanelComponent/ControlPanelComponent.tsx';
import { CategoryStatistic } from '../../../components/auth/client/categoryStatistic/categoryStatistic.tsx';
import { UserStatusChart } from '../../../components/auth/client/userBanAndUnban/userBanAndUnban.tsx';
import { LoadingComponent } from '../../../components/ui/loadingComponent.tsx';
import { ModalComponent } from '../../../components/modal/modalComponent/modalComponent.tsx';
import { UpdateUserForm } from '../../../components/auth/form/update/updateUserComponent/UpdateUserComponent.tsx';
import { ButtonComponent } from '../../../components/ui/buttonComponent/buttonComponent.tsx';

export const DashboardAdmin: FC = () => {

  //Анимация загрузки
  const [loading, setLoading] = useState(true);
  //Работа с модальным окном для редактирования пользователя
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  //Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      }
    };
    loadData().catch(error => {
      console.error('Ошибка вывода', error);
    });
  }, []);

  //Функция для открытия окна для редактирования
  const openEditModal = () => {
    setEditModalOpen(true);
  };

  return (
    <main className='custom-scrollbar overflow-x-hidden overflow-y-auto'>
      {loading ? (
        <LoadingComponent/>
      ) : (
        <LayoutProfileAdminComponent
          leftContent={
            <div className="w-full flex flex-col">
              <div className='flex flex-col gap-10 my2xl:gap-0 justify-center items-center'>
                <ProfileComponent>
                  <ButtonComponent
                    className="border-royalBlue w-[200px]"
                    onClick={openEditModal}
                  >
                    Изменить аккаунт
                  </ButtonComponent>
                </ProfileComponent>
                <UsersActiveComponent />
              </div>
              <AllUserComponent />
            </div>
          }
          centerContent={
            <div className='h-full h-calc'>
              <MusicContentStatistic />
              <UsersStatisticsComponent />
              <UserStatusChart />
            </div>
          }
          rightContent={
            <div className='h-full h-calc flex flex-col'>
              <ControlPanelComponent />
              <CategoryStatistic />
            </div>
          }
        />
      )}
      {/*Окно для изменения данных пользователя*/}
      <ModalComponent
        active={isEditModalOpen}
        setActive={setEditModalOpen}
        className='absolute border-royalBlue mb-[10px] mt-[10px]'
      >
        <UpdateUserForm/>
      </ModalComponent>
    </main>
  );
};