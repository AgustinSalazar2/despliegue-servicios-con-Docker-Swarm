FROM mysql:latest

# Copiamos el archivo SQL para inicializar la base de datos
COPY ./initMysql /docker-entrypoint-initdb.d

# Configuramos variables de entorno
ENV MYSQL_ROOT_PASSWORD=root1

# Definimos un volumen para la base de datos
VOLUME /var/lib/mysql

# Exponemos el puerto 3306 del contenedor (puerto predeterminado de MySQL)
EXPOSE 3306

# CMD ["mysqld"]