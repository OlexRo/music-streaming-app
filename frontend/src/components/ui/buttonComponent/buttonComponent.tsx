//Функциональный компонент
import { FC } from 'react';
//Интерфейс
import {IButtonComponent} from './buttonComponent.interface.ts';

		export const ButtonComponent: FC<IButtonComponent> = ({
		className = '',
		children,
		icon,
		loading = false,
		onClick
	}) => {
	return (

		<button
			type='submit'
			className={`transition-all duration-400 cursor-pointer hover:scale-[1.01] h-[35px] rounded-[5px] border 
			${className} 
			${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
			disabled={loading}
			onClick={onClick}
		>
			<div className='flex justify-center items-center gap-2 text-royalBlue'>
				{loading ? (
					<div className='spinner'></div> // Показываем спиннер при загрузке
				) : (
					<>
						{children}
						{icon}
					</>
				)}
			</div>
		</button>
	);
};

