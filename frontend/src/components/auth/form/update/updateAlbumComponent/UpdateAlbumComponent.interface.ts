//Интерфейс для обновляемых значений
export interface IUpdateAlbumFormValues {
	title?: string;
	photo?: FileList;
	description?: string;
	singerId?: string;
	yearRelease?: number;
}

//Интерфейс для UpdateAlbumProps
export interface IUpdateAlbumProps {
	albumId: number | undefined;
}