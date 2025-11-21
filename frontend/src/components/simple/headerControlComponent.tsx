//Функциональный компонент
import { FC } from 'react';
//Объект с данными для headerComponent
import { ICON } from '../smart/headerComponent/headerComponent.data.ts';
//React-router
import { Link } from 'react-router-dom';

export const HeaderControlComponent:FC = () => {
	return (
		<div className='hidden xl:flex items-end gap-3'>
			{ICON.map(item => (
				<Link to={item.link} title={item.title} key={item.id}>
					{<item.icon
						size={25}
						className='transition-all duration-300 cursor-pointer hover:text-royalBlue'
					/>}
				</Link>
			))}
		</div>
	);
};

