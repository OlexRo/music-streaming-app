//Функциональный компонент
import {
	FC,
	useCallback,
	useMemo
} from 'react';
//Интерфейс
import { IModalComponent } from './modalComponent.interface.ts';

export const ModalComponent: FC<IModalComponent> = ({
		children,
		active,
		setActive,
		img,
		className,
		classNameModal
	}) => {

	// Использование useMemo для классов
	const overlayClasses = useMemo(() => `fixed inset-0 flex items-center justify-center bg-fonBlock bg-opacity-70 transition-opacity duration-500 z-40
	${active
		? 'opacity-100 pointer-events-auto'
		: 'opacity-0 pointer-events-none'}`, [active]);

	// Использование useMemo для классов
	const modalClasses = useMemo(() => `flex ${classNameModal}
	${img
		? 'w-[450px] sm:w-[55vw] min-h-[600px]'
		: 'w-[400px] h-auto'} 
		bg-blockWhite rounded-[10px] transform transition-all duration-500 ease-in-out
		${active
		? 'scale-100 translate-y-0 opacity-100'
		: 'scale-95 translate-y-10 opacity-0'}`, [active, img, classNameModal]);

	// Использование useMemo для классов
	const contentClasses = useMemo(() => `flex flex-col justify-center pb-[40px] pt-[40px] pl-0
	${img
		? 'w-[100%] items-center my2xl:w-[50%] myXl2:pl-[60px] my2xl:items-start'
		: 'w-[100%] items-center'}`, [img]);

	// Функция для закрытия модального окна
	const handleClose = useCallback(() => {
		setActive(false);
	}, [setActive]);

	return (
		// Оверлей с задержкой удаления
		<div className={overlayClasses} onClick={handleClose}>
			{/* Окно модального окна, остановка всплытия */}
			<div
				className={modalClasses}
				onClick={(e) => e.stopPropagation()}
			>
				<div className={contentClasses}>
					{children}
				</div>
				{img && (
					<img
						src={img}
						alt='Modal content'
						title='Modal content'
						className={className}
					/>
				)}
			</div>
		</div>
	);
};

