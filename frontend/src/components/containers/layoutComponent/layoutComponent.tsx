//Функциональный компонент
import { FC } from 'react';
//Интерфейс
import { ILayout } from './layoutComponent.interface.ts';

export const LayoutComponent:FC<ILayout> = ({
		childrenLeft,
		childrenRight
	}) => {
	return (
		<div className='flex gap-0 2xl:gap-20 justify-between flex-col 2xl:flex-row h-calc'>
			<div className='w-full 2xl:w-[48%] 2xl:block'>
				{childrenLeft}
			</div>
			<div className='w-full 2xl:w-[52%]'>
				{childrenRight}
			</div>
		</div>
	);
};

