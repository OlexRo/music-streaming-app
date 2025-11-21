//Интерфейс для CategoryPage
export interface ICategoryPage {
	selectSong: (listName: string, songIndex: number) => void;
	updateSongList: (songs: Song[], listName: string) => void;
	updateCategorySongs: (album: Album) => void;
}

//Интерфейс для певца
interface Singer {
	id: number;
	name: string;
	dateLive: string;
	country: string;
	photo: string;
}

//Интерфейс для альбома
interface Album {
	id: number;
	title: string;
	date: string;
	description: string;
	photo: string;
	singerId: number;
	singer: Singer;
}

//Интерфейс для песни
interface Song {
	id: number;
	title: string;
	photo: string;
	songFile: string;
	date: string;
	albumId: number;
	singerId: number;
	categoryId: number;
	album: Album;
}

//Интерфейс для категории
export interface Category {
	id: number;
	title: string;
	description: string;
	photo: string;
	songs: Song[];
}