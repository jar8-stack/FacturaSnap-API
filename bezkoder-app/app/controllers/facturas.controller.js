const db = require("../models");
const Facturas = db.facturas;
const fs = require('fs');
const Tesseract = require('node-tesseract-ocr');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

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
 *     summary: Extraer número de FOLIO FACTURACION de una imagen en formato Base64.
 *     description: Este endpoint permite extraer el número de FOLIO FACTURACION de una imagen en formato Base64 utilizando Tesseract.js.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Objeto de solicitud que incluye la imagen en formato Base64 y el establecimiento.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             base64Image:
 *               type: string
 *               description: Imagen en formato Base64.
 *             establecimiento:
 *               type: string
 *               description: Nombre del establecimiento (por ejemplo, '/super-aki').
 *     responses:
 *       200:
 *         description: Número de FOLIO FACTURACION extraído exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 extractedText:
 *                   type: string
 *                   description: Número de FOLIO FACTURACION extraído de la imagen.
 *       400:
 *         description: Solicitud incorrecta. La imagen en formato Base64 es requerida.
 *       404:
 *         description: No se encontró el número de FOLIO FACTURACION en la imagen.
 *       500:
 *         description: Error al procesar la imagen.
 *
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
exports.extractTextFromImage = async (req, res) => {
  try {
    const base64Image = req.body.base64Image;
    const establecimiento = req.body.establecimiento;

    switch (establecimiento) {
      case '/super-aki':
        if (!base64Image) {
          return res.status(400).json({ message: 'La imagen en formato Base64 es requerida.' });
        }

        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Verificar la longitud de la imagen
        console.log('Longitud de la imagen:', imageBuffer.length);

        // Opciones de configuración para Tesseract OCR
        const config = {
          lang: 'spa',
          oem: 1, // OCR Engine Mode: 1 para el modo de OCR predeterminado
          psm: 6, // Page Segmentation Mode: 6 para tratar el texto como un bloque de palabras
        };

        // Reconocimiento de texto con node-tesseract-ocr
        let text;
        try {
          const result = await Tesseract.recognize(imageBuffer, config);
          text = result.data.text;
        } catch (error) {
          console.error('Error durante el reconocimiento de texto:', error);
          return res.status(500).json({ message: 'Error durante el procesamiento de la imagen.' });
        }

        // Buscar el número después de "FOLIO FACTURACION" en el texto
        const regex = /FOLIO FACTURACION: (\d+)/;
        const match = text.match(regex);

        if (match && match[1]) {
          const folio = match[1];
          return res.status(200).json({ extractedText: folio });
        } else {
          return res.status(404).json({ message: 'No se encontró el número de FOLIO FACTURACION.' });
        }

      default:
        return res.status(400).json({ message: 'Establecimiento no admitido.' });
    }
  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({ message: 'Error al procesar la imagen.' });
  }
};


/**
 * @swagger
 * /api/facturas/generar-factura-super-aki:
 *   post:
 *     summary: Generar factura Super Aki
 *     description: Genera una factura en el sitio web de Super Aki.
 *     tags:
 *       - Facturas
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Parámetros para generar la factura Super Aki.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             RFC_Field:
 *               type: string
 *               description: RFC del cliente.
 *             folioField:
 *               type: string
 *               description: Número de folio de facturación.
 *             uso_CFID:
 *               type: string
 *               description: Uso CFDI.
 *             opcion_regimen_elegida:
 *               type: string
 *               description: Opción de régimen fiscal elegida.
 *     responses:
 *       200:
 *         description: URL del archivo PDF de la factura generada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url_pdf:
 *                   type: string
 *                   description: URL del archivo PDF de la factura generada.
 *       500:
 *         description: Error al generar la factura PDF.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 */
exports.generateFacturaSuperAki = async (req, res) => {
  const { RFC_Field, folioField, uso_CFID, opcion_regimen_elegida } = req.body;

  // Configurar las opciones de Chrome para el modo sin cabeza
  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--headless');

  // Crear una instancia del navegador Chrome
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  try {
    // Abrir la página web
    await driver.get('http://factura.superaki.mx/tickets/Paginas/FrmCapturaTicket.aspx');

    // Esperar a que el campo RFC esté presente
    const RFC_Element = await driver.findElement(By.xpath('//*[@id="MainContent_txtRFC"]'));
    await RFC_Element.sendKeys(RFC_Field);

    // Esperar a que el checkbox de folio esté presente y hacer clic en él
    const check_folio = await driver.findElement(By.xpath('//*[@id="MainContent_rbFolio"]'));
    await check_folio.click();

    // Esperar a que el campo de folio esté presente
    const folio_Element = await driver.findElement(By.xpath('//*[@id="MainContent_txtFolioFacturacion"]'));
    await folio_Element.sendKeys(folioField);

    // Esperar a que el botón siguiente esté presente y hacer clic en él
    const nextButton1 = await driver.findElement(By.xpath('//*[@id="MainContent_btnSiguienteFolio"]'));
    await nextButton1.click();

    // Esperar a que el campo de uso CFID esté presente
    const usoCFID_Element = await driver.findElement(By.xpath('//*[@id="MainContent_cboCFDI"]'));

    // Crear un objeto Select
    const select = await usoCFID_Element;
    await select.sendKeys(uso_CFID);

    // ... Resto del código para las opciones de uso CFDI ...



    // Esperar a que el campo de régimen fiscal esté presente
    const selectRegimen_Element = await driver.findElement(By.xpath('//*[@id="MainContent_cboRegimenFiscal"]'));

    // Crear un objeto Select para el campo de régimen fiscal
    const select_regimen = await selectRegimen_Element;
    await select_regimen.sendKeys(opcion_regimen_elegida);

    // ... Resto del código para las opciones de régimen fiscal ...

    // Esperar a que el botón de facturar esté presente y hacer clic en él
    const facturar_button = await driver.findElement(By.xpath('//*[@id="MainContent_btnFacturar"]'));
    await facturar_button.click();

    // Esperar a que el enlace de la factura PDF esté presente
    const factura_pdf = await driver.findElement(By.xpath('//*[@id="MainContent_aPDF"]'));

    // Obtener el valor del atributo 'href'
    const valor_href = await factura_pdf.getAttribute('href');

    // Construir la URL completa del PDF
    const url_pdf = 'http://factura.superaki.mx/Tickets/Paginas/' + valor_href;

    res.status(200).json({ url_pdf });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar la factura PDF' });
  } finally {
    // Cerrar el navegador al finalizar
    try {
      await driver.quit();
    } catch (quitError) {
      console.error(quitError);
    }
  }
};