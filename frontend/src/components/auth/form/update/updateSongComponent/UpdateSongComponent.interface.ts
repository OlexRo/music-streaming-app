// Интерфейс для обновляемых значений
export interface IUpdateSongFormValues {
	title?: string;
	photo?: FileList;
	songFile?: FileList;
	albumId?: string;
	singerId?: string;
	categoryId?: string;
	yearRelease?: number;
}

// Интерфейс для UpdateSongForm
export interface IUpdateSongProps {
	songId?: number | undefined | string,
}