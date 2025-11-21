//Функциональный компонент
import { FC } from 'react';

export const LoadingComponent:FC = () => {
	return (
		<div className='h-full flex justify-center items-center'>
			<div className='loading-container'>
				<div className='loading-spinner'></div>
				<div className='loading-text'>
					<span className='text-royalBlue font-normal'>Загрузка</span> <span
					className='loading-dots'><span>.</span><span>.</span><span>.</span></span>
				</div>
			</div>
		</div>
	);
};

