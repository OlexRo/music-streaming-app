// Функциональный компонент
import {
	FC,
	useEffect,
	useState,
	useCallback,
	useMemo
} from 'react';
// Интерфейс
import { IPSDWindowComponent } from './PSDWindowComponent.interface.ts';
// React-component
import { ButtonComponent } from '../../ui/buttonComponent/buttonComponent.tsx';

export const PSDWindowComponent: FC<IPSDWindowComponent> = ({
		message,
		active,
		setActive,
		actions
	}) => {

	// Анимация загрузки
	const [loading, setLoading] = useState(false);

	//Эффект загрузки
	useEffect(() => {
		if (active) {
			setLoading(true);
			const timer = setTimeout(() => {
				setLoading(false);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [active]);

	//Использование useMemo для классов
	const overlayClasses = useMemo(() => `fixed inset-0 flex justify-center items-center bg-fonBlock bg-opacity-70 transition-opacity duration-500 z-50
		${active
		? 'opacity-100 pointer-events-auto' 
		: 'opacity-0 pointer-events-none'}`, [active]);

	//Использование useMemo для классов
	const modalClasses = useMemo(() => `flex justify-center items-center mt-[100px] p-5 min-h-[100px] min-w-[200px] bg-blockWhite rounded-[10px] transform transition-all duration-500 ease-in-out
		${active 
		? 'scale-100 translate-y-0 opacity-100' 
		: 'scale-95 translate-y-10 opacity-0'}`, [active]);

	//Использование useMemo для классов
	const handleClose = useCallback(() => {
		setActive(false);
	}, [setActive]);

	return (
		<div
			className={overlayClasses}
			onClick={handleClose}
		>
			<div
				className={modalClasses}
				onClick={(e) => e.stopPropagation()}
			>
				<div className='flex text-dullGray flex-col justify-center items-center'>
					<div className={`message-text ${loading ? 'animate-scroll' : ''}`}>
						{message}
						{actions}
					</div>
					{!actions && (
						<ButtonComponent
							className='w-[100px] mt-4 border-royalBlue'
							loading={loading}
							onClick={handleClose}
						>
							{loading ? '' : 'ОК'}
						</ButtonComponent>
					)}
				</div>
			</div>
		</div>
	);
};

