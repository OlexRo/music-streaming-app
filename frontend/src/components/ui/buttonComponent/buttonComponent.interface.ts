import { ReactNode } from 'react';

export interface IButtonComponent {
	className?: string;
	children: ReactNode;
	icon?: ReactNode;
	loading?: boolean;
	onClick?: () => void;
}