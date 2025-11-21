//Интерфейс песни
export interface Song {
	singer?: string;
	photo?: string;
	title?: string;
	songFile?: string;
	album?: Album;
}

//Интерфейс альбома
export interface Album {
	id: number;
	title: string;
	date: string;
	description: string;
	photo: string;
	singerId: number;
	singer: Singer;
}

//Интерфейс певца
export interface Singer {
	id: number;
	name: string;
	dateLive: string;
	country: string;
	photo: string;
}

//Интерфейс списка песен
export interface ISongList {
	listName?: string;
	songs?: Song[];
}

//Интерфейс для компонента MusicBarComponent
export interface IMusicBar {
	currentSongIndex?: number;
	currentSongListName?: string;
	songLists?: ISongList[];
	selectSong?: (listName: string, songIndex: number) => void;
	isPlaying: boolean;
	setIsPlaying: (value: boolean) => void;
}