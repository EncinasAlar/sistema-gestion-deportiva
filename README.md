# README: Sistema de Gestión de Reservas para Centros Deportivos

## Introducción

Este proyecto consiste en una plataforma que permite a los usuarios de centros deportivos gestionar reservas de instalaciones. Es una solución  basada en microservicios, desplegada utilizando Docker.

## Instalación y Ejecución

### Requisitos Previos
- Docker y Docker Compose instalados.
- Backend y frontend están incluidos en el archivo `docker-compose.yml`. Los servicios se inician automáticamente al ejecutar los pasos de inicio.
- No es necesario instalar dependencias manualmente, ya que están incluidas en los archivos de configuración de los contenedores.


### Pasos para Iniciar el Proyecto

1. **Clonar este repositorio:**
   ```bash
   git clone <URL-del-repositorio>
   cd sistema-gestion-deportiva
2. **Construir y ejecutar los contenedores con Docker Compose:**
   ```bash
   docker-compose up --build
3. **Acceder a la aplicación::**
   ```bash
   Frontend: http://localhost:8080
   API Gateway: http://localhost
4. **Comandos útiles:**
 - **Parar los contenedores:**
   ```bash
   docker-compose down
- **Reconstruir los contenedores:**
   ```bash
   docker-compose up --build
