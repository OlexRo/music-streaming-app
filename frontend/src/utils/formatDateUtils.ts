//Работа с датой
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDates = (dateString?: string) => {
	if (!dateString) return 'Неизвестная дата';
	const date = new Date(dateString);
	return format(date, 'd MMMM yyyy года', { locale: ru });
};

export const formatDatesYear = (dateString?: string) => {
	if (!dateString) return 'Неизвестная дата';
	const date = new Date(dateString);
	return format(date, 'yyyy', { locale: ru });
};