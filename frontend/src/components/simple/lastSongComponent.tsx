//Функциональный компонент
import {
	FC,
	MouseEvent
} from 'react';

//Интерфейс для LastSongComponent
interface ISongComponent {
	src: string;
	title: string,
	singer: string,
	onClick?: (event: MouseEvent<HTMLDivElement>) => void,
	className?: string,
}

export const LastSongComponent: FC<ISongComponent> = ({
		src,
		title,
		singer,
		onClick
	}) => {
	return (
		<div
			className='cursor-pointer flex flex-col items-center songCustAdupt'
			onClick={onClick}
		>
			<img
				src={src}
				alt={title}
				title={title}
				className='w-[100px] h-[100px] object-cover rounded-[10px] custom-shadow'
			/>
			<div className='flex flex-col'>
				<div className='text-center mt-1 w-[120px] inline-block overflow-hidden text-ellipsis whitespace-nowrap'>
					{title}
				</div>
				<div className='text-center mt-1 w-[120px] text-sm inline-block overflow-hidden text-ellipsis whitespace-nowrap'>
					{singer}
				</div>
			</div>
		</div>
	);
};