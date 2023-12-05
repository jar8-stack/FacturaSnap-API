const db = require("../models");
const DatosFiscales = db.datos_fiscales;

/**
 * @swagger
 * tags:
 *   name: DatosFiscales
 *   description: Endpoints para operaciones relacionadas con datos fiscales
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DatosFiscales:
 *       type: object
 *       properties:
 *         razon_social:
 *           type: string
 *           description: Razón social
 *         calle:
 *           type: string
 *           description: Calle
 *         numero_exterior:
 *           type: string
 *           description: Número exterior
 *         cruzamientos:
 *           type: string
 *           description: Cruzamientos
 *         estado:
 *           type: string
 *           description: Estado
 *         municipio_delegacion:
 *           type: string
 *           description: Municipio o delegación
 *         colonia:
 *           type: string
 *           description: Colonia
 *         email_fiscal:
 *           type: string
 *           description: Email fiscal
 *         codigo_postal:
 *           type: string
 *           description: Código postal
 *       example:
 *         razon_social: Empresa XYZ
 *         calle: Calle Principal
 *         numero_exterior: 123
 *         cruzamientos: Entre Calle A y Calle B
 *         estado: Estado XYZ
 *         municipio_delegacion: Municipio ABC
 *         colonia: Colonia X
 *         email_fiscal: info@empresa.xyz
 *         codigo_postal: 12345
 */

/**
 * @swagger
 * /api/datos-fiscales:
 *   get:
 *     summary: Obtiene la lista de todos los datos fiscales
 *     tags: [DatosFiscales]
 *     responses:
 *       200:
 *         description: Lista de datos fiscales obtenida correctamente
 *       500:
 *         description: Error al obtener la lista de datos fiscales
 */
exports.getAllDatosFiscales = async (req, res) => {
  try {
    const datosFiscales = await DatosFiscales.findAll();
    res.status(200).json(datosFiscales);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener la lista de datos fiscales" });
  }
};

/**
 * @swagger
 * /api/datos-fiscales/{id}:
 *   get:
 *     summary: Obtiene información de datos fiscales específicos
 *     tags: [DatosFiscales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de datos fiscales
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información de datos fiscales obtenida correctamente
 *       404:
 *         description: Datos fiscales no encontrados
 *       500:
 *         description: Error al obtener información de datos fiscales
 */
exports.getDatosFiscalesById = async (req, res) => {
  const datosFiscalesId = req.params.id;
  const usuarioId = req.user.id; // Obtener el ID del usuario autenticado desde la solicitud
  try {
    const datosFiscales = await DatosFiscales.findOne({
      where: { id_datos_fiscales: datosFiscalesId, id_usuario: usuarioId },
    });
    if (!datosFiscales) {
      return res.status(404).json({ message: "Datos fiscales no encontrados" });
    }
    res.status(200).json(datosFiscales);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener información de datos fiscales" });
  }
};

/**
 * @swagger
 * /api/datos-fiscales:
 *   post:
 *     summary: Crea nuevos datos fiscales
 *     tags: [DatosFiscales]
 *     requestBody:
 *       description: Datos de los nuevos datos fiscales
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DatosFiscales'
 *     responses:
 *       201:
 *         description: Datos fiscales creados correctamente
 *       500:
 *         description: Error al crear datos fiscales
 */
exports.createDatosFiscales = async (req, res) => {
  const usuarioId = req.user.id; // Obtener el ID del usuario autenticado desde la solicitud
  const { razon_social, calle, numero_exterior, cruzamientos, estado, municipio_delegacion, colonia, email_fiscal, codigo_postal } = req.body;
  try {
    const datosFiscales = await DatosFiscales.create({
      razon_social: razon_social,
      calle: calle,
      numero_exterior: numero_exterior,
      cruzamientos: cruzamientos,
      estado: estado,
      municipio_delegacion: municipio_delegacion,
      colonia: colonia,
      email_fiscal: email_fiscal,
      codigo_postal: codigo_postal,
      id_usuario: usuarioId,
    });
    res.status(201).json(datosFiscales);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear datos fiscales" });
  }
};

/**
 * @swagger
 * /api/datos-fiscales/{id}:
 *   put:
 *     summary: Actualiza datos fiscales específicos
 *     tags: [DatosFiscales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de datos fiscales
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos actualizados de datos fiscales
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DatosFiscales'
 *     responses:
 *       200:
 *         description: Datos fiscales actualizados correctamente
 *       404:
 *         description: Datos fiscales no encontrados
 *       500:
 *         description: Error al actualizar datos fiscales
 */
exports.updateDatosFiscales = async (req, res) => {
  const datosFiscalesId = req.params.id;
  const usuarioId = req.user.id; // Obtener el ID del usuario autenticado desde la solicitud
  try {
    const [updated] = await DatosFiscales.update(req.body, {
      where: { id_datos_fiscales: datosFiscalesId, id_usuario: usuarioId },
    });
    if (updated) {
      const updatedDatosFiscales = await DatosFiscales.findOne({
        where: { id_datos_fiscales: datosFiscalesId, id_usuario: usuarioId },
      });
      return res.status(200).json({
        message: "Datos fiscales actualizados",
        data: updatedDatosFiscales,
      });
    }
    throw new Error("Datos fiscales no encontrados");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar datos fiscales" });
  }
};

/**
 * @swagger
 * /api/datos-fiscales/{id}:
 *   delete:
 *     summary: Elimina datos fiscales específicos
 *     tags: [DatosFiscales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de datos fiscales
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos fiscales eliminados correctamente
 *       404:
 *         description: Datos fiscales no encontrados
 *       500:
 *         description: Error al eliminar datos fiscales
 */
exports.deleteDatosFiscales = async (req, res) => {
  const datosFiscalesId = req.params.id;
  const usuarioId = req.user.id; // Obtener el ID del usuario autenticado desde la solicitud
  try {
    const deleted = await DatosFiscales.destroy({
      where: { id_datos_fiscales: datosFiscalesId, id_usuario: usuarioId },
    });
    if (deleted) {
      return res.status(200).json({ message: "Datos fiscales eliminados" });
    }
    throw new Error("Datos fiscales no encontrados");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar datos fiscales" });
  }
};
