-- --------------------------------------------------------
-- Host:                         roundhouse.proxy.rlwy.net
-- Versión del servidor:         8.4.0 - MySQL Community Server - GPL
-- SO del servidor:              Linux
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='Europe/Madrid' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Configura la zona horaria global de MySQL
SET GLOBAL time_zone = 'Europe/Madrid';

-- Configura la zona horaria de la sesión actual
SET time_zone = 'Europe/Madrid';

-- Volcando estructura de base de datos para railway
DROP DATABASE IF EXISTS `railway`;
CREATE DATABASE IF NOT EXISTS `railway` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `railway`;

-- Volcando estructura para tabla railway.categorias
DROP TABLE IF EXISTS `categorias`;
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `categoria` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Índice 2` (`categoria`),
  UNIQUE KEY `categoria` (`categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci COMMENT='TABLA DE CATEGORIAS';

-- Volcando datos para la tabla railway.categorias: ~5 rows (aproximadamente)
INSERT INTO `categorias` (`id`, `categoria`) VALUES
	('caaf3e5e-9488-40bf-8944-fd12b750c160', '100% Ibérico'),
	('c7fcc956-fad7-42df-92e9-2bf772064548', 'Cordero'),
	('56bd4458-e2a4-4447-b2b4-15b4e4d32f86', 'Embutidos'),
	('2894f374-63e1-49b4-9793-83dac642293e', 'Jamones'),
	('c89f8faf-b0dd-4d5c-9ec7-3a667ff9e411', 'Vacuno');

-- Volcando estructura para tabla railway.direcciones
DROP TABLE IF EXISTS `direcciones`;
CREATE TABLE IF NOT EXISTS `direcciones` (
  `id` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `street` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `number` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `province` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `cp` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL DEFAULT '0',
  `country` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci COMMENT='TABLA DE DIRECCIONES';

-- Volcando datos para la tabla railway.direcciones: ~8 rows (aproximadamente)
INSERT INTO `direcciones` (`id`, `name`, `street`, `number`, `province`, `cp`, `country`) VALUES
	('16a88ea0-055c-434f-a123-8a994d3d7741', 'Alfonso Cabezas Fernández', 'C/ Plazarejo 16, 2º IZQ', '618287536', 'Córdoba', '14440', 'España'),
	('6d7e57f5-40f7-4cd1-a37c-77abcc328819', 'Alfonso Cabezas Fernández', 'C/ Plazarejo 16, 2º IZQ', '618287536', 'Córdoba', '14440', 'España'),
	('9ab253a9-1ba7-457c-8bc4-4b1c323e25a7', 'José Carlos Romero Cristín', 'CALLE MONTALBAN 1', '632865743', 'Madrid', '28014', 'España'),
	('9kle57f5-40f7-4cd1-a37c-77df3d328819', 'Antonio Martinez Gomez', 'C/ Ramón y Cajal 13', '609094768', 'Sevilla', '41001', 'España'),
	('ae12c1cf-7988-4f14-acde-e95c9d26ce36', 'Antonio Martinez Gomez', 'C/ Ramón y Cajal 13', '609094768', 'Sevilla', '41001', 'España'),
	('b09808c0-0262-4674-94b3-a362183f24fa', 'Alfonso Cabezas Fernández', 'C/ Plazarejo 16, 2º IZQ', '618287536', 'Córdoba', '14440', 'España'),
	('f9fa8efe-6f34-48bd-be0b-b243d1fff675', 'Abraham Córdoba Pérez', 'C/ Músico Ziryab 7, 4º 1', '637844556', 'Córdoba', '14005', 'España'),
	('fc5d9958-5a8b-497d-9f92-0768df59bfd5', 'Pepe Higuera Mohedano', 'C/ Bulevar Hernán Ruiz 5, 4º 1', '613237336', 'Córdoba', '14005', 'España');

-- Volcando estructura para tabla railway.pedidos
DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `userID` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `userDirection` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `import` float NOT NULL DEFAULT (0),
  `dateCreation` datetime NOT NULL,
  `dateDelivery` datetime DEFAULT NULL,
  `state` enum('creado','enviado','completado') CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userID` (`userID`),
  KEY `userDirection` (`userDirection`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`userDirection`) REFERENCES `direcciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci COMMENT='TABLA DE PEDIDOS';

-- Volcando datos para la tabla railway.pedidos: ~8 rows (aproximadamente)
INSERT INTO `pedidos` (`id`, `userID`, `userDirection`, `import`, `dateCreation`, `dateDelivery`, `state`) VALUES
	('13434d02-7439-4f1e-b20c-18b3dff2974e', '39063b7c-8e48-4b0d-bc63-1a21b3860e4d', '16a88ea0-055c-434f-a123-8a994d3d7741', 454.39, '2024-05-25 13:40:31', '2024-05-30 13:43:19', 'completado'),
	('5947461a-eedf-42f3-bda8-7c31e772bb63', NULL, 'fc5d9958-5a8b-497d-9f92-0768df59bfd5', 407.14, '2024-05-20 13:51:55', NULL, 'creado'),
	('85e87aea-ab03-47f7-b73f-af2ea6a56b3d', '39063b7c-8e48-4b0d-bc63-1a21b3860e4d', '6d7e57f5-40f7-4cd1-a37c-77abcc328819', 37.65, '2024-05-28 13:42:36', NULL, 'enviado'),
	('b1b5d1d2-7d2d-4e62-a1a3-1ea8458b56ba', NULL, '9ab253a9-1ba7-457c-8bc4-4b1c323e25a7', 87.28, '2024-05-20 13:53:39', NULL, 'creado'),
	('b44640ce-4feb-4a1e-bc67-30d5782fce79', '39063b7c-8e48-4b0d-bc63-1a21b3860e4d', 'b09808c0-0262-4674-94b3-a362183f24fa', 55.93, '2024-05-10 13:41:55', '2024-05-30 14:02:44', 'completado'),
	('b4fe9547-cf9f-4427-be4e-df1cc5934bf5', NULL, 'f9fa8efe-6f34-48bd-be0b-b243d1fff675', 95.4, '2024-05-30 14:48:36', NULL, 'creado'),
	('ddbfffcd-58f2-4911-8c97-296e45f7f8fc', 'c16ec00f-be37-4c71-8692-e860734f25e2', '9kle57f5-40f7-4cd1-a37c-77df3d328819', 440.24, '2024-05-16 13:47:36', NULL, 'enviado'),
	('ed334e08-dcf7-4706-914f-daf52e6e47ca', 'c16ec00f-be37-4c71-8692-e860734f25e2', 'ae12c1cf-7988-4f14-acde-e95c9d26ce36', 134.2, '2024-05-12 13:45:56', NULL, 'enviado');

-- Volcando estructura para tabla railway.pedidosProducto
DROP TABLE IF EXISTS `pedidosProducto`;
CREATE TABLE IF NOT EXISTS `pedidosProducto` (
  `id` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `orderID` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `productID` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` float NOT NULL DEFAULT (0),
  PRIMARY KEY (`id`),
  KEY `orderID` (`orderID`),
  KEY `productID` (`productID`),
  CONSTRAINT `PP_ibfk_1` FOREIGN KEY (`orderID`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PP_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `productos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci COMMENT='TABLA INTERMEDIA PEDIDO-PRODUCTO';

-- Volcando datos para la tabla railway.pedidosProducto: ~23 rows (aproximadamente)
INSERT INTO `pedidosProducto` (`id`, `orderID`, `productID`, `quantity`, `price`) VALUES
	('023b832c-e263-499a-9d72-a647542232ac', '85e87aea-ab03-47f7-b73f-af2ea6a56b3d', 'dba1bd1d-bf16-4652-af41-22fbe711a2a5', 1, 9.3),
	('07ce38d5-6b05-4f4f-8360-c5eeaf7123ad', '13434d02-7439-4f1e-b20c-18b3dff2974e', '0ceb1ee8-55e4-4d89-a9f7-5aba67d33754', 2, 12.55),
	('0b611975-c0bd-4202-9094-87783101e722', '13434d02-7439-4f1e-b20c-18b3dff2974e', '5d642bb0-6698-4ceb-bf10-6f04197976f3', 1, 14.75),
	('1a69acaa-6be7-4292-a53e-9e4bc79fcbb6', 'b1b5d1d2-7d2d-4e62-a1a3-1ea8458b56ba', '89f7f610-6147-48b8-9844-c794a01ca188', 1, 7.4),
	('1b080322-c1f6-4653-bdf5-8f6235a18e0a', 'b44640ce-4feb-4a1e-bc67-30d5782fce79', '63191e5c-d2a0-4213-9db2-8650ae4f3fa5', 1, 18.33),
	('2988bda5-bef1-4349-97a7-4298a72035a0', 'b1b5d1d2-7d2d-4e62-a1a3-1ea8458b56ba', '0ceb1ee8-55e4-4d89-a9f7-5aba67d33754', 1, 12.55),
	('2c0494b6-aeac-47a5-a0f3-e9afbc6071d4', 'b4fe9547-cf9f-4427-be4e-df1cc5934bf5', '0ceb1ee8-55e4-4d89-a9f7-5aba67d33754', 3, 12.55),
	('2e6921f5-fbfa-4114-b453-10ccababaaca', 'b1b5d1d2-7d2d-4e62-a1a3-1ea8458b56ba', '63191e5c-d2a0-4213-9db2-8650ae4f3fa5', 1, 18.33),
	('317fda42-271d-464d-a2ca-8f28331b81b5', '13434d02-7439-4f1e-b20c-18b3dff2974e', '89f7f610-6147-48b8-9844-c794a01ca188', 1, 7.4),
	('404a7eac-6f5c-4ec6-baab-732886366354', 'b44640ce-4feb-4a1e-bc67-30d5782fce79', 'd9bcf8ad-443b-4fb3-b330-cf9a530d29ed', 3, 8.35),
	('464d9d26-423e-40b7-8725-019f88e05d9a', '85e87aea-ab03-47f7-b73f-af2ea6a56b3d', 'f956a8f9-08af-40c7-8c43-1162902cedcc', 1, 11.35),
	('5a2701cb-35f0-46f1-88fa-b060c3f921ab', 'b4fe9547-cf9f-4427-be4e-df1cc5934bf5', '8b7ab56e-d583-4b57-bcc4-8c1bd848086b', 1, 27.4),
	('5f2cb483-6aa4-484a-8ffb-a0809bc81967', 'ed334e08-dcf7-4706-914f-daf52e6e47ca', '2937e1ad-15b0-4220-a7ed-9203e92c90aa', 4, 33.55),
	('72dd2be2-a8d2-4020-9bf7-a86e4d353cb8', '5947461a-eedf-42f3-bda8-7c31e772bb63', '08371ab3-a1a4-416b-a60b-c5bfa11b69c3', 1, 407.14),
	('91dea15b-f19d-4155-aabf-fb2ec54ec666', '13434d02-7439-4f1e-b20c-18b3dff2974e', '08371ab3-a1a4-416b-a60b-c5bfa11b69c3', 1, 407.14),
	('93c6ea9f-ba03-4b35-8441-a463e2fdec47', 'ddbfffcd-58f2-4911-8c97-296e45f7f8fc', '08371ab3-a1a4-416b-a60b-c5bfa11b69c3', 1, 407.14),
	('a12f657d-9110-4cd7-806a-5b22827d8636', '85e87aea-ab03-47f7-b73f-af2ea6a56b3d', 'z0ae9132-b9d5-4993-a885-3172ceabc7cc', 1, 17),
	('b1c0b752-05d4-433c-b1e9-e0cfedef6a3c', 'b4fe9547-cf9f-4427-be4e-df1cc5934bf5', 'f956a8f9-08af-40c7-8c43-1162902cedcc', 1, 11.35),
	('d244164e-9e80-4283-876f-39b352c1ff14', 'b44640ce-4feb-4a1e-bc67-30d5782fce79', '0ceb1ee8-55e4-4d89-a9f7-5aba67d33754', 1, 12.55),
	('d3c26fc7-42fe-4692-8915-3fbe00ec79c5', 'ddbfffcd-58f2-4911-8c97-296e45f7f8fc', '89f7f610-6147-48b8-9844-c794a01ca188', 1, 7.4),
	('e456ce97-e03a-4fb0-a9e6-4de9e447340e', 'ddbfffcd-58f2-4911-8c97-296e45f7f8fc', '6b5db6c8-52de-422d-acb9-0791a9689a59', 1, 25.7),
	('ebc549d7-21c0-40c9-b2bb-f2b15be41e84', 'b4fe9547-cf9f-4427-be4e-df1cc5934bf5', 'f41453fb-17d8-4601-9b77-55d9daf557cb', 1, 19),
	('f174ff6f-6311-4fe1-9c5b-4dc8ab8cb0e3', 'b1b5d1d2-7d2d-4e62-a1a3-1ea8458b56ba', '41061db9-6f47-4911-8b54-96065a39a77a', 7, 7);

-- Volcando estructura para tabla railway.productos
DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `id` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `categoryID` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `price` float NOT NULL DEFAULT (0),
  `stock` float NOT NULL DEFAULT (0),
  `imageURL` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryID` (`categoryID`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `categorias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci COMMENT='TABLA DE PRODUCTOS';

-- Volcando datos para la tabla railway.productos: ~17 rows (aproximadamente)
INSERT INTO `productos` (`id`, `categoryID`, `name`, `price`, `stock`, `imageURL`) VALUES
	('08371ab3-a1a4-416b-a60b-c5bfa11b69c3', '2894f374-63e1-49b4-9793-83dac642293e', 'Jamón de Bellota 100% Ibérico', 407.14, 52, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/jamon-bellota-100-iberico-esenciaunica_lk2l-03.jpg'),
	('0ceb1ee8-55e4-4d89-a9f7-5aba67d33754', 'caaf3e5e-9488-40bf-8944-fd12b750c160', 'Presa 100% Ibérica', 12.55, 205, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/carne-presa-skin.jpg'),
	('2937e1ad-15b0-4220-a7ed-9203e92c90aa', '56bd4458-e2a4-4447-b2b4-15b4e4d32f86', 'Lomo de Bellota 100% Ibérico', 33.55, 10, 'https://senoriodelospedroches.com/wp-content/uploads/2020/11/Lomo-de-bellota-100-iberico-1-1.jpg'),
	('41061db9-6f47-4911-8b54-96065a39a77a', 'c89f8faf-b0dd-4d5c-9ec7-3a667ff9e411', 'Hamburguesa 100% vacuno', 7, 0, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/10/Hamburguesa_100_vacuno-Carnes_COVAP_.jpg'),
	('5d642bb0-6698-4ceb-bf10-6f04197976f3', 'c89f8faf-b0dd-4d5c-9ec7-3a667ff9e411', 'Solomillo de vacuno', 14.75, 14, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/medallones-solomillo-vacuno-carnes-covap-plato.jpg'),
	('63191e5c-d2a0-4213-9db2-8650ae4f3fa5', '56bd4458-e2a4-4447-b2b4-15b4e4d32f86', 'Chorizo ibérico', 18.33, 41, 'https://senoriodelospedroches.com/wp-content/uploads/2020/11/chorizo-iberico-de-bellota.jpeg'),
	('6b5db6c8-52de-422d-acb9-0791a9689a59', 'c89f8faf-b0dd-4d5c-9ec7-3a667ff9e411', 'Chuletón de vacuno', 25.7, 2, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/corp-ficha-carnes-plato-vacuno-1_Chuleton.jpg'),
	('7c80d6e6-59d6-417a-bf8a-52e150ea7a98', '2894f374-63e1-49b4-9793-83dac642293e', 'Paleta de Bellota 100% Ibérica', 140.44, 14, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/paleta-bellota-100-ib%C3%A9rica-esenciaunica_qay6-dm.jpg'),
	('89f7f610-6147-48b8-9844-c794a01ca188', 'caaf3e5e-9488-40bf-8944-fd12b750c160', 'Carrillada 100% Ibérica', 7.4, 1, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/carrillada-iberica-carnes-covap-sin-envase.jpg'),
	('8b7ab56e-d583-4b57-bcc4-8c1bd848086b', 'c7fcc956-fad7-42df-92e9-2bf772064548', 'Chuletas de cordero', 27.4, 4, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/chuletas-cordero-carret-carnes-covap_nb45-rp.jpg'),
	('8d4eff64-c927-4d73-a6b9-9e02a6d81d8b', 'c7fcc956-fad7-42df-92e9-2bf772064548', 'Pierna de cordero entera', 25, 25, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/pierna-cordero-pieza-carnes-covap-plato.jpg'),
	('b7375cc3-cd55-4401-9b7f-b497632ec824', 'caaf3e5e-9488-40bf-8944-fd12b750c160', 'Pluma 100% Ibérica', 8, 43, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/pluma-iberica-carnes-covap-sin-envase_gjh0-h4.jpg'),
	('d9bcf8ad-443b-4fb3-b330-cf9a530d29ed', 'caaf3e5e-9488-40bf-8944-fd12b750c160', 'Solomillo 100% IBÉRICO', 8.35, 197, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/solomillo-iberico-carnes-covap-sin-envase.jpg'),
	('dba1bd1d-bf16-4652-af41-22fbe711a2a5', 'caaf3e5e-9488-40bf-8944-fd12b750c160', 'Lomo 100% ibérico fileteado', 9.3, 17, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/lomo-iberico-fileteado-carnes-covap-sin-envase.jpg'),
	('f41453fb-17d8-4601-9b77-55d9daf557cb', '56bd4458-e2a4-4447-b2b4-15b4e4d32f86', 'Salchichón ibérico', 19, 11, 'https://senoriodelospedroches.com/wp-content/uploads/2020/11/salchichon-iberico-de-bellota.jpeg'),
	('f956a8f9-08af-40c7-8c43-1162902cedcc', 'caaf3e5e-9488-40bf-8944-fd12b750c160', 'Secreto 100% Ibérico', 11.35, 10, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/secreto-iberico-carnes-covap-sin_envase.jpg'),
	('z0ae9132-b9d5-4993-a885-3172ceabc7cc', 'c7fcc956-fad7-42df-92e9-2bf772064548', 'Paleta de cordero entera', 17, 22, 'https://tienda.covap.es/images/thumbnails/600/600/detailed/9/Paleta-cordero-pieza-carnes-covap-plato.jpg');

-- Volcando estructura para tabla railway.reservas
DROP TABLE IF EXISTS `reservas`;
CREATE TABLE IF NOT EXISTS `reservas` (
  `id` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `userID` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `orderer` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `email` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `dateCreation` datetime NOT NULL,
  `dateArrival` date NOT NULL,
  `participants` int NOT NULL,
  `price` float NOT NULL DEFAULT (0),
  PRIMARY KEY (`id`),
  KEY `userID` (`userID`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci COMMENT='TABLA DE RESERVAS';

-- Volcando datos para la tabla railway.reservas: ~13 rows (aproximadamente)
INSERT INTO `reservas` (`id`, `userID`, `orderer`, `email`, `dateCreation`, `dateArrival`, `participants`, `price`) VALUES
	('148d7a0b-d09e-4fce-876c-ec2d19be1b77', 'c16ec00f-be37-4c71-8692-e860734f25e2', 'Antonio Martinez Gomez', 'antonio.martinez@gmail.com', '2024-05-30 13:49:53', '2024-06-27', 3, 15),
	('39063b7c-8e48-4b0d-bc63-1a21b3860e4d', 'c16ec00f-be37-4c71-8692-e860734f25e2', 'Antonio Martinez Gomez', 'antonio.martinez@gmail.com', '2024-04-19 13:49:53', '2024-06-12', 1, 5),
	('3b07c798-2f3d-4b19-a63c-6fbc8ea918f0', '1261fc4d-165d-49f3-8cd7-8997bddfbeaa', 'Elena Lopez Martinez', 'elena.lopez@gmail.com', '2024-05-25 14:30:00', '2024-06-15', 2, 10),
	('4cb7be8f-05b8-4d08-804f-183f3070b63d', '730908b5-7801-47e7-9e6a-6b2eb0472de8', 'Alfonso Marín Rodriguez', 'alfonso.acf66@gmail.com', '2024-05-25 11:00:00', '2024-06-30', 5, 25),
	('57d8b4be-6b2d-45d7-9f7b-64b3ed33fb4a', NULL, 'Ramon Gutierrez Lobos', 'ramongut@gmail.com.com', '2024-05-22 12:45:00', '2024-06-20', 1, 5),
	('8a9463cf-df26-489e-a5ae-4a96f1c7c6db', '54009620-83ac-40fd-8dbc-4d12bff2881a', 'Elena Perez Lopez', 'elena.perez@yahoo.com', '2024-05-20 13:00:00', '2024-07-07', 4, 20),
	('917b7edc-46c4-4b08-84a9-eda6604f8f56', '34d85730-d8e4-4752-a618-2e48286521de', 'Pedro Gomez Fernandez', 'pedro.gomez@gmail.com', '2024-05-30 15:00:00', '2024-07-01', 5, 25),
	('9a1ae8e3-e214-440d-9d1d-27ecab97eaa6', NULL, 'José Carlos Romero Cristín', 'jrsc@gmail.com', '2024-05-30 13:54:13', '2024-06-26', 2, 10),
	('9c05c9a7-b98f-4d49-bc98-4d6c52b72e1b', NULL, 'Ana Martinez Lopez', 'ana.martinez@hotmail.com', '2024-05-15 14:30:00', '2024-06-25', 3, 15),
	('a50c7d77-d8d1-4a60-b7e7-5b8f5f39b4a1', '1721ab59-6b98-48e4-ae3c-dbcfbaf32be2', 'Maria Garcia Sanchez', 'maria.garcia@gmail.com', '2024-04-12 09:15:00', '2024-06-05', 3, 15),
	('c5ab93ef-2b3f-4a5c-8081-79ec9c6e4ebf', '3b307ebf-c83a-4bc7-8e08-6cf0c31e7f3a', 'Laura Perez Lopez', 'laura.perez@hotmail.com', '2024-05-10 08:00:00', '2024-07-15', 6, 30),
	('d48aef6c-0b1b-4f98-a6fc-1b848cd4b1b3', NULL, 'Laura Perez Lopez', 'laura.perez@hotmail.com', '2024-05-30 13:51:23', '2024-07-10', 4, 20),
	('f7a4d2e8-6f24-4d62-82e6-4a9fc5dcf917', NULL, 'Juan Martin Martinez', 'juan.martin@yahoo.com', '2024-05-28 10:30:00', '2024-06-22', 2, 10);

-- Volcando estructura para tabla railway.usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `surname` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `email` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `password` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `phone` int NOT NULL,
  `type` enum('admin','user') CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci COMMENT='TABLA DE USUARIOS';

-- Volcando datos para la tabla railway.usuarios: ~21 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `name`, `surname`, `email`, `password`, `phone`, `type`) VALUES
	('1261fc4d-165d-49f3-8cd7-8997bddfbeaa', 'Elena', 'Lopez Martinez', 'elena.lopez@gmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 605033545, 'user'),
	('1721ab59-6b98-48e4-ae3c-dbcfbaf32be2', 'Maria', 'Garcia Sanchez', 'maria.garcia@gmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 665028478, 'user'),
	('184a98abd-089c-4df6-9027-bd567a610ea7', 'ROOT', 'ROOT', 'root@root.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 0, 'admin'),
	('34d85730-d8e4-4752-a618-2e48286521de', 'Pedro', 'Gomez Fernandez', 'pedro.gomez@gmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 654723811, 'user'),
	('37d9d9c5-6327-40d4-9c63-c1be4e0c923a', 'Juan', 'Martin Martinez', 'juan.martin@yahoo.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 628985378, 'user'),
	('39063b7c-8e48-4b0d-bc63-1a21b3860e4d', 'Alfonso', 'Cabezas Fernández', 'alfonso@gmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 638638632, 'admin'),
	('3a78acfb-c350-40d6-b116-7da003af57d7', 'Antonio', 'Fernandez Ruiz', 'antonio.fernandez@hotmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 616196868, 'user'),
	('3b307ebf-c83a-4bc7-8e08-6cf0c31e7f3a', 'Laura', 'Perez Lopez', 'laura.perez@hotmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 616686700, 'user'),
	('3b58684f-c638-4a5a-9ad9-546525cfa92e', 'Ana', 'Martinez Lopez', 'ana.martinez@hotmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 627967104, 'user'),
	('54009620-83ac-40fd-8dbc-4d12bff2881a', 'Elena', 'Perez Lopez', 'elena.perez@yahoo.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 619351999, 'user'),
	('730908b5-7801-47e7-9e6a-6b2eb0472de8', 'Alfonso', 'Marín Rodriguez', 'alfonso.acf66@gmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 618287536, 'user'),
	('8e703d9f-4bfb-47a2-b998-dfae1efca38e', 'Lucia', 'Lopez Diaz', 'lucia.lopez@hotmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 666340267, 'user'),
	('a03a8fcf-0635-4de9-b630-678da32a2f71', 'Jorge', 'Martinez Lopez', 'jorge.martinez@yahoo.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 679447514, 'user'),
	('aa0d8c6a-27ee-4c88-aff1-6a07cf607b81', 'Carlos', 'Ruiz Martin', 'carlos.ruiz@yahoo.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 661382449, 'user'),
	('c16ec00f-be37-4c71-8692-e860734f25e2', 'Antonio', 'Martinez Gomez', 'antonio.martinez@gmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 609094768, 'user'),
	('c9404ae0-3820-4397-a6a0-8f1e3600a448', 'Laura', 'Lopez Martin', 'laura.lopez@yahoo.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 636574723, 'user'),
	('d00b6fc0-588b-4ba4-93e4-d49b3676d84f', 'Jorge', 'Perez Fernandez', 'jorge.perez@yahoo.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 631369153, 'user'),
	('e7e5bcbd5-404b-409c-b37f-bf9bbc632a2c', 'Viktoriia', 'Fazlieieva', 'vikafaz40@gmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 648842153, 'admin'),
	('e8649ae6-ba9c-4011-91b2-f606c507de7a', 'Ana', 'Lopez Diaz', 'ana.lopez@hotmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 606512416, 'user'),
	('eb93ff58-4ca8-4abc-8974-dabcce51d7ce', 'Lucia', 'Garcia Gomez', 'lucia.garcia@hotmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 606981233, 'user'),
	('ff49685a-37bb-41a2-a5e9-c2ceaceff145', 'Juan', 'Fernandez Fernandez', 'juan.fernandez@gmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 685793753, 'user');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
