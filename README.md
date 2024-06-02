Para desplegar el proyecto en local se necesitan las siguientes dependencias:
- Npm
- Node.js
- Desplegar un servicio como Xampp en local o una base de datos mysql en línea como Railway para importar el fichero de la base de datos.

# Backend

## Instalación
Para instalar el proyecto backend se debe ejecutar el siguiente comando:
```bash
npm install
```

Y debemos crear una cadena de conexión en un fichero .env en la carpeta backend con lo siguiente:
```bash
DATABASE_URL="mysql://[user]:[password]@[host]:[port]/[nameBBDD]"
```
Y otra cadena de conexión con el secret para la generación de los token JWT, con el siguiente formato:
```bash
JWT_SECRET="[SECRET]"
```

Ahora generamos el modelo en el ORM Prisma con el siguiente comando:
```bash
npx prisma generate
```

## Ejecución
Para ejecutar el proyecto backend se debe ejecutar el siguiente comando:
```bash
npm run dev
```

# Frontend

## Instalación
Para instalar el proyecto de frontend se debe ejecutar el siguiente comando:
```bash
npm install
```

## Ejecución
Para ejecutar el proyecto frontend se debe ejecutar el siguiente comando:
```bash
npm run dev
```
