//Функциональный компонент
import { FC } from 'react';
//React-components
import { CardFromComponent } from '../../../components/containers/cardFromComponent/CardFromComponent.tsx';
import { ProfileComponent } from '../../../components/auth/client/profileComponent/profileComponent.tsx';

export const DashboardUser: FC = () => {

  return (
    <main>
      <div className='w-[510px] flex flex-col'>
        {/*Профиль пользователя*/}
        <ProfileComponent/>

        <CardFromComponent
          title='МОЙ ПЛЕЙЛИСТ'
          showEvery='Показать все...'
          href='/myMusic'
        >
        </CardFromComponent>
      </div>
    </main>
  );
};