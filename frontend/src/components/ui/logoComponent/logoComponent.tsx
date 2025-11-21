//Функциональный компонент
import { FC } from 'react';
//Интерфейс
import { ILogo } from './logoComponent.interface.ts';
//React-router
import { Link } from 'react-router-dom';
//Фотографии
import logo from '../../../assets/img/Logo.svg';

export const LogoComponent:FC<ILogo> = ({ className='', spanClassName='' , to='#', onClick}) => {
	return (
		<Link
			to={to}
			title='Логотип сайта HarmonyHub'
			onClick={onClick}
			className={`flex items-center gap-2 ${className}`}
		>
			<img
				src={logo as unknown as string}
				alt='Логотип сайта HarmonyHub'
				title='Логотип сайта HarmonyHub'
				className='w-[33px] h-[33px]'
			/>
			<span className={`text-royalBlue text-xl font-medium transition-all ${spanClassName}`}>
				HarmonyHub
			</span>
		</Link>
	);
};

