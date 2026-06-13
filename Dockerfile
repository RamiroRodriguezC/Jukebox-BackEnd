# 1. Imagen base oficial de Node.js (versión liviana)
FROM node:18-alpine

# 2. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos archivos de dependencias
COPY package*.json ./

# 4. Instalamos las dependencias de producción
RUN npm install --production

# 5. Copiamos el resto del código fuente
COPY . .

# 6. Informamos el puerto que usa tu API de Jukebox
EXPOSE 4000

# 7. Comando para iniciar la aplicación
CMD ["node", "src/app.js"]