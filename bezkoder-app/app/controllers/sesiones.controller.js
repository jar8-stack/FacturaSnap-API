const db = require("../models");
const Sesiones = db.sesiones;

/**
 * @swagger
 * tags:
 *   name: Sesiones
 *   description: Endpoints para operaciones relacionadas con sesiones de usuario
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Sesion:
 *       type: object
 *       properties:
 *         jwt_token:
 *           type: string
 *           description: Token JWT de la sesión
 *         expiration_time:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de expiración del token JWT
 *       example:
 *         jwt_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *         expiration_time: "2023-01-01T00:00:00Z"
 */

/**
 * @swagger
 * /api/sesiones:
 *   get:
 *     summary: Obtiene la lista de todas las sesiones del usuario autenticado
 *     tags: [Sesiones]
 *     responses:
 *       200:
 *         description: Lista de sesiones obtenida correctamente
 *       500:
 *         description: Error al obtener la lista de sesiones
 */
exports.getAllSesiones = async (req, res) => {
  const usuarioId = req.user.id;
  try {
    const sesiones = await Sesiones.findAll({
      where: { id_usuario: usuarioId },
    });
    res.status(200).json(sesiones);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener la lista de sesiones" });
  }
};

/**
 * @swagger
 * /api/sesiones/{id}:
 *   get:
 *     summary: Obtiene información de una sesión específica del usuario autenticado
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sesión
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información de la sesión obtenida correctamente
 *       404:
 *         description: Sesión no encontrada
 *       500:
 *         description: Error al obtener información de la sesión
 */
exports.getSesionById = async (req, res) => {
  const sesionId = req.params.id;
  const usuarioId = req.user.id;
  try {
    const sesion = await Sesiones.findOne({
      where: { id_usuario: usuarioId, id_sesiones: sesionId },
    });
    if (!sesion) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }
    res.status(200).json(sesion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener información de la sesión" });
  }
};

/**
 * @swagger
 * /api/sesiones:
 *   post:
 *     summary: Crea una nueva sesión para el usuario autenticado
 *     tags: [Sesiones]
 *     requestBody:
 *       description: Datos de la nueva sesión
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sesion'
 *     responses:
 *       201:
 *         description: Sesión creada correctamente
 *       500:
 *         description: Error al crear la sesión
 */
exports.createSesion = async (req, res) => {
  const usuarioId = req.user.id;
  const { jwt_token, expiration_time } = req.body;
  try {
    const sesion = await Sesiones.create({
      id_usuario: usuarioId,
      jwt_token: jwt_token,
      expiration_time: expiration_time,
      created_at: new Date(),
    });
    res.status(201).json(sesion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear la sesión" });
  }
};

/**
 * @swagger
 * /api/sesiones/{id}:
 *   put:
 *     summary: Actualiza una sesión específica del usuario autenticado
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sesión
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos actualizados de la sesión
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sesion'
 *     responses:
 *       200:
 *         description: Sesión actualizada correctamente
 *       404:
 *         description: Sesión no encontrada
 *       500:
 *         description: Error al actualizar la sesión
 */
exports.updateSesion = async (req, res) => {
  const sesionId = req.params.id;
  const usuarioId = req.user.id;
  try {
    const [updated] = await Sesiones.update(req.body, {
      where: { id_usuario: usuarioId, id_sesiones: sesionId },
    });
    if (updated) {
      const updatedSesion = await Sesiones.findOne({
        where: { id_usuario: usuarioId, id_sesiones: sesionId },
      });
      return res.status(200).json({
        message: "Sesión actualizada",
        data: updatedSesion,
      });
    }
    throw new Error("Sesión no encontrada");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar la sesión" });
  }
};

/**
 * @swagger
 * /api/sesiones/{id}:
 *   delete:
 *     summary: Elimina una sesión específica del usuario autenticado
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sesión a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sesión eliminada correctamente
 *       404:
 *         description: Sesión no encontrada
 *       500:
 *         description: Error al eliminar la sesión
 */
exports.deleteSesion = async (req, res) => {
  const sesionId = req.params.id;
  const usuarioId = req.user.id;
  try {
    const deleted = await Sesiones.destroy({
      where: { id_usuario: usuarioId, id_sesiones: sesionId },
    });
    if (deleted) {
      return res.status(200).json({ message: "Sesión eliminada" });
    }
    throw new Error("Sesión no encontrada");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar la sesión" });
  }
};
