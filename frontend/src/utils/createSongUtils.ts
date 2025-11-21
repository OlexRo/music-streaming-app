import { RegisterOptions } from 'react-hook-form';

//Интерфейс для валидации песни
interface IFormDataSong {
	title?: string;
	photo?: FileList;
	songFile?: FileList;
	albumId?: string;
	singerId?: string;
	categoryId?: string;
	yearRelease?: number;
}

//Валидация названия песни
export const titleValidation = (): RegisterOptions<IFormDataSong, 'title'> => ({
	required: 'Требуется название песни',
	minLength: {
		value: 2,
		message: 'Название должно содержать минимум 2 символа'
	},
	maxLength: {
		value: 100,
		message: 'Название не должно превышать 100 символов'
	},
});

//Валидация музыкального файла
export const songFileValidation = (): RegisterOptions<IFormDataSong, 'songFile'> => ({
	required: 'Требуется выбрать файл песни',
});

//Валидация альбома
export const albumIdValidation = (): RegisterOptions<IFormDataSong, 'albumId'> => ({
	required: 'Требуется выбрать альбом',
});

//Валидация даты
export const dateValidation = (): RegisterOptions<IFormDataSong, 'yearRelease'> => ({
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