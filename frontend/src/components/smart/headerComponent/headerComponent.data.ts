//Интерфейс с типами данных
import { IIcon } from './headerComponent.interface.ts';
//Иконки для HeaderComponent
import { RiFolderDownloadLine } from 'react-icons/ri';
import { MdFavoriteBorder } from 'react-icons/md';

export const ICON: IIcon[] = [
	{
		id: 1,
		title: 'Скаченные',
		icon: RiFolderDownloadLine,
		link: '/download',
	},
	{
		id: 2,
		title: 'Избранное',
		icon: MdFavoriteBorder,
		link: '/favorite',
	}
];
