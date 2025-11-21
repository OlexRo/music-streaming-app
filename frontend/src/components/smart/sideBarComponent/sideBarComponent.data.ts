//Интерфейс с типами данных
import { ISideBar } from './sideBarComponent.interface.ts';
//Иконки для Sidebar
import { TiHome } from 'react-icons/ti';
import {
	FaCompass,
	FaUser
} from 'react-icons/fa';
import { IoMusicalNotes } from 'react-icons/io5';
import {
	MdFavorite,
	MdLibraryMusic
} from 'react-icons/md';
import { HiUsers } from 'react-icons/hi';
import { TfiMenuAlt } from 'react-icons/tfi';
import { RiFolderDownloadFill } from 'react-icons/ri';
import { BiSolidExit } from 'react-icons/bi';

export const MENU: ISideBar[] = [
	{
		id: 1,
		title: 'МЕНЮ',
		submenu: [
			{
				id: 11,
				title: 'Главная',
				icon: TiHome,
				link: '/',
				url: '/'
			},
			{
				id: 22,
				title: 'Исследовать',
				icon: FaCompass,
				link: '/explore',
				url: '/explore'
			}
		]
	},
	{
		id: 2,
		title: 'МЕДИАТЕКА',
		submenu: [
			{
				id: 111,
				title: 'Все песни',
				icon: IoMusicalNotes,
				link: '/allMusic',
				url: '/allMusic'
			},
			{
				id: 222,
				title: 'Альбомы',
				icon: MdLibraryMusic,
				link: '/albums',
				url: '/albums'
			},
			{
				id: 333,
				title: 'Певцы',
				icon: HiUsers,
				link: '/singers',
				url: '/singers'
			},
			{
				id: 444,
				title: 'Категории',
				icon: TfiMenuAlt,
				link: '/categories',
				url: '/categories'
			},
		]
	},
	{
		id: 3,
		title: 'ПЛЕЙЛИСТ',
		submenu: [
			{
				id: 1111,
				title: 'Избранное',
				icon: MdFavorite,
				link: '/favorite',
				url: '/favorite'
			},
			{
				id: 2222,
				title: 'Загрузки',
				icon: RiFolderDownloadFill,
				link: '/download',
				url: '/download'
			},
		]
	},
	{
		id: 4,
		title: 'ДРУГОЕ',
		submenu: [
			{
				id: 111111,
				title: 'Профиль',
				icon: FaUser,
				link: '/',
				url: '/dashboardUser' || '/dashboardAdmin'
			},
			{
				id: 22222,
				title: 'Выход',
				icon: BiSolidExit,
				link: '/',
				url: '/exit'
			},
		]
	}
];
