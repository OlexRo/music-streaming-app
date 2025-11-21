import { useMediaQuery } from 'react-responsive';

export const useChartSize = () => {
	// Определяем ширину графика
	const is320 = useMediaQuery({query: '(max-width: 375px)'});
	const is375 = useMediaQuery({query: '(max-width: 375px)'});
	const is500 = useMediaQuery({query: '(max-width: 581px)'});
	const is581 = useMediaQuery({query: '(max-width: 581px)'});
	const is691 = useMediaQuery({query: '(max-width: 691px)'});
	const is749 = useMediaQuery({query: '(max-width: 749px)'});
	const is835 = useMediaQuery({query: '(max-width: 835px)'});
	const is1057 = useMediaQuery({query: '(max-width: 1057px)'});
	const is1277 = useMediaQuery({query: '(max-width: 1277px)'});
	const is1280 = useMediaQuery({query: '(max-width: 1280px)'});
	const is1496 = useMediaQuery({query: '(max-width: 1496px)'});
	const is1504 = useMediaQuery({query: '(max-width: 1504px)'});
	const is1520 = useMediaQuery({query: '(max-width: 1520px)'});
	const is1780 = useMediaQuery({query: '(max-width: 1780px)'});

	let chartWidth;
	if (is320) {
		chartWidth = 200;
	}
	else if (is375) {
		chartWidth = 250;
	}
	else if (is500) {
		chartWidth = 260;
	}
	else if (is581) {
		chartWidth = 350;
	}
	else if (is691) {
		chartWidth = 450;
	}
	else if (is749) {
		chartWidth = 550;
	}
	else if (is835) {
		chartWidth = 600;
	}
	else if (is1057) {
		chartWidth = 700;
	}
	else if (is1277) {
		chartWidth = 800;
	}
	else if (is1280) {
		chartWidth = 800;
	}
	else if (is1496) {
		chartWidth = 900;
	}
	else if (is1504) {
		chartWidth = 1100;
	}
	else if (is1520) {
		chartWidth = 1100;
	}
	else if (is1780) {
		chartWidth = 1200;
	}
	else {
		chartWidth = 450;
	}

	// Определяем высоту графика
	let chartHeight;
	if (is500) {
		chartHeight = 150;
	}
	else if (is581) {
		chartHeight = 250;
	}
	else if (is1780) {
		chartHeight = 300;
	}
	else {
		chartHeight = 250;
	}

	return { chartWidth, chartHeight };
};