const db = require("../models");
const FacturasHasEstablecimiento = db.facturas_has_establecimiento;


/**
 * @swagger
 * tags:
 *   name: FacturasHasEstablecimiento
 *   description: API para gestionar relaciones entre facturas y establecimientos
 */

/**
 * @swagger
 * /api/facturas-has-establecimiento:
 *   get:
 *     summary: Obtener todas las relaciones entre facturas y establecimientos
 *     tags: [FacturasHasEstablecimiento]
 *     responses:
 *       200:
 *         description: Lista de relaciones entre facturas y establecimientos
 */
// Obtener todas las relaciones entre facturas y establecimientos
exports.getAllFacturasHasEstablecimientos = async (req, res) => {
  try {
    const facturasHasEstablecimientos = await FacturasHasEstablecimiento.findAll();
    res.status(200).json(facturasHasEstablecimientos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener la lista de relaciones entre facturas y establecimientos" });
  }
};

/**
 * @swagger
 * /api/facturas-has-establecimiento/{id_factura}/{id_establecimiento}:
 *   get:
 *     summary: Obtener una relación entre factura y establecimiento por IDs
 *     tags: [FacturasHasEstablecimiento]
 *     parameters:
 *       - in: path
 *         name: id_factura
 *         required: true
 *         description: ID de la factura
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_establecimiento
 *         required: true
 *         description: ID del establecimiento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relación entre factura y establecimiento
 *       404:
 *         description: Relación no encontrada
 */
// Obtener una relación entre factura y establecimiento por IDs
exports.getFacturasHasEstablecimientoByIds = async (req, res) => {
  const { id_factura, id_establecimiento } = req.params;
  try {
    const facturasHasEstablecimiento = await FacturasHasEstablecimiento.findOne({
      where: { id_factura: id_factura, id_establecimiento: id_establecimiento },
    });

    if (!facturasHasEstablecimiento) {
      return res.status(404).json({ message: "Relación entre factura y establecimiento no encontrada" });
    }

    res.status(200).json(facturasHasEstablecimiento);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener información de la relación entre factura y establecimiento" });
  }
};

/**
 * @swagger
 * /api/facturas-has-establecimiento:
 *   post:
 *     summary: Crear una nueva relación entre factura y establecimiento
 *     tags: [FacturasHasEstablecimiento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_factura:
 *                 type: integer
 *                 description: ID de la factura
 *               id_establecimiento:
 *                 type: integer
 *                 description: ID del establecimiento
 *     responses:
 *       201:
 *         description: Relación creada
 *       500:
 *         description: Error al crear la relación
 */
// Crear una nueva relación entre factura y establecimiento
exports.createFacturasHasEstablecimiento = async (req, res) => {
  const { id_factura, id_establecimiento } = req.body;
  try {
    const facturasHasEstablecimiento = await FacturasHasEstablecimiento.create({
      id_factura: id_factura,
      id_establecimiento: id_establecimiento,
    });

    res.status(201).json(facturasHasEstablecimiento);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear la relación entre factura y establecimiento" });
  }
};

/**
 * @swagger
 * /api/facturas-has-establecimiento/{id_factura}/{id_establecimiento}:
 *   delete:
 *     summary: Eliminar una relación entre factura y establecimiento por IDs
 *     tags: [FacturasHasEstablecimiento]
 *     parameters:
 *       - in: path
 *         name: id_factura
 *         required: true
 *         description: ID de la factura
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_establecimiento
 *         required: true
 *         description: ID del establecimiento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relación eliminada
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error al eliminar la relación
 */
// Eliminar una relación entre factura y establecimiento por IDs
exports.deleteFacturasHasEstablecimientoByIds = async (req, res) => {
  const { id_factura, id_establecimiento } = req.params;
  try {
    const deleted = await FacturasHasEstablecimiento.destroy({
      where: { id_factura: id_factura, id_establecimiento: id_establecimiento },
    });

    if (deleted) {
      return res.status(200).json({ message: "Relación entre factura y establecimiento eliminada" });
    }

    throw new Error("Relación entre factura y establecimiento no encontrada");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar la relación entre factura y establecimiento" });
  }
};

/**
 * @swagger
 * /api/facturas-has-establecimiento/{id_factura}/{id_establecimiento}:
 *   put:
 *     summary: Actualizar una relación entre factura y establecimiento por IDs
 *     tags: [FacturasHasEstablecimiento]
 *     parameters:
 *       - in: path
 *         name: id_factura
 *         required: true
 *         description: ID de la factura
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_establecimiento
 *         required: true
 *         description: ID del establecimiento
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Propiedades que se pueden actualizar
 *     responses:
 *       200:
 *         description: Relación actualizada
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error al actualizar la relación
 */
// Actualizar una relación entre factura y establecimiento por IDs
exports.updateFacturasHasEstablecimiento = async (req, res) => {
  const { id_factura, id_establecimiento } = req.params;
  try {
    const [updated] = await FacturasHasEstablecimiento.update(req.body, {
      where: { id_factura: id_factura, id_establecimiento: id_establecimiento },
    });

    if (updated) {
      const updatedFacturasHasEstablecimiento = await FacturasHasEstablecimiento.findOne({
        where: { id_factura: id_factura, id_establecimiento: id_establecimiento },
      });

      return res.status(200).json({
        message: "Relación entre factura y establecimiento actualizada",
        data: updatedFacturasHasEstablecimiento,
      });
    }

    throw new Error("Relación entre factura y establecimiento no encontrada");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar la relación entre factura y establecimiento" });
  }
};
