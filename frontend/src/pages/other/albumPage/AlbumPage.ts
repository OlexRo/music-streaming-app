//Интерфейс для AlbumPage
export interface IAlbumPage {
	selectSong: (listName: string, songIndex: number) => void;
	updateSongList: (songs: Song[], listName: string) => void;
	updateAlbumSongs: (album: Album) => void;
}

//Интерфейс для альбома
export interface Album {
	id: number;
	title: string;
	yearRelease: string;
	description: string;
	photo: string;
	singerId: number;
	singer: Singer;
	songs: Song[];
}

//Интерфейс для певца
interface Singer {
	id: number;
	name: string;
	dateLive: string;
	country: string;
	photo: string;
}

//Интерфейс для песни
export interface Song {
	id: number;
	title: string;
	photo: string;
	songFile: string;
	date: string;
	albumId: number;
	singerId: number;
	categoryId: number;
	category: Category;
	album: Album;
	duration?: number | undefined
}

//Интерфейс для категории
interface Category {
	id: number;
	title: string;
	description: string;
	photo: string;
}