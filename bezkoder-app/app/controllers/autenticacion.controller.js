const db = require("../models");
const Users = db.usuarios; // Cambia "user" a "users"
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints para autenticación de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - correo_electronico
 *         - contrasena
 *       properties:
 *         correo_electronico:
 *           type: string
 *           description: Correo electrónico del usuario
 *         contrasena:
 *           type: string
 *           description: Contraseña del usuario
 *       example:
 *         correo_electronico: usuario@example.com
 *         contrasena: contraseña123
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Authentication]
 *     requestBody:
 *       description: Datos de inicio de sesión del usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: Sesión iniciada
 *               token: [JWT_TOKEN]
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             example:
 *               message: Contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: Usuario no encontrado
 *       500:
 *         description: Error al iniciar sesión
 *         content:
 *           application/json:
 *             example:
 *               message: Error al iniciar sesión
 */
exports.login = async (req, res) => {
  try {
    const { correo_electronico, contrasena } = req.body;
    const user = await Users.findOne({ where: { correo_electronico: correo_electronico } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRET);
    res.status(200).json({ message: "Sesión iniciada", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - nombre
 *         - correo_electronico
 *         - contrasena
 *         - apellido_paterno
 *         - apellido_materno
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         correo_electronico:
 *           type: string
 *           description: Correo electrónico del usuario
 *         contrasena:
 *           type: string
 *           description: Contraseña del usuario
 *         apellido_paterno:
 *           type: string
 *           description: Apellido paterno del usuario
 *         apellido_materno:
 *           type: string
 *           description: Apellido materno del usuario
 *       example:
 *         nombre: Juan
 *         correo_electronico: juan@example.com
 *         contrasena: contraseña123
 *         apellido_paterno: Pérez
 *         apellido_materno: Gómez
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Authentication]
 *     requestBody:
 *       description: Datos de registro del usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             example:
 *               auth: true
 *               token: [JWT_TOKEN]
 *       500:
 *         description: Error al registrar usuario
 *         content:
 *           application/json:
 *             example:
 *               message: Error al registrar usuario
 */
exports.register = async (req, res) => {
  const moment = require('moment');
  const currentDate = new Date().toISOString();
  const formattedDate = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
  const {
    nombre,
    correo_electronico,
    contrasena,
    apellido_paterno,
    apellido_materno,
  } = req.body;

  try {
    const user = await Users.create({
      nombre: nombre,
      correo_electronico: correo_electronico,
      contrasena: bcrypt.hashSync(contrasena, 8),
      fecha_creacion: formattedDate,
      usuario_creacion: req.user_id,
      fecha_actualizacion: formattedDate,
      usuario_actualizacion: req.user_id,
      activo: true,
      apellido_paterno: apellido_paterno,
      apellido_materno: apellido_materno,
    });

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: 86400
    });

    res.status(201).send({ auth: true, token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error al registrar usuario" });
  }
};
