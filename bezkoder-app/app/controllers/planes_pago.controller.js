const db = require("../models");
const PlanesPago = db.planes_pago;

/**
 * @swagger
 * tags:
 *   name: PlanesPago
 *   description: Endpoints para operaciones relacionadas con planes de pago
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PlanPago:
 *       type: object
 *       properties:
 *         descripcion:
 *           type: string
 *           description: Descripción del plan de pago
 *         cantidad_creditos:
 *           type: integer
 *           description: Cantidad de créditos incluidos en el plan
 *         precio:
 *           type: number
 *           description: Precio del plan de pago
 *       example:
 *         descripcion: "Plan Mensual"
 *         cantidad_creditos: 100
 *         precio: 50.00
 */

/**
 * @swagger
 * /api/planes-pago:
 *   get:
 *     summary: Obtiene la lista de todos los planes de pago
 *     tags: [PlanesPago]
 *     responses:
 *       200:
 *         description: Lista de planes de pago obtenida correctamente
 *       500:
 *         description: Error al obtener la lista de planes de pago
 */
exports.getAllPlanesPago = async (req, res) => {
  try {
    const planesPago = await PlanesPago.findAll();
    res.status(200).json(planesPago);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener la lista de planes de pago" });
  }
};

/**
 * @swagger
 * /api/planes-pago/{id}:
 *   get:
 *     summary: Obtiene información de un plan de pago específico
 *     tags: [PlanesPago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del plan de pago
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del plan de pago obtenida correctamente
 *       404:
 *         description: Plan de pago no encontrado
 *       500:
 *         description: Error al obtener información del plan de pago
 */
exports.getPlanPagoById = async (req, res) => {
  const planPagoId = req.params.id;
  try {
    const planPago = await PlanesPago.findByPk(planPagoId);
    if (!planPago) {
      return res.status(404).json({ message: "Plan de pago no encontrado" });
    }
    res.status(200).json(planPago);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener información del plan de pago" });
  }
};

/**
 * @swagger
 * /api/planes-pago:
 *   post:
 *     summary: Crea un nuevo plan de pago
 *     tags: [PlanesPago]
 *     requestBody:
 *       description: Datos del nuevo plan de pago
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanPago'
 *     responses:
 *       201:
 *         description: Plan de pago creado correctamente
 *       500:
 *         description: Error al crear el plan de pago
 */
exports.createPlanPago = async (req, res) => {
  const { descripcion, cantidad_creditos, precio } = req.body;
  try {
    const planPago = await PlanesPago.create({
      descripcion: descripcion,
      cantidad_creditos: cantidad_creditos,
      precio: precio,
    });
    res.status(201).json(planPago);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el plan de pago" });
  }
};

/**
 * @swagger
 * /api/planes-pago/{id}:
 *   put:
 *     summary: Actualiza un plan de pago específico
 *     tags: [PlanesPago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del plan de pago
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos actualizados del plan de pago
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanPago'
 *     responses:
 *       200:
 *         description: Plan de pago actualizado correctamente
 *       404:
 *         description: Plan de pago no encontrado
 *       500:
 *         description: Error al actualizar el plan de pago
 */
exports.updatePlanPago = async (req, res) => {
  const planPagoId = req.params.id;
  try {
    const [updated] = await PlanesPago.update(req.body, {
      where: { id_planes_pago: planPagoId },
    });
    if (updated) {
      const updatedPlanPago = await PlanesPago.findByPk(planPagoId);
      return res.status(200).json({
        message: "Plan de pago actualizado",
        data: updatedPlanPago,
      });
    }
    throw new Error("Plan de pago no encontrado");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el plan de pago" });
  }
};

/**
 * @swagger
 * /api/planes-pago/{id}:
 *   delete:
 *     summary: Elimina un plan de pago específico
 *     tags: [PlanesPago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del plan de pago a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan de pago eliminado correctamente
 *       404:
 *         description: Plan de pago no encontrado
 *       500:
 *         description: Error al eliminar el plan de pago
 */
exports.deletePlanPago = async (req, res) => {
  const planPagoId = req.params.id;
  try {
    const deleted = await PlanesPago.destroy({
      where: { id_planes_pago: planPagoId },
    });
    if (deleted) {
      return res.status(200).json({ message: "Plan de pago eliminado" });
    }
    throw new Error("Plan de pago no encontrado");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el plan de pago" });
  }
};
