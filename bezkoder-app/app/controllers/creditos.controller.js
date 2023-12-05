const db = require("../models");
const Creditos = db.creditos;
const Op = db.Sequelize.Op;

/**
 * @swagger
 * tags:
 *   name: Creditos
 *   description: Endpoints para operaciones relacionadas con créditos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Credito:
 *       type: object
 *       properties:
 *         cantidad:
 *           type: integer
 *           description: Cantidad de crédito
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario asociado al crédito
 *       example:
 *         cantidad: 1000
 *         id_usuario: 1
 */

/**
 * @swagger
 * /api/creditos:
 *   get:
 *     summary: Obtiene la lista de todos los créditos de un usuario
 *     tags: [Creditos]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de créditos obtenida correctamente
 *       500:
 *         description: Error al obtener la lista de créditos
 */
exports.getAllCreditos = async (req, res) => {
  try {
    const creditos = await Creditos.findAll({
      where: { id_usuario: req.params.id_usuario },
    });
    res.status(200).json(creditos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener la lista de créditos" });
  }
};

/**
 * @swagger
 * /api/creditos/{id}:
 *   get:
 *     summary: Obtiene información de un crédito específico de un usuario
 *     tags: [Creditos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del crédito
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del crédito obtenida correctamente
 *       404:
 *         description: Crédito no encontrado
 *       500:
 *         description: Error al obtener información del crédito
 */
exports.getCreditoById = async (req, res) => {
  const creditoId = req.params.id;
  try {
    const credito = await Creditos.findOne({
      where: { id_creditos: creditoId, id_usuario: req.params.id_usuario },
    });
    if (!credito) {
      return res.status(404).json({ message: "Crédito no encontrado" });
    }
    res.status(200).json(credito);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener información del crédito" });
  }
};

/**
 * @swagger
 * /api/creditos:
 *   post:
 *     summary: Crea un nuevo crédito para un usuario
 *     tags: [Creditos]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos del nuevo crédito
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credito'
 *     responses:
 *       201:
 *         description: Crédito creado correctamente
 *       500:
 *         description: Error al crear el crédito
 */
exports.createCredito = async (req, res) => {
  const { cantidad } = req.body;
  try {
    const credito = await Creditos.create({
      cantidad: cantidad,
      id_usuario: req.params.id_usuario,
    });
    res.status(201).json(credito);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el crédito" });
  }
};

/**
 * @swagger
 * /api/creditos/{id}:
 *   put:
 *     summary: Actualiza un crédito específico de un usuario
 *     tags: [Creditos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del crédito
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos actualizados del crédito
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credito'
 *     responses:
 *       200:
 *         description: Crédito actualizado correctamente
 *       404:
 *         description: Crédito no encontrado
 *       500:
 *         description: Error al actualizar el crédito
 */
exports.updateCredito = async (req, res) => {
  const creditoId = req.params.id;
  try {
    const [updated] = await Creditos.update(req.body, {
      where: { id_creditos: creditoId, id_usuario: req.params.id_usuario },
    });
    if (updated) {
      const updatedCredito = await Creditos.findOne({
        where: { id_creditos: creditoId, id_usuario: req.params.id_usuario },
      });
      return res.status(200).json({
        message: "Crédito actualizado",
        data: updatedCredito,
      });
    }
    throw new Error("Crédito no encontrado");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el crédito" });
  }
};

/**
 * @swagger
 * /api/creditos/{id}:
 *   delete:
 *     summary: Elimina un crédito específico de un usuario
 *     tags: [Creditos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del crédito
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Crédito eliminado correctamente
 *       404:
 *         description: Crédito no encontrado
 *       500:
 *         description: Error al eliminar el crédito
 */
exports.deleteCredito = async (req, res) => {
  const creditoId = req.params.id;
  try {
    const deleted = await Creditos.destroy({
      where: { id_creditos: creditoId, id_usuario: req.params.id_usuario },
    });
    if (deleted) {
      return res.status(200).json({ message: "Crédito eliminado" });
    }
    throw new Error("Crédito no encontrado");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el crédito" });
  }
};
