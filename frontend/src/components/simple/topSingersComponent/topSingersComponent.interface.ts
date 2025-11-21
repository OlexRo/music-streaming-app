import { MouseEvent } from 'react';

//Интерфейс для TopSingersComponent
export interface ITopSingers {
	subtitle: string;
	src: string;
	subscribers?: number | string;
	onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}
