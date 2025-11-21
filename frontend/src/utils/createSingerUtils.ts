//React-hook-form
import { RegisterOptions } from 'react-hook-form';

//Интерфейс для CreateSingerComponent
interface IFormsDataSinger {
	name: string;
	dateLive: string;
	country: string;
	photo: FileList;
}

//Валидация имени
export const nameValidation = (): RegisterOptions<IFormsDataSinger, 'name'> => ({
	required: 'Требуется имя',
	minLength: {
		value: 2,
		message: 'Имя должно содержать минимум 2 символа',
	},
	maxLength: {
		value: 50,
		message: 'Имя не должно превышать 50 символов',
	},
});

//Валидация даты жизни
export const dateLiveRangeValidation = (): RegisterOptions<IFormsDataSinger, 'dateLive'> => ({
	required: 'Требуется указать год или диапазон годов жизни',
	pattern: {
		// Допустим как один год (ГГГГ), так и диапазон годов (ГГГГ-ГГГГ)
		value: /^\d{4}(-\d{4})?$/,
		message: 'Год или диапазон должен быть в формате ГГГГ или ГГГГ-ГГГГ',
	},
	validate: (value: string) => {
		// Если введен диапазон годов
		if (value.includes('-')) {
			const [startYear, endYear] = value.split('-').map(Number); // Разделяем диапазон на два года
			if (isNaN(startYear) || isNaN(endYear)) {
				return 'Оба значения должны быть корректными годами';
			}
			if (startYear > endYear) {
				return 'Начальный год не может быть больше конечного года';
			}
			if (startYear < 1800 || endYear > new Date().getFullYear()) {
				return 'Годы должны быть между 1800 и текущим годом';
			}
		} else {
			// Если введен один год (означает, что певец еще жив)
			const year = Number(value);
			if (isNaN(year)) {
				return 'Год должен быть числом';
			}
			if (year < 1800 || year > new Date().getFullYear()) {
				return 'Год должен быть между 1800 и текущим годом';
			}
		}
		return true;
	},
});
