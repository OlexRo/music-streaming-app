//Интерфейс для LastAlbumComponent
export interface ILastSong {
	singer: string,
	songName: string,
	description: string,
	numberLikes: string,
	time?: string,
	onClick: () => void,
}