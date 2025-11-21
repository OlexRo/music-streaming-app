//Функциональный компонент
import {
	FC,
	ReactNode,
	useEffect,
	useRef,
	useCallback,
	useMemo
} from 'react';

//Интерфейс для Modal
interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

export const Modal: FC<ModalProps> = ({
		isOpen,
		onClose,
		children
	}) => {

	//Ссылка на закрытие модального окна
	const modalRef = useRef<HTMLDivElement>(null);

	//Закрытие модального окна при клике вне его области
	const handleOutsideClick = useCallback((event: MouseEvent) => {
		if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
			onClose(); // Закрытие окна, только если клик был вне его
		}
	}, [onClose]);

	//Логика для закрытия модального окна
	useEffect(() => {
		if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, [isOpen, handleOutsideClick]);
	if (!isOpen) return null;


	//Использование useMemo для оптимизации стилей
	const modalClasses = useMemo(() => 'absolute -mt-14 w-max bg-blockWhite z-40', []);
	const contentClasses = useMemo(() => 'p-[10px] flex flex-col gap-5 justify-center items-center w-[50px] rounded-[10px] bg-blockWhite custom-shadow', []);

	return (
		<div className={modalClasses}>
			<div
				ref={modalRef}
				className={contentClasses}
			>
				{children}
			</div>
		</div>
	);
};
