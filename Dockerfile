# Usa una imagen oficial de Node.js
FROM node:20

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto de la app
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
