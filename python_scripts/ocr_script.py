# app.py

from flask import Flask, request, jsonify
from PIL import Image
import pytesseract
import base64
from io import BytesIO
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from webdriver_manager.chrome import ChromeDriverManager
import re

# Configurar las opciones del navegador (puedes personalizar según tus necesidades)
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument("--window-size=1920,1080")
driver = webdriver.Chrome(options=chrome_options)


app = Flask(__name__)

# Especifica la ubicación de Tesseract
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'

def facturar_super_aki_selenium(RFC_Field, folioField, uso_CFID, opcion_regimen_elegida):
    try:
        # Abrir la página web
        driver.get('http://factura.superaki.mx/tickets/Paginas/FrmCapturaTicket.aspx')

        # Esperar a que el campo RFC esté presente
        RFC_Element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="MainContent_txtRFC"]'))
        )
        RFC_Element.send_keys(RFC_Field)

        # Esperar a que el checkbox de folio esté presente y hacer clic en él
        check_folio = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="MainContent_rbFolio"]'))
        )
        check_folio.click()

        # Esperar a que el campo de folio esté presente
        folio_Element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="MainContent_txtFolioFacturacion"]'))
        )
        folio_Element.send_keys(folioField)

        # Esperar a que el botón siguiente esté presente y hacer clic en él
        nextButton1 = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="MainContent_btnSiguienteFolio"]'))
        )
        nextButton1.click()

        # Esperar a que el campo de uso CFID esté presente
        usoCFID_Element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="MainContent_cboCFDI"]'))
        )

        # Crear un objeto Select
        select = Select(usoCFID_Element)
        select.select_by_value(uso_CFID)

        # ... Resto del código para las opciones de uso CFDI ...

        # Esperar a que el campo de régimen fiscal esté presente
        selectRegimen_Element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="MainContent_cboRegimenFiscal"]'))
        )

        # Crear un objeto Select para el campo de régimen fiscal
        select_regimen = Select(selectRegimen_Element)
        select_regimen.select_by_value(opcion_regimen_elegida)

        # ... Resto del código para las opciones de régimen fiscal ...

        # Esperar a que el botón de facturar esté presente y hacer clic en él
        facturar_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="MainContent_btnFacturar"]'))
        )
        facturar_button.click()

        # Esperar a que el enlace de la factura PDF esté presente
        factura_pdf = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="MainContent_aPDF"]'))
        )

        # Obtener el valor del atributo 'href'
        valor_href = factura_pdf.get_attribute('href')

        # Construir la URL completa del PDF
        url_pdf = valor_href

        return url_pdf

    finally:
        # Cerrar el navegador al finalizar
        driver.quit()

def ocr_folio_facturacion_super_aki(base64_image, establecimiento):            
    # Decodificar la imagen base64
    image_data = base64.b64decode(base64_image)
    image = Image.open(BytesIO(image_data))

    # Configuración para incluir "#" como un carácter reconocible
    custom_config = r'--psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#:'

    # Aplicar OCR a la imagen con la configuración personalizada
    ocr_result = pytesseract.image_to_string(image, lang='spa', config=custom_config)

    print(ocr_result)



    if establecimiento == '/super-aki':
        # Buscar el texto "FOLIO FACTURACION:" o "FOLIO FACTURACIÓN:" y extraer el número siguiente
        keyword_1 = "FOLIO FACTURACION:"
        keyword_2 = "FOLIOFACTURACION:"
        index_1 = ocr_result.find(keyword_1)
        index_2 = ocr_result.find(keyword_2)

        if index_1 != -1:
            index = index_1
        elif index_2 != -1:
            index = index_2
        else:
            # Si no se encontró ninguno de los patrones, devolver None
            return None

        folio_text = ocr_result[index + len(keyword_1 if index == index_1 else keyword_2):].split()[0]

        # Si el texto extraído es un número, devolverlo
        if folio_text.isdigit():
            return int(folio_text)

    elif establecimiento == '/bodega-aurrera':        
        # Buscar el número después de TR#, TC# y C.P.
        tr_match = re.search(r'TR\D*(\d+)', ocr_result)  # Permitir cualquier carácter no numérico entre TR y el número
        tc_match = re.search(r'TC\D*(\d+)', ocr_result)  # Permitir cualquier carácter no numérico entre TC y el número
        cp_match = re.search(r'C\.?P\.?\D*(\d+)', ocr_result)  # Permitir variaciones en la escritura de C.P.

        # Extraer los valores encontrados (o None si no se encuentran)
        tr_number = int(tr_match.group(1)) if tr_match else None
        tc_number = int(tc_match.group(1)) if tc_match else None
        cp_number = int(cp_match.group(1)) if cp_match else None

        return {
            "TR_number": tr_number,
            "TC_number": tc_number,
            "CP_number": cp_number,            
            "error": None
        }       
    # Si no se encontró un número, devolver None
    return None

@app.route('/api/obtener_folio', methods=['POST'])
def obtener_folio():
    try:
        data = request.get_json()

        # Obtener el establecimiento desde la solicitud
        establecimiento = data.get('establecimiento', '')

        if establecimiento == '/super-aki':
            # Si el establecimiento es /super-aki, realizar el proceso con OCR
            base64_image = data.get('base64_image', '')                        
            folio_number_ocr = ocr_folio_facturacion_super_aki(base64_image, establecimiento)

            if folio_number_ocr is not None:
                return jsonify({'success': True, 'folio_number': folio_number_ocr})
            else:
                return jsonify({'success': False, 'message': 'No se pudo extraer el folio de facturación.'})
        if establecimiento == '/bodega-aurrera':
            # Si el establecimiento es /bodega-aurrera, realizar el proceso con OCR
            base64_image = data.get('base64_image', '')                        
            folio_number_ocr = ocr_folio_facturacion_super_aki(base64_image, establecimiento)

            if folio_number_ocr is not None:
                return jsonify({'success': True, 'folio_number': folio_number_ocr})
            else:
                return jsonify({'success': False, 'message': 'No se pudo extraer el folio de facturación.'})
        else:
            return jsonify({'success': False, 'message': 'Establecimiento no válido.'})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/facturar_super-aki', methods=['POST'])
def obtener_folio_selenium_endpoint():
    try:
        data = request.get_json()

        # Obtener los datos necesarios desde la solicitud
        RFC_Field = data.get('RFC_Field', '')
        folioField = data.get('folioField', '')
        uso_CFID = data.get('uso_CFID', '')
        opcion_regimen_elegida = data.get('opcion_regimen_elegida', '')

        # Obtener el folio utilizando Selenium
        url_pdf_selenium = facturar_super_aki_selenium(RFC_Field, folioField, uso_CFID, opcion_regimen_elegida)

        return jsonify({'success': True, 'pdf_factura': url_pdf_selenium})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4545)
