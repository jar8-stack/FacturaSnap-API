-- Tabla de Usuarios (Users)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  correo_electronico VARCHAR(255) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  usuario_creacion INT,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  usuario_actualizacion INT,
  activo BOOLEAN DEFAULT 1,
  apellido_paterno VARCHAR(255) NOT NULL,
  apellido_materno VARCHAR(255) NOT NULL
);

-- Tabla de Productos (Product)
CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(255),
  fabricante VARCHAR(255),
  cantidad_en_existencia INT,
  unidad_de_medida VARCHAR(50),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  usuario_creacion INT,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  usuario_actualizacion INT,
  activo BOOLEAN DEFAULT 1,
  numero_serie VARCHAR(255) NOT NULL,
  marca VARCHAR(255) NOT NULL
);

-- Tabla de Productos en Promoción (PromotionalProduct)
CREATE TABLE promotionalproduct (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio_en_promocion DECIMAL(10, 2) NOT NULL,
  fecha_inicio_promocion DATE,
  fecha_finalizacion_promocion DATE,
  activo BOOLEAN DEFAULT 1,
  numero_serie VARCHAR(255) NOT NULL,
  marca VARCHAR(255) NOT NULL
);

-- Tabla de Compras (Purchase) con Detalle de Compra
CREATE TABLE purchase (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion TEXT,
  nombre_del_cliente VARCHAR(255),
  precio_total DECIMAL(10, 2),
  total_de_productos INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  usuario_creacion INT,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  usuario_actualizacion INT,
  activo BOOLEAN DEFAULT 1
);

CREATE TABLE purchase_detail (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_compra INT,
  producto_id INT,
  orden INT,
  usuario_creacion INT,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
