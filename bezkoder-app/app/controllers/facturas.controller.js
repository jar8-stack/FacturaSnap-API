const db = require("../models");
const Facturas = db.facturas;
const Tesseract = require('tesseract.js');

/**
 * @swagger
 * tags:
 *   name: Facturas
 *   description: Endpoints para operaciones relacionadas con facturas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Factura:
 *       type: object
 *       properties:
 *         numero_folio:
 *           type: string
 *           description: Número de folio de la factura
 *         fecha_transaccion:
 *           type: string
 *           format: date-time
 *           description: Fecha de la transacción de la factura
 *         subtotal:
 *           type: number
 *           description: Subtotal de la factura
 *         total:
 *           type: number
 *           description: Total de la factura
 *       example:
 *         numero_folio: "F2023-001"
 *         fecha_transaccion: "2023-04-10T12:00:00Z"
 *         subtotal: 100.00
 *         total: 110.00
 */

/**
 * @swagger
 * /api/facturas:
 *   get:
 *     summary: Obtiene la lista de todas las facturas del usuario autenticado
 *     tags: [Facturas]
 *     responses:
 *       200:
 *         description: Lista de facturas obtenida correctamente
 *       500:
 *         description: Error al obtener la lista de facturas
 */
exports.getAllFacturas = async (req, res) => {
  const usuarioId = req.user.id; // Obtener el ID del usuario autenticado desde la solicitud

  try {
    const facturas = await Facturas.findAll({
      where: { id_usuario: usuarioId },
    });
    res.status(200).json(facturas);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener la lista de facturas" });
  }
};

/**
 * @swagger
 * /api/facturas/{id}:
 *   get:
 *     summary: Obtiene información de una factura específica del usuario autenticado
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la factura
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información de la factura obtenida correctamente
 *       404:
 *         description: Factura no encontrada
 *       500:
 *         description: Error al obtener información de la factura
 */
exports.getFacturaById = async (req, res) => {  
  const usuarioId = req.user.id; // Obtener el ID del usuario autenticado desde la solicitud

  try {
    const factura = await Facturas.findOne({
      where: { id_usuario: usuarioId, id_factura: req.params.id },
    });

    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    res.status(200).json(factura);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener información de la factura" });
  }
};

/**
 * @swagger
 * /api/facturas:
 *   post:
 *     summary: Crea una nueva factura para el usuario autenticado
 *     tags: [Facturas]
 *     requestBody:
 *       description: Datos de la nueva factura
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Factura'
 *     responses:
 *       201:
 *         description: Factura creada correctamente
 *       500:
 *         description: Error al crear la factura
 */
exports.createFactura = async (req, res) => {
  const usuarioId = req.user.id; // Obtener el ID del usuario autenticado desde la solicitud
  const { numero_folio, fecha_transaccion, subtotal, total } = req.body;

  try {
    const factura = await Facturas.create({
      numero_folio: numero_folio,
      fecha_transaccion: fecha_transaccion,
      subtotal: subtotal,
      total: total,
      id_usuario: usuarioId,
    });

    res.status(201).json(factura);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear la factura" });
  }
};

/**
 * @swagger
 * /api/facturas/{id}:
 *   put:
 *     summary: Actualiza una factura específica del usuario autenticado
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la factura
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos actualizados de la factura
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Factura'
 *     responses:
 *       200:
 *         description: Factura actualizada correctamente
 *       404:
 *         description: Factura no encontrada
 *       500:
 *         description: Error al actualizar la factura
 */
exports.updateFactura = async (req, res) => {
  const facturaId = req.params.id;
  const usuarioId = req.user.id; // Obtener el ID del usuario autenticado desde la solicitud

  try {
    const [updated] = await Facturas.update(req.body, {
      where: { id_usuario: usuarioId, id_factura: facturaId },
    });

    if (updated) {
      const updatedFactura = await Facturas.findOne({
        where: { id_usuario: usuarioId, id_factura: facturaId },
      });

      return res.status(200).json({
        message: "Factura actualizada",
        data: updatedFactura,
      });
    }

    throw new Error("Factura no encontrada");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar la factura" });
  }
};

/**
 * @swagger
 * /api/facturas/{id}:
 *   delete:
 *     summary: Elimina una factura específica del usuario autenticado
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la factura
 *         schema:
 *           type: integer
 *     responses:
 *        200:
 *          description: Factura eliminada correctamente
 *        404:
 *          description: Factura no encontrada
 *        500:
 *          description: Error al eliminar la factura
 */
exports.deleteFactura = async (req, res) => {
  const facturaId = req.params.id;
  const usuarioId = req.user.id; // Obtener el ID del usuario autenticado desde la solicitud

  try {
    const deleted = await Facturas.destroy({
      where: { id_usuario: usuarioId, id_factura: facturaId },
    });

    if (deleted) {
      return res.status(200).json({ message: "Factura eliminada" });
    }

    throw new Error("Factura no encontrada");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar la factura" });
  }
};


/**
 * @swagger
 * /api/facturas/extract-text:
 *   post:
 *     summary: Extraer texto de una imagen en formato Base64.
 *     description: Este endpoint permite extraer texto de una imagen en formato Base64 utilizando Tesseract.js.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base64Image:
 *                 type: string
 *                 description: Imagen en formato Base64.
 *     responses:
 *       200:
 *         description: Texto extraído exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 extractedText:
 *                   type: string
 *                   description: Texto extraído de la imagen.
 *       400:
 *         description: Solicitud incorrecta. La imagen en formato Base64 es requerida.
 *       500:
 *         description: Error al procesar la imagen.
 *
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
exports.extractTextFromImage = async (req, res) => {
  try {
    const base64Image = req.body.base64Image; // Asumiendo que envías la imagen en el cuerpo de la solicitud con el nombre 'base64Image'

    if (!base64Image) {
      return res.status(400).json({ message: 'La imagen en formato Base64 es requerida.' });
    }

    // Decodificar la imagen Base64
    const imageBuffer = Buffer.from(base64Image, 'base64');

    // Guardar la imagen localmente (opcional)
    // fs.writeFileSync('imagen.jpg', imageBuffer);

    // Realizar el reconocimiento de texto con Tesseract
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');

    return res.status(200).json({ extractedText: text });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error al procesar la imagen.' });
  }
};