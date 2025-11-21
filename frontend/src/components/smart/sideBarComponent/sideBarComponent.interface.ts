//React-icon
import { IconType } from 'react-icons';

// Интерфейс для SideBarComponent
export interface ISideBarComponent {
	setPSDWindowActive: (active: boolean) => void;
	onMassage: (message: string) => void;
}

// Интерфейс для sideBarComponent
export interface ISideBar {
	id: number;
	title: string;
	submenu: ISubmenu[];
}

// Интерфейс для подменю
export interface ISubmenu {
	id: number;
	title: string;
	icon: IconType;
	link: string;
	url: string;
}