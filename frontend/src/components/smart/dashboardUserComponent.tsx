//Функциональный компонент
import {
	FC,
	ReactNode,
	useCallback,
	useMemo
} from 'react';

//Интерфейс для DashboardUserComponent
interface IDashboardUserComponent {
	children: ReactNode,
	active: boolean,
	setActive: (active: boolean) => void,
	className: string,
	classNameModal: string,
}

export const DashboardUserComponent: FC<IDashboardUserComponent> = ({
		children,
		active,
		setActive,
		classNameModal
	}) => {

	//Использование useMemo для классов
	const overlayClasses = useMemo(() => `fixed w-full bg-fonBlock bg-opacity-60 inset-0 flex justify-end items-start transition-opacity duration-500 z-40
		${active
		? 'opacity-100 pointer-events-auto'
		: 'opacity-0 pointer-events-none'}`, [active]);

	//Использование useMemo для классов с анимацией появления справа
	const modalClasses = useMemo(() => `flex bg-blockWhite shadow-lg w-auto h-auto shadow-lg rounded-[10px] transform transition-all duration-500 ease-in-out 
			${classNameModal}
			${active
			? 'translate-x-0 opacity-100'    // Когда окно активно, оно на своем месте
			: 'translate-x-full opacity-0'}`, // Когда окно скрыто, оно полностью за правой границей
		[active, classNameModal]);

	//Использование useMemo для классов
	const contentClasses = useMemo(() => `flex flex-col justify-center p-4 w-full`, []);

	//Функция для закрытия модального окна
	const handleClose = useCallback(() => {
		setActive(false);
	}, [setActive]);

	return (
		//Оверлей без заднего фона и в правом верхнем углу
		<div
			className={overlayClasses}
			onClick={handleClose}
		>
			{/* Окно модального окна, остановка всплытия */}
			<div
				className={modalClasses}
				onClick={(e) => e.stopPropagation()}
			>
				<div className={contentClasses}>
					{children}
				</div>
			</div>
		</div>
	);
};
