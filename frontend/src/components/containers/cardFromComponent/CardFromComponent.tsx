//Функциональный компонент
import {
	FC
} from 'react';
//Интерфейс
import { ICardFrom } from './CardFromComponent.interface.ts';
//React-router
import { Link } from 'react-router-dom';

export const CardFromComponent:FC<ICardFrom> = ({
		title,
		href = '#',
		showEvery,
		children,
		className,
		allCategory
	}) => {
	return (
		<div className={`pb-10 ${className}`}>
			<div className='w-full mb-3 flex items-center justify-between'>
				<h2 className='uppercase'>
					{title}
				</h2>
				<Link
					to={href}
					className='text-royalBlue'
				>
					{showEvery}
				</Link>
			</div>
			<div>
				<div>
					{allCategory}
				</div>
				{children}
			</div>
		</div>
	);
};