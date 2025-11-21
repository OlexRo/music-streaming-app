import { ReactNode } from 'react';

//Интерфейс для LayoutComponent
export interface ILayout {
	childrenLeft?: ReactNode;
	childrenRight?: ReactNode;
}