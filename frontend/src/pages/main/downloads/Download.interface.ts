export interface ISong {
	id: number;
	title: string;
	photo: string;
	songFile: string;
	date: string;
	albumId: number;
	singerId: number;
	categoryId: number;
	songId: number | string | undefined;
	album: IAlbum;
	category: ICategory;
	duration?: number | undefined
}

interface IAlbum {
	id: number;
	title: string;
	date: string;
	description: string;
	photo: string;
	singerId: number;
	singer: ISinger;
}

interface ISinger {
	id: number;
	name: string;
	dateLive: string;
	country: string;
	photo: string;
}

interface ICategory {
	id: number;
	title: string;
	description: string;
	photo: string;
}

export interface IMainDownload {
	songId: number | string | undefined;
	flag: number;
	song: ISong;
}

//Интерфейс для Download
export interface IDownload {
	selectSong: (listName: string, songIndex: number) => void;
	updateSongList: (songs: ISong[], list2: string) => void;
}