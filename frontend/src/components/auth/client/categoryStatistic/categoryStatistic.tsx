//Функциональный компонент
import {
	useEffect,
	useState
} from 'react';
//Работа с запросами
import axios from 'axios';
//React-components
import { Bar } from 'react-chartjs-2';
import {
	ChartData,
	ChartOptions
} from 'chart.js';
import { CategoryScale } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';
import { CardFromComponent } from '../../../containers/cardFromComponent/CardFromComponent.tsx';

//Интерфейс для
interface Song {
	id: number;
	title: string;
	categoryId: number;
	category: {
		id: number;
		title: string;
	};
}

//Интерфейс для fetchData
interface Favorite {
	songId: number;
	song: Song;
}

//Интерфейс для fetchData
interface Download {
	songId: number;
	song: Song;
}

//Регистрируем шкалу для диаграммы
ChartJS.register(CategoryScale);

export const CategoryStatistic = () => {
	//Состояние для хранения данных диаграммы
	const [chartData, setChartData] = useState<ChartData<'bar'>>({} as ChartData<'bar'>);

	useEffect(() => {
		//Функция для получения данных с API
		const fetchData = async () => {
			try {
				//Получаем данные о фаворитах и загрузках с API
				const [favoritesResponse, downloadsResponse] = await Promise.all([
					axios.get<Favorite[]>('http://localhost:5000/favorite/all-favorites-public'),
					axios.get<Download[]>('http://localhost:5000/download/all-download-public'),
				]);

				//Объект для подсчета количества по категориям
				const categoriesCount: Record<number, { count: number; title: string }> = {};
				//Обрабатываем данные фаворитов
				favoritesResponse.data.forEach((item) => {
					const { categoryId, category } = item.song;
					if (categoriesCount[categoryId]) {
						categoriesCount[categoryId].count += 1;
					} else {
						categoriesCount[categoryId] = { count: 1, title: category.title };
					}
				});

				//Обрабатываем данные загрузок
				downloadsResponse.data.forEach((item) => {
					const { categoryId, category } = item.song;
					if (categoriesCount[categoryId]) {
						categoriesCount[categoryId].count += 1;
					} else {
						categoriesCount[categoryId] = { count: 1, title: category.title };
					}
				});

				//Сортируем категории по количеству и берем топ-3
				const sortedCategories = Object.values(categoriesCount)
					.sort((a, b) => b.count - a.count)
					.slice(0, 3);

				//Подготавливаем данные для диаграммы
				const labels = sortedCategories.map((category) => category.title);
				const data = sortedCategories.map((category) => category.count);

				//Устанавливаем данные диаграммы в состояние
				setChartData({
					labels,
					datasets: [
						{
							label: '', //Устанавливаем метку как пустую строку
							data,
							backgroundColor: [
								'rgba(75, 192, 192, 0.6)',
								'rgba(153, 102, 255, 0.6)',
								'rgba(255, 159, 64, 0.6)',
							],
							borderColor: [
								'rgba(75, 192, 192, 1)',
								'rgba(153, 102, 255, 1)',
								'rgba(255, 159, 64, 1)',
							],
							borderWidth: 1,
							barThickness: 30, //Устанавливаем желаемую высоту блока
						},
					],
				});
			} catch (error) {
				//Обрабатываем ошибки
				console.error('Ошибка при получении данных:', error);
			}
		};

		//Вызываем функцию для получения данных
		fetchData().catch((error) => {
			console.error('Произошла ошибка:', error);
		});
	}, []);

	// Настройки диаграммы
	const options: ChartOptions<'bar'> = {
		indexAxis: 'y', //Горизонтальная диаграмма
		scales: {
			x: {
				beginAtZero: true,
				grid: {
					display: false, //Отключаем сетку по оси X
				},
			},
			y: {
				grid: {
					display: false, //Отключаем сетку по оси Y
				},
				ticks: {
					display: false, //Скрываем метки по оси Y
				},
			},
		},
		plugins: {
			legend: {
				display: false, //Отключаем отображение легенды
			},
		},
	};

	return (
		<CardFromComponent title='СТАТИСТИКА КАТЕГОРИЙ'>
			<div className='h-[150px] w-[250px] sm:w-full'>
				{/* Показываем диаграмму, если данные загружены */}
				{chartData.labels ? (
					<Bar
						data={chartData}
						options={options}
					/>
				) : (
					<p>Загрузка данных...</p>
				)}
			</div>
		</CardFromComponent>
	);
};