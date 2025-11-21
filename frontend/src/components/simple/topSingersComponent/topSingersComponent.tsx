//Функциональный компонент
import { FC } from 'react';
//Интерфейс
import { ITopSingers } from './topSingersComponent.interface.ts';

export const TopSingersComponent:FC<ITopSingers> = ({
		subtitle,
		src,
		subscribers,
		onClick
	}) => {
	return (
		<div
			onClick={onClick}
			className='w-[100px] flex flex-col items-center cursor-pointer'
		>
			<img
				src={src}
				title={subtitle}
				alt={subtitle}
				className='w-[60px] h-[60px] object-cover rounded-[10px] custom-shadow'
			/>
			<h4 className='my-1 w-[100px] text-center inline-block overflow-hidden text-ellipsis whitespace-nowrap'>
				{subtitle}
			</h4>
			<h5 className='text-sm text-[#757575]'>
				{subscribers}
			</h5>
		</div>
	);
};


