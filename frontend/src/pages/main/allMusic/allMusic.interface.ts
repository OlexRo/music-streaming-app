//Интерфейс для певца
export interface Song {
	id: number;
	title: string;
	photo: string;
	songFile: string;
	date: string;
	albumId: number;
	album: Album;
	category: Category;
	duration?: number | undefined
}

//Интерфейс для альбома
export interface Album {
	id: number;
	title: string;
	date: string;
	description: string;
	photo: string;
	singerId: number;
	singer: Singer;
}

//Интерфейс для певца
export interface Singer {
	id: number;
	name: string;
	dateLive: string;
	country: string;
	photo: string;
}

//Интерфейс для каталога
export interface Category {
	id: number;
	title: string;
	description: string;
}

//Интерфейс для Home
export interface IAllMusic {
	selectSong: (listName: string, songIndex: number) => void;
	updateSongList: (songs: Song[], list1: string) => void;
}