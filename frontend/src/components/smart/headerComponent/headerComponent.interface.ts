//React-icons
import { IconType } from 'react-icons';
import {ReactNode} from 'react';

//Интерфейс для HeaderComponent
export interface IHeader {
	searcControl: ReactNode,
	setModalActive: (active: boolean) => void;
}

//Интерфейс для HeaderComponent.data
export interface IIcon {
	id: number;
	title: string;
	icon: IconType;
	link: string;
}