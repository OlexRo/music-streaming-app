//Функциональный компонент
import { FC } from 'react';

//Интерфейс для AlbumComponent
interface ISingerAlbumCardComponent {
	onClick?: () => void,
	title?: string,
	date?: string,
	photo?: string,
	className?: string,
}

export const SingerAlbumCardComponent: FC<ISingerAlbumCardComponent> = ({
		onClick,
		title,
		date,
		photo,
		className
	}) => {
	return (
		<div
			onClick={onClick}
			className={`mb-[20px] cursor-pointer ${className}`}
		>
			<div className='flex flex-col'>
				<img
					src={photo}
					alt={title}
					title={title}
					className='rounded-[10px] w-[190px] h-[150px] object-cover custom-shadow'
				/>
				<span className='mt-2 w-[150px] text-lg inline-block overflow-hidden text-ellipsis whitespace-nowrap'>
					{title}
				</span>
				<span className='mt-1 text-sm w-[125px] inline-block overflow-hidden text-ellipsis whitespace-nowrap'>
					{date}
				</span>
			</div>
		</div>
	);
};