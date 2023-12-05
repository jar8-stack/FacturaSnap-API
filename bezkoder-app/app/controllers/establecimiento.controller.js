const db = require("../models");
const Establecimiento = db.establecimiento;


/**
 * @swagger
 * tags:
 *   name: Establecimientos
 *   description: API para realizar operaciones en establecimientos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Establecimiento:
 *       type: object
 *       required:
 *         - nombre
 *         - estado_republica
 *         - metodo_factura
 *         - establecimientocol
 *       properties:
 *         id_establecimiento:
 *           type: integer
 *           description: ID único del establecimiento
 *         nombre:
 *           type: string
 *           description: Nombre del establecimiento
 *         estado_republica:
 *           type: string
 *           description: Estado de la república del establecimiento
 *         metodo_factura:
 *           type: string
 *           description: Método de facturación del establecimiento 
 */
// Obtener todos los establecimientos

/**
 * @swagger
 * /api/establecimientos:
 *   get:
 *     summary: Obtener todos los establecimientos
 *     tags: [Establecimientos]
 *     responses:
 *       200:
 *         description: Lista de establecimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Establecimiento'
 */
exports.getAllEstablecimientos = async (req, res) => {
  try {
    const establecimientos = await Establecimiento.findAll();
    res.status(200).json(establecimientos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener la lista de establecimientos" });
  }
};


/**
 * @swagger
 * /api/establecimientos/{id}:
 *   get:
 *     summary: Obtener un establecimiento por su ID
 *     tags: [Establecimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del establecimiento
 *     responses:
 *       200:
 *         description: Establecimiento obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Establecimiento'
 *       404:
 *         description: Establecimiento no encontrado
 */
// Obtener un establecimiento por su ID
exports.getEstablecimientoById = async (req, res) => {
  const establecimientoId = req.params.id;
  try {
    const establecimiento = await Establecimiento.findByPk(establecimientoId);
    if (!establecimiento) {
      return res.status(404).json({ message: "Establecimiento no encontrado" });
    }
    res.status(200).json(establecimiento);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener información del establecimiento" });
  }
};


/**
 * @swagger
 * /api/establecimientos:
 *   post:
 *     summary: Crear un nuevo establecimiento
 *     tags: [Establecimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Establecimiento'
 *     responses:
 *       201:
 *         description: Establecimiento creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Establecimiento'
 *       500:
 *         description: Error al crear el establecimiento
 */
// Crear un nuevo establecimiento
exports.createEstablecimiento = async (req, res) => {
  const { nombre, estado_republica, metodo_factura, establecimientocol } = req.body;
  try {
    const establecimiento = await Establecimiento.create({
      nombre: nombre,
      estado_republica: estado_republica,
      metodo_factura: metodo_factura,      
    });
    res.status(201).json(establecimiento);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el establecimiento" });
  }
};


/**
 * @swagger
 * /api/establecimientos/{id}:
 *   put:
 *     summary: Actualizar un establecimiento por su ID
 *     tags: [Establecimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del establecimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Establecimiento'
 *     responses:
 *       200:
 *         description: Establecimiento actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Establecimiento'
 *       500:
 *         description: Error al actualizar el establecimiento
 */
// Actualizar un establecimiento por su ID
exports.updateEstablecimiento = async (req, res) => {
  const establecimientoId = req.params.id;
  try {
    const [updated] = await Establecimiento.update(req.body, {
      where: { id_establecimiento: establecimientoId },
    });
    if (updated) {
      const updatedEstablecimiento = await Establecimiento.findByPk(establecimientoId);
      return res.status(200).json({
        message: "Establecimiento actualizado",
        data: updatedEstablecimiento,
      });
    }
    throw new Error("Establecimiento no encontrado");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el establecimiento" });
  }
};


/**
 * @swagger
 * /api/establecimientos/{id}:
 *   delete:
 *     summary: Eliminar un establecimiento por su ID
 *     tags: [Establecimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del establecimiento
 *     responses:
 *       200:
 *         description: Establecimiento eliminado con éxito
 *       500:
 *         description: Error al eliminar el establecimiento
 */
// Eliminar un establecimiento por su ID
exports.deleteEstablecimiento = async (req, res) => {
  const establecimientoId = req.params.id;
  try {
    const deleted = await Establecimiento.destroy({
      where: { id_establecimiento: establecimientoId },
    });
    if (deleted) {
      return res.status(200).json({ message: "Establecimiento eliminado" });
    }
    throw new Error("Establecimiento no encontrado");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el establecimiento" });
  }
};
