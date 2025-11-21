//Работа с формой
import { FieldValues } from 'react-hook-form';

//Интерфейс для регистрации
export interface IRegister {
	setModalActive: (active: boolean) => void;
	setPSDWindowActive: (active: boolean) => void;
	onMassage: (message: string) => void;
}

//Интерфейс для полей
export interface IFormsDataRegister extends FieldValues {
	login: string,
	name: string,
	surname: string,
	password: string,
	photo: FileList
}

//Интерфейс для ответа при регистрации
export interface IRegisterResponse {
	message: string;
}