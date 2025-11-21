//Функциональный компонент
import {
	useEffect,
	useState
} from 'react';
//Работа с запросами
import axios from 'axios';
//React-components
import { CardFromComponent} from '../../../containers/cardFromComponent/CardFromComponent.tsx';
import { UserMessage} from '../userMessage/userMessage.tsx';
//Функция для работы с датой
import { formatDates} from '../../../../utils/formatDateUtils.ts';
//Работа с графиком
import { Pie } from 'react-chartjs-2';
import {
	ChartData,
	ChartOptions
} from 'chart.js';

// Определение типов для пользователя
interface User {
	id: number;
	status: '0' | '1';
	login: string;
	photo: string;
	album?: {
		singer: { name: string };
		title: string;
	};
}

// Определение типов для сообщения
interface Message {
	id: number;
	text: string;
	date: string;
	song: {
		login: string;
		photo: string;
	};
}

export const UserStatusChart = () => {
	// Определение состояния данных для диаграммы
	const [chartData, setChartData] = useState<ChartData<'pie'>>({
		labels: [],
		datasets: []
	});

	// Определение состояния для сообщений
	const [messages, setMessages] = useState<Message[]>([]);

	// Функция для получения данных о пользователях и обновления диаграммы
	const fetchUserData = async () => {
		try {
			const response = await axios.get<User[]>('http://localhost:5000/user/all-user');
			const users = response.data;
			const statusCount = {
				'Свободны': 0,
				'В рабстве': 0,
			};
			users.forEach(user => {
				if (user.status === '0') {
					statusCount['Свободны'] += 1;
				} else if (user.status === '1') {
					statusCount['В рабстве'] += 1;
				}
			});
			setChartData({
				labels: Object.keys(statusCount),
				datasets: [{
					label: 'Количество пользователей',
					data: Object.values(statusCount),
					backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
				}]
			});
		} catch (error) {
			console.error('Ошибка при получении данных пользователей:', error);
		}
	};

	// Функция для получения сообщений
	const fetchMessages = async () => {
		try {
			const response = await axios.get<Message[]>('http://localhost:5000/message/all-message');
			setMessages(response.data);
		} catch (error) {
			console.error('Ошибка при получении сообщений:', error);
		}
	};

	// Используем два отдельных эффекта для получения пользователей и сообщений
	useEffect(() => {
		// Получаем данные пользователей при монтировании компонента
		fetchUserData().catch(error => {
			console.error('Ошибка вывода:', error);
		});
		const intervalId = setInterval(fetchUserData, 3000); // Обновляем данные каждые 5 секунд
		return () => clearInterval(intervalId); // Очищаем интервал при размонтировании компонента
	}, []);

	useEffect(() => {
		// Получаем сообщения при монтировании компонента
		fetchMessages().catch(error => {
			console.error('Ошибка вывода:', error);
		});
		const intervalId = setInterval(fetchMessages, 3000); // Обновляем данные каждые 5 секунд
		return () => clearInterval(intervalId); // Очищаем интервал при размонтировании компонента
	}, []);

	// Опции для диаграммы
	const options: ChartOptions<'pie'> = {
		plugins: {
			legend: {
				display: false, // Скрываем легенду
			},
		},
	};

	return (
		<CardFromComponent title='СТАТИСТИКА КАТЕГОРИЙ'>
			<div className='flex my2xl:flex-row flex-col h-auto justify-center items-center'>
				<div className='h-[250px]'>
					<Pie data={chartData} options={options} />
				</div>
				<div className='w-full flex justify-center items-center flex-wrap gap-5 h-[230px] overflow-auto custom-scrollbar'>
					{messages.length > 0 ? (
						messages.map((message) => {
							const formattedDate = formatDates(message.date);
							return (
								<UserMessage
									key={message.id}
									date={formattedDate}
									login={message.song.login}
									status='Новое сообщение'
									img={`http://localhost:5000/uploads/imageUser/${message.song.photo}`}
									text={message.text}
								/>
							);
						})
					) : (
						<p>Нет сообщений</p>
					)}
				</div>
			</div>
		</CardFromComponent>
	);
};