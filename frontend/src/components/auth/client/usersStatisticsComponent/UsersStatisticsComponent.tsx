//Функциональный компонент
import {
	FC,
	useEffect,
	useState
} from 'react';
//Работа с запросами
import axios from 'axios';
import { useShowAllUser } from '../../../../utils/axios/useShowAllUsers.tsx';
//React-components
import { CardFromComponent } from '../../../containers/cardFromComponent/CardFromComponent.tsx';
import { UserComponent } from '../../../object/userComponent.tsx';
import {
	Chart,
	Axis,
	Line,
	Point,
	Area
} from 'bizcharts';
//Функции
import { useChartSize } from '../../../../utils/adaptation/ChartSizeComponent.tsx';

//Интерфейс для analyzeUserActivity
interface UserActivity {
	userId: number;
	userName: string;
	downloads: number;
	favorites: number;
	total: number; // Общее количество активностей
}

//Получаем все данные об избранных песнях
const fetchFavoriteData = async () => {
	const response = await axios.get('http://localhost:5000/favorite/all-favorites-public');
	return response.data;
};

//Получаем все данные о скаченных песнях
const fetchDownloadData = async () => {
	const response = await axios.get('http://localhost:5000/download/all-download-public');
	return response.data;
};

//Формируем данные для графика
const analyzeUserActivity = (users: any[], favoriteData: any[], downloadData: any[]): UserActivity[] => {
	const userActivityMap: { [key: number]: UserActivity } = {};
	//Анализ данных о добавлениях в избранное
	favoriteData.forEach(item => {
		const userId = item.userId;
		const user = users.find(user => user.id === userId && user.role !== 'admin');
		if (user) {
			if (!userActivityMap[userId]) {
				userActivityMap[userId] = { userId, userName: user.login, downloads: 0, favorites: 0, total: 0 };
			}
			userActivityMap[userId].favorites += 1;
		}
	});
	//Анализ данных о скачиваниях
	downloadData.forEach(item => {
		const userId = item.userId;
		const user = users.find(user => user.id === userId && user.role !== 'admin');
		if (user) {
			if (!userActivityMap[userId]) {
				userActivityMap[userId] = { userId, userName: user.login, downloads: 0, favorites: 0, total: 0 };
			}
			userActivityMap[userId].downloads += 1;
		}
	});
	// Подсчет общего количества
	Object.values(userActivityMap).forEach(activity => {
		activity.total = activity.downloads + activity.favorites;
	});
	return Object.values(userActivityMap)
		.filter(activity => activity.total > 0)
		.sort((a, b) => b.total - a.total)
		.slice(0, 4);
};

export const UsersStatisticsComponent: FC = () => {
	//Получение данных пользователя
	const { users } = useShowAllUser();
	//Работаем с шириной и высотой графика
	const { chartWidth, chartHeight } = useChartSize();
	//Работаем со статистикой
	const [userActivity, setUserActivity] = useState<UserActivity[]>([]);

	//Выводим статистику
	useEffect(() => {
		const fetchData = async () => {
			const favoriteData = await fetchFavoriteData();
			const downloadData = await fetchDownloadData();
			const activity = analyzeUserActivity(users, favoriteData, downloadData);
			setUserActivity(activity);
		};
		if (users.length > 0) {
			fetchData().catch(error => {
				console.error('Ошибка вывода', error);
			});
		}
	}, [users]);

	//Получаем идентификаторы пользователей, которые присутствуют в userActivity
	const activeUserIds = userActivity.map(activity => activity.userId);

	//Сортируем пользователей по активности
	const sortedUsers = users
		.filter(user => user.role !== 'admin' && activeUserIds.includes(user.id))
		.sort((a, b) => {
			const aActivity = userActivity.find(activity => activity.userId === a.id);
			const bActivity = userActivity.find(activity => activity.userId === b.id);
			const aTotal = (aActivity?.downloads || 0) + (aActivity?.favorites || 0);
			const bTotal = (bActivity?.downloads || 0) + (bActivity?.favorites || 0);
			return bTotal - aTotal;
		});

	return (
		<CardFromComponent title='СТАТИСТИКА ПОЛЬЗОВАТЕЛЕЙ'>
			<div className='flex flex-col my2xl:flex-row justify-between'>
				<div className='w-full'>
					<div className='w-full flex flex-col gap-5'>
						{sortedUsers.slice(0, 4).map((user, index) => {
							const userActivityData = userActivity.find(activity => activity.userId === user.id);
							const downloadPercentage = userActivityData ? (userActivityData.downloads / userActivityData.total) * 100 : 0;
							const favoritesPercentage = userActivityData ? (userActivityData.favorites / userActivityData.total) * 100 : 0;
							return (
								<UserComponent
									key={index}
									index={String(index + 1).padStart(2, '0')}
									src={`http://localhost:5000/uploads/imageUser/${user.photo}`}
									login={user.login}
									role={String(index + 1).padStart(1, '0') + ' - ' + 'место'}
									bun={favoritesPercentage.toFixed(0) + '%' + ' ' + 'избр.'}
									date={downloadPercentage.toFixed(0) + '%' + ' ' + 'скач.'}
									userId={user.id}
									initialStatus={user.status}
									showStatus={true}
									isToggleButtonVisible={false}
								/>
							);
						})}
					</div>
				</div>
				<div className='flex justify-center mt-12 my2xl:mt-0 items-center'>
					<Chart
						height={chartHeight}
						width={chartWidth}
						data={userActivity}
						forceFit
					>
						<Axis
							name='userName'
							label={{ formatter: val => val }}
						/>
						<Axis
							name='downloads'
							label={{ formatter: val => `${val} скач.` }}
						/>
						<Axis
							name='favorites'
							label={{ formatter: val => `${val} избран.` }}
						/>
						<Area
							position='userName*downloads'
							color='blue'
							shape='smooth'
							style={{
								fillOpacity: 0.1,
							}}
						/>
						<Area
							position='userName*favorites'
							color='#4ab767'
							shape='smooth'
							style={{
								fillOpacity: 0.1,
							}}
						/>
						<Line
							position='userName*downloads'
							size={2}
							color='#1B89D3'
							shape='smooth'
						/>
						<Line
							position='userName*favorites'
							size={2}
							color='#4ab767'
							shape='smooth'
						/>
						<Point
							position='userName*downloads'
							size={4}
							color='#1B89D3'
						/>
						<Point
							position='userName*favorites'
							size={4}
							color='city'
						/>
					</Chart>
				</div>
			</div>
		</CardFromComponent>
	);
};
