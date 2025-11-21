//Функциональный компонент
import {
	FC,
	ReactNode
} from 'react';

//Интерфейс для LayoutProfileAdminComponent
export interface ILayoutProfileAdminComponent {
	leftContent?: ReactNode;
	centerContent?: ReactNode;
	rightContent?: ReactNode;
}

export const LayoutProfileAdminComponent:FC<ILayoutProfileAdminComponent> = ({
		leftContent,
		centerContent,
		rightContent
	}) => {
	return (
		<div className='w-full h-full flex gap-0 my2xl:gap-10 flex-col my2xl:flex-row'>
			<div className='w-full my2xl:w-[40%] my2xl:order-1'>  {/* Левый контент */}
				{leftContent}
			</div>
			<div className='w-full my2xl:order-2'>  {/* Центральный контент */}
				{centerContent}
			</div>
			<div className='w-full my2xl:w-[40%] my2xl:order-3 '>  {/* Правый контент */}
				{rightContent}
			</div>
		</div>
	);
};

