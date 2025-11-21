//Интерфейс для обновляемых значений
export interface IUpdateCategoryFormValues {
	title: string;
	description: string;
	photo?: File;
}

//Интерфейс для UpdateCategoryProps
export interface IUpdateCategoryProps {
	categoryId: number;
}