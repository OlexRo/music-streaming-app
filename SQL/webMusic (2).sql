-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Сен 29 2024 г., 09:42
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
(2, 'Continuum ', 2006, 'Глубокий альбом с элементами блюза и рока, посвященный личным переживаниям', 'photo-1727588707374-525263871.webp', 2),
(3, 'Divide ', 2017, 'Альбом о любви, жизни и личном росте', 'photo-1727588738461-903172519.webp', 3),
(4, 'Doo-Wops & Hooligans', 2010, 'Альбом, сочетающий поп и R&B с уникальным стилем', 'photo-1727589244761-703988947.jpg', 4),
(5, 'Lemonade ', 2016, 'Альбом о женской силе и семейных отношениях', 'photo-1727588819026-689516284.webp', 5),
(6, 'Illuminate ', 2016, 'Альбом о любви, личных переживаниях и взрослении', 'photo-1727588844600-23700394.jpg', 6),
(7, 'After Hours', 2020, 'Тёмный и атмосферный альбом, раскрывающий темы одиночества и самокопания', 'photo-1727588896329-84513144.jpg', 7),
(8, 'Norman F**ing Rockwell!* ', 2019, 'Мрачный и ностальгический альбом с темами любви и национальной идентичности', 'photo-1727588940071-557808473.webp', 8),
(9, 'Царь горы', 2019, 'Альбом с социальными темами, затрагивающий политические и личные переживания', 'photo-1727588974127-975920723.webp', 9),
(10, 'Evolve ', 2017, 'Динамичный альбом, сочетающий рок, поп и электронику, отражающий борьбу за мечты', 'photo-1727589011857-879892419.jpg', 10),
(11, 'К звёздам', 2017, 'Альбом, сочетающий фэнтези, мрачные темы и философские размышления о жизни и смерти', 'photo-1727589051341-526468231.jpg', 11),
(12, 'Переворот ', 2020, 'Альбом с яркими каверами и оригинальными песнями, отражающими бунтарский дух и энергию рока', 'photo-1727589078184-852657526.jpg', 12),
(13, 'Горизонт событий', 2017, 'Лирический альбом с философскими темами и атмосферным звучанием', 'photo-1727589114992-271477354.webp', 13),
(14, 'Камнем по голове', 2000, 'Культовый панк-рок альбом с элементами фэнтези и мрачными историями', 'photo-1727589163580-746642128.jpg', 14),
(15, 'The Great War', 2019, 'Исторический альбом, посвященный событиям Первой мировой войн', 'photo-1727589205824-267683714.jpg', 15);

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
(2, 'Блюз', 'Блюз — это эмоциональный музыкальный жанр, основанный на структуре аккордов и меланхоличных текстах', 'photo-1727586830358-570607575.jpg'),
(3, 'Инди', 'Инди-музыка охватывает разнообразные стили и звучания, создаваемые независимыми артистами, стремящимися к творческой свободе', 'photo-1727586848281-940133296.jpg'),
(4, 'Метал', 'Метал — это тяжёлый музыкальный жанр с мощными гитарными риффами и агрессивным вокалом, часто исследующий темные темы', 'photo-1727586881654-262224809.webp'),
(5, 'Панк-рок', 'Панк-рок характеризуется быстрым темпом, простыми мелодиями и прямолинейными текстами, отражающими социальные и политические протесты', 'photo-1727586901773-159810377.webp'),
(6, 'Поп', 'Поп-музыка фокусируется на мелодичных и запоминающихся композициях, ориентированных на массовую аудиторию', 'photo-1727586928139-552481520.png'),
(7, 'Рок', 'Рок-музыка включает в себя широкий спектр стилей с акцентом на электрогитары и живые выступления, часто затрагивая культурные и социальные темы', 'photo-1727586955550-360959289.jpg'),
(8, 'Хип-хоп', 'Хип-хоп — это жанр, объединяющий рэп, диджеинг и элементы уличной культуры, сосредоточенный на социальных и политических вопросах', 'photo-1727586977595-345693175.webp'),
(9, 'Баллада ', 'Баллада - это жанр поэтической и музыкальной литературы, обычно рассказывающий драматическую историю, часто с элементами фантастики или мифологии, и передающий её через повествование, лирические отступления и художественное описание', 'photo-1727587344481-679327686.jpg'),
(10, 'Синти-поп', 'Синти-поп - Музыкальный жанр, сочетающий электронные инструменты и поп-мелодии, характеризующийся яркими, оптимистичными и запоминающимися мелодиями', 'photo-1727587380296-131103614.webp'),
(11, 'Электропоп ', 'Электропоп - Музыка, сочетающая в себе электронные звуки и поп-мелодии, часто с танцевальным ритмом и запоминающимися мелодиями', 'photo-1727587765729-321109160.jpg'),
(12, 'Р&Б', 'Р&Б - Музыка, сочетающая в себе ритм-энд-блюз и современные поп-элементы, с эмоциональным вокалом и танцевальными ритмами', 'photo-1727587790114-748629546.jpg'),
(13, 'Регги-поп', 'Регги-поп - Музыка, сочетающая в себе элементы регги и поп-музыки, с легким и позитивным настроением', 'photo-1727587818146-632055437.webp'),
(14, 'Инди-рок', 'Инди-рок - Музыка, созданная независимыми исполнителями или группами, с экспериментальным звучанием и нестандартными структурами', 'photo-1727587843134-672792756.jpg'),
(15, 'Фолк-рок', 'Фолк-рок - Музыкальный жанр, сочетающий в себе элементы фолк-музыки и метала, часто с историческими или мифологическими темами', 'photo-1727587896334-601808976.jpg'),
(16, 'Пауэр-метал ', 'Пауэр-метал - Энергичный и динамичный поджанр метала, характеризующийся мощными гитарами, быстрым темпом и эпическими темами', 'photo-1727587913175-224273808.jpg');

-- --------------------------------------------------------

--
-- Структура таблицы `Downloads`
--

CREATE TABLE `Downloads` (
  `id` int(10) UNSIGNED NOT NULL,
  `flag` tinyint(1) NOT NULL DEFAULT '0',
  `songID` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(7, 1, 4, 2),
(8, 1, 5, 2);

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
(2, 'John Mayer ', '1977', 'США', 'photo-1727588249964-206183027.webp'),
(3, 'Ed Sheeran', '1991', 'Великобритания', 'photo-1727588276343-688173144.webp'),
(4, 'Bruno Mars', '1985', 'США', 'photo-1727588306057-525949122.jpg'),
(5, 'Beyoncé Knowles', '1981', 'США', 'photo-1727588331731-596242271.webp'),
(6, 'Shawn Mendes', '1998', 'Канада', 'photo-1727588371021-448910764.jpg'),
(7, 'The Weeknd', '1990', 'Канада', 'photo-1727588402869-881431347.jpg'),
(8, 'Lana Del Rey', '1985', 'США', 'photo-1727588438278-869365848.jpg'),
(9, 'NoizeMC ', '1985', 'Россия', 'photo-1727588458437-955304717.jpg'),
(10, 'Imagine Dragons', '2008', 'США', 'photo-1727588480251-186470392.jpg'),
(11, 'Павел Пламенев', '1985', 'Россия', 'photo-1727588503098-147053837.jpg'),
(12, 'Радио Тапок', '1975', 'Россия', 'photo-1727588526893-946803089.jpg'),
(13, 'Би-2', '1993', 'Россия', 'photo-1727588549299-846619256.jpg'),
(14, 'Король и Шут ', '1988-2014', 'Россия', 'photo-1727588576353-413928898.webp'),
(15, 'Sabaton ', '1999', 'Швеция', 'photo-1727588607189-350724448.jpg');

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
(4, 'Gravity ', 'photo-1727590507100-963286283.jpg', 'songFile-1727590507101-425774119.mp3', 2006, 2, 2, 7),
(5, 'Slow Dancing in a Burning Room', 'photo-1727590535474-655330567.jpg', 'songFile-1727590535474-694378672.mp3', 2006, 2, 2, 7),
(6, 'Vultures ', 'photo-1727590571082-890003818.webp', 'songFile-1727590571082-870828663.mp3', 2006, 2, 2, 2),
(7, 'Shape of You', 'photo-1727590606346-38741613.png', 'songFile-1727590606348-438573677.mp3', 2017, 3, 3, 6),
(8, 'Perfect ', 'photo-1727590641111-316493613.jpg', 'songFile-1727590641112-616561247.mp3', 2017, 3, 3, 9),
(9, 'Castle on the Hill', 'photo-1727590664132-461043445.jpg', 'songFile-1727590664133-295164421.mp3', 2017, 3, 3, 7),
(10, 'Just the Way You Are', 'photo-1727590705292-821205251.jpg', 'songFile-1727590705293-379203555.mp3', 2010, 4, 4, 6),
(11, 'Grenade ', 'photo-1727590733992-831916619.webp', 'songFile-1727590733994-246461933.mp3', 2010, 4, 4, 6),
(12, 'The Lazy Song ', 'photo-1727590764070-223335460.webp', 'songFile-1727590764070-332885261.mp3', 2010, 4, 4, 6),
(13, 'Formation ', 'photo-1727590810426-18041302.jpg', 'songFile-1727590810427-792794181.mp3', 2016, 5, 5, 8),
(14, 'Hold Up', 'photo-1727590841036-146797767.png', 'songFile-1727590841056-165375205.mp3', 2016, 5, 5, 12),
(15, 'Freedom ', 'photo-1727590874257-504627018.jpg', 'songFile-1727590874258-427794990.mp3', 2016, 5, 5, 9),
(16, 'Treat You Better', 'photo-1727590921424-200665936.webp', 'songFile-1727590921424-591012214.mp3', 2016, 6, 6, 6),
(17, 'Mercy ', 'photo-1727590949618-988681000.jpg', 'songFile-1727590949619-470327863.mp3', 2016, 6, 6, 9),
(18, 'There\'s Nothing Holdin\' Me Back', 'photo-1727590988790-567136774.jpg', 'songFile-1727590988790-204138263.mp3', 2016, 6, 6, 7),
(19, 'Blinding Lights', 'photo-1727591101700-966342011.jpg', 'songFile-1727591101706-704981025.mp3', 2020, 7, 7, 10),
(20, 'Save Your Tears ', 'photo-1727591144054-241169750.jpeg', 'songFile-1727591144054-268601871.mp3', 2020, 7, 7, 13),
(21, 'In Your Eyes', 'photo-1727591168633-959906882.jpg', 'songFile-1727591168633-83810525.mp3', 2020, 7, 7, 11),
(22, 'Mariners Apartment Complex', 'photo-1727591229685-566279583.jpg', 'songFile-1727591229685-490577932.mp3', 2019, 8, 8, 14),
(23, 'Venice Bitch', 'photo-1727591260984-786350029.jpg', 'songFile-1727591260984-925774138.mp3', 2019, 8, 8, 6),
(24, 'Doin\' Time', 'photo-1727591303252-547737558.jpg', 'songFile-1727591303252-698357322.mp3', 2019, 8, 8, 7),
(25, 'Царь горы', 'photo-1727591370843-454477226.webp', 'songFile-1727591370843-972694665.mp3', 2019, 9, 9, 8),
(26, 'Выдыхай ', 'photo-1727591394931-264510013.jpg', 'songFile-1727591394932-788143212.mp3', 2019, 9, 9, 8),
(27, 'Всё как у людей', 'photo-1727591427096-88715149.jpg', 'songFile-1727591427099-985628740.mp3', 2019, 9, 9, 8),
(28, 'Believer ', 'photo-1727591466786-746653716.jpg', 'songFile-1727591466786-631295787.mp3', 2017, 10, 10, 7),
(29, 'Thunder ', 'photo-1727591516363-848101947.jpg', 'songFile-1727591516364-158833064.mp3', 2017, 10, 10, 7),
(30, 'Whatever It Takes', 'photo-1727591553785-901769291.jpg', 'songFile-1727591553786-863805422.mp3', 2017, 10, 10, 11),
(31, 'Уходим к звёздам', 'photo-1727591583280-140546214.jpg', 'songFile-1727591583282-302235687.mp3', 2017, 11, 11, 7),
(32, 'Шаг в темноту ', 'photo-1727591610344-313464552.jpg', 'songFile-1727591610344-354843411.mp3', 2017, 11, 11, 7),
(33, 'Перед казнью', 'photo-1727591645430-656467056.jpg', 'songFile-1727591645431-728749534.mp3', 2017, 11, 11, 15),
(34, 'Мой рок-н-ролл', 'photo-1727591687369-111038930.webp', 'songFile-1727591687369-739325536.mp3', 2020, 12, 12, 7),
(35, 'Высота 776', 'photo-1727591713682-110638945.jpg', 'songFile-1727591713684-360826372.mp3', 2020, 12, 12, 7),
(36, 'Мы выпьем кровь ', 'photo-1727591741183-26025882.jpg', 'songFile-1727591741187-948796044.mp3', 2020, 12, 12, 7),
(37, 'Лайки', 'photo-1727591778494-868229886.jpg', 'songFile-1727591778494-818951346.mp3', 2017, 13, 13, 7),
(38, 'Виски', 'photo-1727591810347-473519143.jpg', 'songFile-1727591810349-330620526.mp3', 2017, 13, 13, 7),
(39, 'Компромисс', 'photo-1727591831625-739504047.webp', 'songFile-1727591831625-199095828.mp3', 2017, 13, 13, 7),
(40, 'Камнем по голове', 'photo-1727591875262-536592844.webp', 'songFile-1727591875262-182899664.mp3', 1997, 14, 14, 5),
(41, 'Лесник', 'photo-1727591901507-657472975.jpg', 'songFile-1727591901509-765776427.mp3', 1997, 14, 14, 5),
(42, 'Проклятый старый дом', 'photo-1727591928719-105319674.jpg', 'songFile-1727591928721-520335598.mp3', 1997, 14, 14, 5),
(43, 'Fields of Verdun', 'photo-1727591973577-512668265.jpg', 'songFile-1727591973584-55680517.mp3', 2019, 15, 15, 16),
(44, 'The Red Baron', 'photo-1727592008934-139588199.jpg', 'songFile-1727592008937-450742646.mp3', 2019, 15, 15, 4),
(45, 'Great War', 'photo-1727592038983-399621035.jpg', 'songFile-1727592038984-585218132.mp3', 2019, 15, 15, 4);

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
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `Users`
--

INSERT INTO `Users` (`id`, `login`, `name`, `surname`, `password`, `date`, `role`, `photo`) VALUES
(2, '@Alex_123', 'Алексей', '@Alex_123', '$2b$10$XxezBCij7Kx3QfMzDrE.Leo0SC2WI7Hin3eB7eWgOUJDXunRC7.Pi', '2024-09-29 04:57:32', 'admin', 'photo-1727585852708-560820712.jpg'),
(3, 'ivan_ivanov', 'Иван ', 'Иванов', '$2b$10$61p84a/0B8MPWCCa3T4EfuLOh8wty5kLgVQN4LULHKCYgIEuKWHEi', '2024-09-29 05:09:35', 'user', 'photo-1727586575820-809978503.jpg'),
(4, 'maria_petrova', 'Мария ', 'Петрова', '$2b$10$SS86SUWfyY3UhRNG2L.GN.TWLNcRzIyGStOYWUXa1xX8iI/l8aiEG', '2024-09-29 05:10:07', 'user', 'photo-1727586607624-336964737.jpg'),
(5, 'alex_smirnov', 'Алексей ', 'Смирнов', '$2b$10$pvmpRMFyYhj7IMk9TzdNx.YZUvgf8023oTkTuAK1pL7Tn2AUjj7Ia', '2024-09-29 05:10:30', 'user', 'photo-1727586630356-631384280.jpeg'),
(6, 'olga_sokolova', 'Ольга ', 'Соколова', '$2b$10$4IQ8RjbL7zbq03/nXzBg/.FgWeqbkNh11vkTy1ZkVclcrPKO0SPqy', '2024-09-29 05:11:04', 'user', 'photo-1727586663856-523324662.jpg'),
(7, 'dmitry_novikov ', 'Дмитрий ', 'Новиков', '$2b$10$OAtbjSEKAZEbjd72JDNUD.JQ5IuMNrqz85MID6ARSqISFYHbHHah.', '2024-09-29 05:11:24', 'user', 'photo-1727586684252-106204420.jpg'),
(8, 'anna_kuznetsova ', 'Анна ', 'Кузнецова', '$2b$10$wsRzNpad02QFtFn3hxOeW.RMVj3rYQA4Xb.7bCVJ4BXvALd.WQRXm', '2024-09-29 05:11:51', 'user', 'photo-1727586711454-804513374.webp');

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
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Favorites`
--
ALTER TABLE `Favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `songId` (`songId`),
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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `Categories`
--
ALTER TABLE `Categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `Downloads`
--
ALTER TABLE `Downloads`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `Favorites`
--
ALTER TABLE `Favorites`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `Singers`
--
ALTER TABLE `Singers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `Songs`
--
ALTER TABLE `Songs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT для таблицы `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Albums`
--
ALTER TABLE `Albums`
  ADD CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`singerId`) REFERENCES `Singers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Favorites`
--
ALTER TABLE `Favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`songId`) REFERENCES `Songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
