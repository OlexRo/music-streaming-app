import {ReactNode} from 'react';


//Интерфейс для ModalComponent
export interface IModalComponent {
	children: ReactNode,
	active: boolean;
	img?: string;
	className?: string;
	classNameModal?: string;
	setActive: (active: boolean) => void,
}