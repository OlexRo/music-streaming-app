//работа с формой
import { RegisterOptions } from 'react-hook-form';

//Валидация пароля
export const passwordValidation = (): RegisterOptions => ({
	required: 'Необходим пароль',
	minLength: {
		value: 6,
		message: 'Пароль должен быть не менее 6 знаков',
	},
	pattern: {
		value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
		message: 'Пароль должен содержать 1 букву и 1 цифру',
	},
});

//Валидация логина
export const loginValidation = (): RegisterOptions => ({
	required: 'Требуется логин',
});

//Валидация имени
export const nameValidation = (): RegisterOptions => ({
	required: 'Требуется имя',
});

//Валидация фамилии
export const surnameValidation = (): RegisterOptions => ({
	required: 'Требуется фамилия',
});

//Валидация фото
export const photoValidation = (): RegisterOptions => ({
	required: 'Фото требуется',
	validate: (value: FileList) => {
		if (value.length > 0 && value[0].size > 2000000) {
			return 'Размер фото не должен превышать 2 МБ';
		}
		return true;
	},
});

