//Интерфейс для PSDWindowComponent
import {ReactNode} from 'react';

export interface IPSDWindowComponent {
	message: string;
	active: boolean;
	setActive: (active: boolean) => void,
	type: string,
	actions?: ReactNode
}