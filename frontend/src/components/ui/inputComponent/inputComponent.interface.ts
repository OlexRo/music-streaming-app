import {
	ChangeEvent,
	ReactNode
} from 'react';

export interface IInputComponent {
	id?: string;
	className?: string;
	icon?: ReactNode;
	icon2?: ReactNode;
	placeholder?: string;
	type?: string;
	[key: string]: any;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
