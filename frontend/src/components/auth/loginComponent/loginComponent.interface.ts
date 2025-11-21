// Интерфейс для авторизации
import { FieldValues } from 'react-hook-form';

export interface IAuth {
	setModalActive: (active: boolean) => void;
	setPSDWindowActive: (active: boolean) => void;
	onMassage: (message: string) => void;
}

// Интерфейс для полей авторизации
export interface IFormsDataAuth extends FieldValues {
	login: string;
	name: string;
	surname: string;
	password: string;
	photo: FileList;
}

// Интерфейс для ответа при авторизации
export interface IAuthResponse {
	user: any;
	token: string;
}