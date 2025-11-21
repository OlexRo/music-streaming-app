-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Окт 17 2024 г., 07:03
-- Версия сервера: 5.7.39
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `webMusic`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Albums`
--

CREATE TABLE `Albums` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `yearRelease` int(11) NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `singerId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `Albums`
--

INSERT INTO `Albums` (`id`, `title`, `yearRelease`, `description`, `photo`, `singerId`) VALUES
(1, 'Continuum', 2006, 'Глубокий альбом с элементами блюза и рока, посвященный личным переживаниям', 'photo-1728739289228-398900651.webp', 1),
(2, 'Divide ', 2017, 'Альбом о любви, жизни и личном росте', 'photo-1728739328805-621739246.webp', 2),
(3, 'Doo-Wops & Hooligans', 2010, 'Альбом, сочетающий поп и R&B с уникальным стилем', 'photo-1728739371127-841384075.jpg', 3),
(4, 'Lemonade ', 2016, 'Альбом о женской силе и семейных отношениях', 'photo-1728739410014-3395830.webp', 4),
(5, 'Illuminate ', 2016, ' Альбом о любви, личных переживаниях и взрослении', 'photo-1728739455839-686299261.jpg', 5),
(6, ' After Hours', 2020, 'Тёмный и атмосферный альбом, раскрывающий темы одиночества и самокопания', 'photo-1728739506306-299046503.jpg', 6),
(7, 'Norman F**ing Rockwell!*', 2019, 'Мрачный и ностальгический альбом с темами любви и национальной идентичности', 'photo-1728739548452-773454087.webp', 7),
(8, 'Царь горы', 2019, 'Альбом с социальными темами, затрагивающий политические и личные переживания', 'photo-1728739811375-607379896.webp', 8),
(9, 'Evolve ', 2017, 'Динамичный альбом, сочетающий рок, поп и электронику, отражающий борьбу за мечты', 'photo-1728739612251-500621562.jpg', 9),
(10, 'К звёздам', 2017, 'Альбом, сочетающий фэнтези, мрачные темы и философские размышления о жизни и смерти', 'photo-1728739650857-260849121.jpg', 10),
(11, 'Переворот ', 2020, 'Альбом с яркими каверами и оригинальными песнями, отражающими бунтарский дух и энергию рока', 'photo-1728739682615-876927034.jpg', 11),
(12, 'Горизонт событий', 2017, 'Лирический альбом с философскими темами и атмосферным звучанием', 'photo-1728739710341-691852817.webp', 12);

-- --------------------------------------------------------

--
-- Структура таблицы `Categories`
--

CREATE TABLE `Categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `Categories`
--

INSERT INTO `Categories` (`id`, `title`, `description`, `photo`) VALUES
(1, 'Рок', 'Жанр, характеризующийся использованием электрогитар, бас-гитары, ударных и вокала. Рок-музыка часто ассоциируется с бунтарским духом, свободой выражения и энергией', 'photo-1728737691024-472533471.jpg'),
(2, 'Поп', 'Жанр, ориентированный на коммерческий успех и широкую аудиторию. Поп-музыка отличается запоминающимися мелодиями, простыми структурами песен и часто использует элементы других жанров', 'photo-1728737714732-56017347.png'),
(3, 'Блюз', 'Жанр, зародившийся в афроамериканских сообществах США и характеризующийся использованием гитары, гармоники и эмоционального вокала. Блюз часто отражает темы печали, радости и жизненного опыта', 'photo-1728737731679-682141047.jpg'),
(4, 'Р&Б (Ритм-н-блюз)', 'Жанр, сочетающий элементы блюза и джаза с акцентом на ритм и вокал. Р&Б часто использует ударные, бас-гитару и электронные инструменты', 'photo-1728737807684-402142140.jpg'),
(5, 'Хип-хоп', 'Жанр, зародившийся в афроамериканских сообществах США и характеризующийся использованием рифмов, ударных и электронных инструментов. Хип-хоп часто отражает социальные и культурные темы', 'photo-1728737847023-561579380.webp'),
(6, 'Баллада', 'Жанр, характеризующийся медленным темпом, эмоциональным вокалом и лирическими текстами. Баллады часто посвящены темам любви, печали и романтики', 'photo-1728737916834-440127683.webp'),
(7, 'Альтернативный рок', 'Поджанр рока, характеризующийся экспериментами с звуком и структурой песен. Альтернативный рок часто ассоциируется с независимыми музыкальными сценами', 'photo-1728737980227-357437926.webp'),
(8, 'Электропоп', 'Жанр, сочетающий элементы поп-музыки с использованием электронных инструментов и синтезаторов. Электропоп часто характеризуется танцевальными ритмами и запоминающимися мелодиями', 'photo-1728738027204-728149243.webp'),
(9, 'Синти-поп', 'Жанр, использующий синтезаторы и электронные инструменты для создания звучания, отличного от традиционного рока и поп-музыки. Синти-поп часто ассоциируется с 1980-ми годами', 'photo-1728738088580-475359868.jpeg'),
(10, 'Регги-поп', 'Жанр, сочетающий элементы регги с поп-музыкой. Регги-поп часто характеризуется легким и позитивным настроением', 'photo-1728738190350-553437270.webp'),
(11, 'Инди', 'Жанр, характеризующийся независимостью от крупных лейблов и экспериментами с звуком. Инди-музыка часто ассоциируется с независимыми музыкальными сценами', 'photo-1728738215618-318606096.jpg'),
(12, 'Фолк-метал', 'Жанр, сочетающий элементы фолк-музыки с металом. Фолк-метал часто использует народные инструменты и темы', 'photo-1728738355229-792162548.jpeg'),
(13, 'Пауэр-метал', 'Поджанр метала, характеризующийся высоким темпом, мощными гитарными риффами и эпическими темами. Пауэр-метал часто ассоциируется с героизмом и фантастикой', 'photo-1728738412246-890716970.webp'),
(14, 'Метал', 'Жанр, характеризующийся использованием мощных гитарных риффов, ударных и эмоционального вокала. Метал часто отражает темы борьбы, силы и экстремальных эмоций', 'photo-1728738442145-897673463.webp'),
(15, 'Панк-рок', 'Жанр, характеризующийся быстрым темпом, простыми структурами песен и бунтарским духом. Панк-рок часто отражает социальные и политические темы', 'photo-1728738475399-546110575.webp'),
(16, 'Альтернатива', 'Общий термин, используемый для описания музыки, которая не вписывается в традиционные жанровые рамки. Альтернатива может включать в себя широкий спектр стилей и экспериментов', 'photo-1728738540923-555869326.jpg');

-- --------------------------------------------------------

--
-- Структура таблицы `Downloads`
--

CREATE TABLE `Downloads` (
  `id` int(10) UNSIGNED NOT NULL,
  `flag` tinyint(1) NOT NULL DEFAULT '0',
  `songId` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `Downloads`
--

INSERT INTO `Downloads` (`id`, `flag`, `songId`, `userId`) VALUES
(1, 1, 21, 2),
(2, 1, 10, 2),
(3, 1, 29, 2),
(4, 1, 16, 2),
(5, 1, 29, 1),
(6, 1, 21, 1),
(7, 1, 29, 6),
(8, 1, 10, 6);

-- --------------------------------------------------------

--
-- Структура таблицы `Favorites`
--

CREATE TABLE `Favorites` (
  `id` int(10) UNSIGNED NOT NULL,
  `flag` tinyint(1) NOT NULL DEFAULT '0',
  `songId` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `Favorites`
--

INSERT INTO `Favorites` (`id`, `flag`, `songId`, `userId`) VALUES
(1, 1, 20, 2),
(2, 1, 29, 2),
(3, 1, 25, 2),
(5, 1, 20, 1),
(6, 1, 29, 1),
(7, 1, 28, 1),
(8, 1, 15, 1),
(9, 1, 13, 1),
(10, 1, 25, 1),
(11, 1, 26, 1),
(12, 1, 17, 1),
(13, 1, 5, 6),
(14, 1, 25, 6),
(15, 1, 29, 6),
(16, 1, 8, 3),
(17, 1, 29, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `Messages`
--

CREATE TABLE `Messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `text` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flag` tinyint(1) NOT NULL DEFAULT '0',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `Singers`
--

CREATE TABLE `Singers` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateLive` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `Singers`
--

INSERT INTO `Singers` (`id`, `name`, `dateLive`, `country`, `photo`) VALUES
(1, 'John Mayer', '1977', 'США', 'photo-1728738741516-671199284.webp'),
(2, 'Ed Sheeran', '1991', 'Великобритания', 'photo-1728738774409-863980409.webp'),
(3, 'Bruno Mars', '1985', 'США', 'photo-1728738823339-367515106.jpg'),
(4, 'Beyoncé Knowle', '1981', 'США', 'photo-1728738851211-398432720.webp'),
(5, 'Shawn Mendes', '1998', 'Канада', 'photo-1728738878714-867427933.jpg'),
(6, 'The Weeknd (Abel Tesfaye) ', '1990', 'Канада', 'photo-1728738960946-339137426.jpg'),
(7, 'Lana Del Rey', '1985', 'США', 'photo-1728738991461-313630205.jpg'),
(8, 'NoizeMC ', '1985', 'Россия', 'photo-1728739047726-208466435.jpg'),
(9, 'Imagine Dragons', '2008', 'США', 'photo-1728739080731-313673998.jpg'),
(10, 'Павел Пламенев', '1974', 'Россия', 'photo-1728739102282-83324604.jpg'),
(11, 'Радио Тапок (Олег Абрамов)', '1974', 'Россия', 'photo-1728739129482-638585794.jpg'),
(12, 'Би-2', '1988', 'Россия', 'photo-1728739157094-633915434.jpg');

-- --------------------------------------------------------

--
-- Структура таблицы `Songs`
--

CREATE TABLE `Songs` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `songFile` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `yearRelease` int(11) NOT NULL,
  `albumId` int(10) UNSIGNED NOT NULL,
  `singerId` int(10) UNSIGNED NOT NULL,
  `categoryId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `Songs`
--

INSERT INTO `Songs` (`id`, `title`, `photo`, `songFile`, `yearRelease`, `albumId`, `singerId`, `categoryId`) VALUES
(1, 'Gravity', 'photo-1728739889138-360476377.jpg', 'songFile-1728739889139-598650023.mp3', 2006, 1, 1, 1),
(2, 'Slow Dancing in a Burning Room', 'photo-1728739942867-422537525.jpg', 'songFile-1728739942868-66293346.mp3', 2006, 1, 1, 6),
(3, 'Vultures ', 'photo-1728739980820-909424612.webp', 'songFile-1728739980821-296351636.mp3', 2006, 1, 1, 3),
(4, 'Shape of You', 'photo-1728740029359-242804839.png', 'songFile-1728740029360-801110831.mp3', 2017, 2, 2, 2),
(5, 'Perfect ', 'photo-1728740065965-373457947.jpg', 'songFile-1728740065966-179084124.mp3', 2017, 2, 2, 6),
(6, 'Castle on the Hill', 'photo-1728740095757-38243470.jpg', 'songFile-1728740095760-703163572.mp3', 2017, 2, 2, 1),
(7, 'Just the Way You Are', 'photo-1728740163996-866409346.jpg', 'songFile-1728740163997-434141520.mp3', 2010, 3, 3, 2),
(8, 'Grenade ', 'photo-1728740195204-357676853.webp', 'songFile-1728740195205-40369302.mp3', 2010, 3, 3, 2),
(9, 'The Lazy Song', 'photo-1728740231290-599814985.webp', 'songFile-1728740231290-433256148.mp3', 2010, 3, 3, 10),
(10, 'Formation ', 'photo-1728740284823-50271867.jpg', 'songFile-1728740284823-438128361.mp3', 2016, 4, 4, 5),
(11, 'Hold Up', 'photo-1728740335452-338258286.png', 'songFile-1728740335452-933744524.mp3', 2016, 4, 4, 4),
(12, 'Freedom ', 'photo-1728740377266-40268267.jpg', 'songFile-1728740377266-272976354.mp3', 2016, 4, 4, 5),
(13, 'Treat You Better', 'photo-1728740436927-465913084.webp', 'songFile-1728740436928-863914005.mp3', 2016, 5, 5, 2),
(14, 'Mercy ', 'photo-1728740480873-357139580.jpg', 'songFile-1728740480873-713471555.mp3', 2016, 5, 5, 6),
(15, 'There\'s Nothing Holdin\' Me Back', 'photo-1728740525418-2809277.jpg', 'songFile-1728740525418-162351921.mp3', 2016, 5, 5, 2),
(16, 'Blinding Lights', 'photo-1728740606871-279723934.jpg', 'songFile-1728740606876-497471698.mp3', 2020, 6, 6, 9),
(17, 'Save Your Tears ', 'photo-1728740641491-731017174.jpeg', 'songFile-1728740641491-56431864.mp3', 2018, 6, 6, 2),
(18, 'In Your Eyes ', 'photo-1728740683843-203982175.jpg', 'songFile-1728740683843-151646627.mp3', 2020, 6, 6, 8),
(19, 'Mariners Apartment Complex', 'photo-1728740755900-506672451.jpg', 'songFile-1728740755900-534706853.mp3', 2019, 7, 7, 11),
(20, ' Venice Bitch', 'photo-1728740790907-876637925.jpg', 'songFile-1728740790907-649363137.mp3', 2019, 7, 7, 2),
(21, 'Doin\' Time', 'photo-1728740835181-937699045.jpg', 'songFile-1728740835182-562481743.mp3', 2019, 7, 7, 1),
(22, 'Царь горы', 'photo-1728740898409-628852114.webp', 'songFile-1728740898410-207099927.mp3', 2019, 8, 8, 16),
(23, 'Выдыхай ', 'photo-1728740936544-871289527.jpg', 'songFile-1728740936546-76715228.mp3', 2019, 8, 8, 5),
(24, 'Всё как у людей', 'photo-1728740971233-588909191.jpg', 'songFile-1728740971234-755236061.mp3', 2019, 8, 8, 1),
(25, 'Believer ', 'photo-1728741027267-442929167.jpg', 'songFile-1728741027267-178425147.mp3', 2016, 9, 9, 7),
(26, 'Thunder ', 'photo-1728741082429-903892366.jpg', 'songFile-1728741082431-427797038.mp3', 2016, 9, 9, 7),
(27, 'Whatever It Takes', 'photo-1728741122491-787970217.jpg', 'songFile-1728741122493-691407690.mp3', 2017, 9, 9, 8),
(28, 'Уходим к звёздам', 'photo-1728741172649-49450452.jpg', 'songFile-1728741172650-384406075.mp3', 2017, 10, 10, 7),
(29, ' Шаг в темноту', 'photo-1728741216477-639727688.jpg', 'songFile-1728741216477-775603178.mp3', 2016, 10, 10, 7),
(30, 'Перед казнью', 'photo-1728741256996-527071105.jpg', 'songFile-1728741257000-566516974.mp3', 2017, 10, 10, 12),
(31, 'Мой рок-н-ролл ', 'photo-1728741303119-155419134.webp', 'songFile-1728741303119-467689843.mp3', 2020, 11, 11, 1),
(32, 'Высота 776', 'photo-1728741340673-297721161.jpg', 'songFile-1728741340674-831655495.mp3', 2020, 11, 11, 1),
(33, 'Мы выпьем кровь', 'photo-1728741382359-960548690.jpg', 'songFile-1728741382360-986646994.mp3', 2020, 11, 11, 7),
(34, 'Лайки ', 'photo-1728741443848-980355138.jpg', 'songFile-1728741443848-897982226.mp3', 2017, 12, 12, 7),
(35, 'Виски ', 'photo-1728741484042-515829159.jpg', 'songFile-1728741484044-531514515.mp3', 2017, 12, 12, 1),
(36, 'Компромисс ', 'photo-1728741521283-652932008.webp', 'songFile-1728741521284-627033301.mp3', 2017, 12, 12, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `Users`
--

CREATE TABLE `Users` (
  `id` int(10) UNSIGNED NOT NULL,
  `login` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `status` enum('0','1') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `Users`
--

INSERT INTO `Users` (`id`, `login`, `name`, `surname`, `password`, `date`, `role`, `status`, `photo`) VALUES
(1, 'apetrova', 'Анна', 'Петрова', '$2b$10$epGYOUF5GHv6U2fCPQPCmukh6aGqmWIAva2.sa05GMotX1FrA1K0u', '2024-10-12 12:46:19', 'user', '1', 'photo-1728737179536-98833595.webp'),
(2, 'divanov', 'Дмитрий', 'Иванов', '$2b$10$Uwsvsk6HapgAWxoKmxrU.eAwIH.nyEVOFTx70I3h5BBx7DX9m7bpq', '2024-10-12 12:46:43', 'user', '0', 'photo-1728737203637-402770168.webp'),
(3, 'osidorova', 'Ольга', 'Сидорова', '$2b$10$PHOWpL4tgFmWJFLpTshKp.U2RGcL5WPrDonSvE5RTDP0HP5zYpcBm', '2024-10-12 12:47:17', 'user', '0', 'photo-1728737236985-986207903.webp'),
(4, 'amikhailov', 'Алексей', 'Михайлов', '$2b$10$.0XwqSVzUKnh0JR9.8R5H.oK17r0LE0ml50MY5aDK0VuZxk0HV956', '2024-10-12 12:47:39', 'user', '0', 'photo-1728737259240-828929938.webp'),
(5, 'elebedeva', 'Екатерина', 'Лебедева', '$2b$10$hilVH9Ls5RhBNRlpqw5f2OCppqp2KAzWQhsVdxIinx.QhjC3Txwyq', '2024-10-12 12:48:07', 'user', '0', 'photo-1728737286964-557390887.webp'),
(6, 'amorozov', 'Андрей', 'Морозов', '$2b$10$5yrbOZiW0FLRprmV3tDj3uiFeKWGgpUcRd2aXuomHcWuQ74OHU8Xm', '2024-10-12 12:48:32', 'user', '0', 'photo-1728737312475-565590833.webp'),
(7, '@Alex_root', 'Алексей', 'Романченко', '$2b$10$/99DpBDABWzYyF4jHrB1L.HGpPPaeBK24.jT4ABu/iq.tg9syqia6', '2024-10-12 12:49:19', 'admin', '0', 'photo-1728737359904-899461981.webp');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Albums`
--
ALTER TABLE `Albums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `singerId` (`singerId`);

--
-- Индексы таблицы `Categories`
--
ALTER TABLE `Categories`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Downloads`
--
ALTER TABLE `Downloads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `songId` (`songId`);

--
-- Индексы таблицы `Favorites`
--
ALTER TABLE `Favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `songId` (`songId`),
  ADD KEY `userId` (`userId`);

--
-- Индексы таблицы `Messages`
--
ALTER TABLE `Messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Индексы таблицы `Singers`
--
ALTER TABLE `Singers`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Songs`
--
ALTER TABLE `Songs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `albumId` (`albumId`),
  ADD KEY `singerId` (`singerId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Индексы таблицы `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Albums`
--
ALTER TABLE `Albums`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT для таблицы `Categories`
--
ALTER TABLE `Categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `Downloads`
--
ALTER TABLE `Downloads`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `Favorites`
--
ALTER TABLE `Favorites`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT для таблицы `Messages`
--
ALTER TABLE `Messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `Singers`
--
ALTER TABLE `Singers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT для таблицы `Songs`
--
ALTER TABLE `Songs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT для таблицы `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Albums`
--
ALTER TABLE `Albums`
  ADD CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`singerId`) REFERENCES `Singers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Downloads`
--
ALTER TABLE `Downloads`
  ADD CONSTRAINT `downloads_ibfk_1` FOREIGN KEY (`songId`) REFERENCES `Songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Favorites`
--
ALTER TABLE `Favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`songId`) REFERENCES `Songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Messages`
--
ALTER TABLE `Messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Songs`
--
ALTER TABLE `Songs`
  ADD CONSTRAINT `songs_ibfk_1` FOREIGN KEY (`albumId`) REFERENCES `Albums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `songs_ibfk_2` FOREIGN KEY (`singerId`) REFERENCES `Singers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `songs_ibfk_3` FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
