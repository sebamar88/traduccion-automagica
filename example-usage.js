const translate = require('translate')

// Ejemplo de uso programático de las funciones de traducción

// Configurar LibreTranslate
translate.engine = 'libre'
translate.url = 'http://localhost:5000/translate'

// Función para traducir múltiples textos desde español
async function traducirLote(textos) {
  console.log('🚀 Iniciando traducción en lote...\n')
  
  const resultados = []
  
  for (const [key, textoEspanol] of Object.entries(textos)) {
    console.log(`📝 Traduciendo "${key}": "${textoEspanol}"`)
    
    try {
      const traducciones = {
        es: textoEspanol,
        en: await translate(textoEspanol, { from: 'es', to: 'en' }),
        pt: await translate(textoEspanol, { from: 'es', to: 'pt' }),
        nl: await translate(textoEspanol, { from: 'es', to: 'nl' })
      }
      
      console.log(`   🇺🇸 EN: ${traducciones.en}`)
      console.log(`   🇧🇷 PT: ${traducciones.pt}`)
      console.log(`   🇳🇱 NL: ${traducciones.nl}`)
      console.log('')
      
      resultados.push({ key, traducciones })
      
    } catch (error) {
      console.error(`❌ Error traduciendo "${key}": ${error.message}`)
    }
  }
  
  return resultados
}

// Función para actualizar archivos JSON con traducciones
function actualizarArchivosTraduccion(traducciones, carpetaTraducciones = '../src/translations') {
  const fs = require('fs')
  const path = require('path')
  
  const idiomas = ['en', 'es', 'pt', 'nl']
  
  for (const idioma of idiomas) {
    const archivo = path.join(carpetaTraducciones, `${idioma}.json`)
    
    try {
      // Leer archivo existente o crear uno nuevo
      let contenido = {}
      if (fs.existsSync(archivo)) {
        contenido = JSON.parse(fs.readFileSync(archivo, 'utf8'))
      }
      
      // Agregar nuevas traducciones
      for (const { key, traducciones: t } of traducciones) {
        contenido[key] = t[idioma]
      }
      
      // Ordenar claves alfabéticamente
      const contenidoOrdenado = Object.keys(contenido)
        .sort()
        .reduce((obj, key) => {
          obj[key] = contenido[key]
          return obj
        }, {})
      
      // Escribir archivo
      fs.writeFileSync(archivo, JSON.stringify(contenidoOrdenado, null, 2))
      console.log(`✅ Actualizado: ${archivo}`)
      
    } catch (error) {
      console.error(`❌ Error actualizando ${archivo}: ${error.message}`)
    }
  }
}

// Ejemplo de uso
async function ejemplo() {
  // Verificar si LibreTranslate está disponible
  try {
    const fetch = require('node-fetch')
    const response = await fetch('http://localhost:5000/health')
    if (!response.ok) {
      throw new Error('LibreTranslate no está disponible')
    }
  } catch (error) {
    console.error('❌ LibreTranslate no está ejecutándose.')
    console.log('💡 Inicia LibreTranslate primero:')
    console.log('   docker run -ti --rm -p 5000:5000 libretranslate/libretranslate')
    console.log('   o')
    console.log('   docker-compose up -d')
    return
  }
  
  // Textos de ejemplo para traducir
  const textosEjemplo = {
    'welcome_message': 'Bienvenido a nuestra aplicación',
    'login_button': 'Iniciar sesión',
    'logout_button': 'Cerrar sesión',
    'settings_title': 'Configuración',
    'save_button': 'Guardar cambios',
    'cancel_button': 'Cancelar',
    'success_message': 'Operación completada exitosamente',
    'error_message': 'Ha ocurrido un error inesperado',
    'loading_text': 'Cargando, por favor espera...',
    'search_placeholder': 'Buscar en la aplicación'
  }
  
  console.log('🤖 Ejemplo de Traducción Automática\n')
  console.log('📋 Textos a traducir:', Object.keys(textosEjemplo).length)
  console.log('')
  
  // Traducir todo el lote
  const resultados = await traducirLote(textosEjemplo)
  
  console.log(`✅ Completado: ${resultados.length} traducciones exitosas`)
  
  // Mostrar resumen
  console.log('\n📊 Resumen de Traducciones:')
  console.log('================================')
  
  for (const { key, traducciones } of resultados) {
    console.log(`\n🔑 ${key}:`)
    console.log(`   🇪🇸 ${traducciones.es}`)
    console.log(`   🇺🇸 ${traducciones.en}`)
    console.log(`   🇧🇷 ${traducciones.pt}`)
    console.log(`   🇳🇱 ${traducciones.nl}`)
  }
  
  // Nota: Descomenta la siguiente línea para actualizar archivos reales
  // actualizarArchivosTraduccion(resultados)
  
  console.log('\n🎉 ¡Ejemplo completado!')
  console.log('💡 Para usar en tu proyecto, descomenta la línea actualizarArchivosTraduccion()')
}

// Ejecutar ejemplo si el archivo es llamado directamente
if (require.main === module) {
  ejemplo().catch(console.error)
}

module.exports = {
  traducirLote,
  actualizarArchivosTraduccion
}
