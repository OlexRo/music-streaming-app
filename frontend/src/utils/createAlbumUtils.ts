import { RegisterOptions } from 'react-hook-form';

//Интерфейс для CreateAlbumComponent
interface IFormsDataAlbum {
	title?: string;
	photo?: FileList;
	description?: string;
	singerId?: string;
	yearRelease?: number;
}

// Валидация названия альбома
export const titleValidation = (): RegisterOptions<IFormsDataAlbum, 'title'> => ({
	required: 'Требуется название альбома',
	minLength: {
		value: 2,
		message: 'Название должно содержать минимум 2 символа'
	},
	maxLength: {
		value: 100,
		message: 'Название не должно превышать 100 символов'
	},
});

// Валидация даты релиза
export const yearValidation = (): RegisterOptions<IFormsDataAlbum, 'yearRelease'> => ({
	required: 'Требуется указать год релиза',
	validate: {
		isValidYear: (value) => {
			const year = parseInt(String(value), 10);
			return !isNaN(year) && year > 1800 && year <= new Date().getFullYear()
				? true
				: 'Введите корректный год';
		},
	},
});

// Валидация описания
export const descriptionValidation = (): RegisterOptions<IFormsDataAlbum, 'description'> => ({
	required: 'Требуется описание',
	minLength: {
		value: 10,
		message: 'Описание должно быть не менее 10 символов'
	},
	maxLength: {
		value: 500,
		message: 'Описание не должно превышать 500 символов'
	},
});