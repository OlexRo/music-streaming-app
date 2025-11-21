import {
	MouseEvent,
	ReactNode
} from 'react';

//Интерфейс для MusicComponent
export interface IMusicComponent {
	index: string,
	src: string;
	title: string,
	singer: string,
	category?: string,
	album?: string
	onClick?: (event: MouseEvent<HTMLDivElement>) => void,
	className?: string,
	songId?: number | undefined | string,
	userId?: number,
	modal?: ReactNode,
	setModalActive?: (active: boolean) => void,
	setPSDWindowActive?: (active: boolean) => void,
	onMassage?: (message: string) => void,
	onDeleteSong?: (songId: number) => void;
	duration?: string
}