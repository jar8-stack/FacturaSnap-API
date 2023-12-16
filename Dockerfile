# Dockerfile para Python
FROM python:3.11-alpine

# update apk repo
RUN echo "http://dl-4.alpinelinux.org/alpine/v3.14/main" >> /etc/apk/repositories && \
    echo "http://dl-4.alpinelinux.org/alpine/v3.14/community" >> /etc/apk/repositories

# install dependencies using apk
RUN apk update && \
    apk add --no-cache \
    tesseract-ocr \
    tesseract-ocr-data-spa \
    unzip \
    wget \
    zip \
    chromium \
    chromium-chromedriver

WORKDIR /app

# Instalar las dependencias de Python
RUN pip install Flask Pillow pytesseract selenium webdriver_manager

# Copiar los scripts de Python
COPY python_scripts /app

# Ejecutar el script de Python
CMD ["python", "ocr_script.py"]
