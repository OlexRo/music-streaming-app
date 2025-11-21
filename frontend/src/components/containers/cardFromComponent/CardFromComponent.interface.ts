import { ReactNode } from 'react';

//Интерфейс для cardFromComponent
export interface ICardFrom{
	title?: string;
	href?: string;
	showEvery?: string;
	children?: ReactNode;
	className?: string;
	allCategory?: ReactNode
}