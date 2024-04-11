CREATE TABLE `usuarios` (
  `id` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `name` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `surname` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `email` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `password` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `phone` int(15) NOT NULL,
  `type` enum('admin','user') COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci COMMENT='TABLA DE USUARIOS';

INSERT INTO `usuarios` VALUES ('39063b7c-8e48-4b0d-bc63-1a21b3860e4d', 'Alfonso', 'Cabezas Fernández', 'alfonso@gmail.com', '$2a$10$OVERH6XdAK3BjbBoR14EBOtQ2hm0.6OvjWUpRoZAEZqqCVBikJuhS', 638638638, 'admin');
INSERT INTO `usuarios` VALUES ('41f80529-56a8-4d11-a817-5b525c730016', 'Pepe', 'Pino Pino', 'pepe@uco.es', '1', 123456789, 'user');


CREATE TABLE `pedidos` (
  `id` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `userID` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `userDirection` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `import` int(11) NOT NULL,
  `dateCreation` datetime NOT NULL,
  `dateDelivery` datetime NULL,
  `state` enum('creado','enviado','completado') COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userID` (`userID`),
  KEY `userDirection` (`userDirection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci COMMENT='TABLA DE PEDIDOS';


CREATE TABLE `productos` (
  `id` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `categoryID` varchar(64) COLLATE utf8_spanish_ci DEFAULT NULL,
  `name` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `price` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `imageURL` varchar(300) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryID` (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci COMMENT='TABLA DE PRODUCTOS';

INSERT INTO `productos` VALUES ('234fcc07-855f-4b06-b083-0807efe80a5f', 'e37c6a63-772e-40da-b0e6-f644c769521e', 'Serranito', 20, 10, 'https://images.pexels.com/photos/133578/pexels-photo-133578.jpeg');
INSERT INTO `productos` VALUES ('4029dcdf-1a53-43cc-b46d-c36b2ee74a7f', 'e37c6a63-772e-40da-b0e6-f644c769521e', 'bocadillo de Jamón', 15, 4, 'https://images.pexels.com/photos/263116/pexels-photo-263116.jpeg');
INSERT INTO `productos` VALUES ('5e383afd-1980-4c3b-8142-2149af02341e', 'c112973b-07f2-4e78-9a38-a20587599bba', 'Fanta', 1, 20, 'https://images.pexels.com/photos/13950097/pexels-photo-13950097.jpeg');

CREATE TABLE `pedidosProducto` (
  `id` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `orderID` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `productID` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderID` (`orderID`),
  KEY `productID` (`productID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci COMMENT='TABLA INTERMEDIA PEDIDO-PRODUCTO';


CREATE TABLE `reservas` (
  `id` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `userID` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `dateCreation` datetime NOT NULL,
  `dateArrival` datetime NOT NULL,
  `participants` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `requests` varchar(512) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userID` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci COMMENT='TABLA DE RESERVAS';


CREATE TABLE `direcciones` (
  `id` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `via` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `name` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `number` int(11) NOT NULL,
  `province` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `info` varchar(64) COLLATE utf8_spanish_ci NULL,
  `country` varchar(256) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci COMMENT='TABLA DE DIRECCIONES';


CREATE TABLE `categorias` (
  `id` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `categoria` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci COMMENT='TABLA DE CATEGORIAS';


INSERT INTO `categorias` VALUES ('c112973b-07f2-4e78-9a38-a20587599bba', 'Iberico');
INSERT INTO `categorias` VALUES ('e37c6a63-772e-40da-b0e6-f644c769521e', 'Vacuno');

ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`userDirection`) REFERENCES `direcciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `categorias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `pedidosProducto`
  ADD CONSTRAINT `PP_ibfk_1` FOREIGN KEY (`orderID`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `PP_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `usuarios` (`id`);