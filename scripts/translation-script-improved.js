const inquirer = require('inquirer')
const translate = require('translate')

const TRANSLATION_FOLDER = `${__dirname}/../src/translations`

const LANGUAGES = { EN: 'en', ES: 'es', PT: 'pt', NL: 'nl' }

const SUPPORTED_LANGUAGES = [LANGUAGES.EN, LANGUAGES.ES, LANGUAGES.PT, LANGUAGES.NL]

const LANGUAGE_DESCRIPTION = {
  [LANGUAGES.EN]: 'English',
  [LANGUAGES.ES]: 'Spanish',
  [LANGUAGES.PT]: 'Portuguese',
  [LANGUAGES.NL]: 'Dutch',
}

// Configuración de LibreTranslate
const LIBRE_TRANSLATE_CONFIG = {
  enabled: true, // Habilitado automáticamente
  url: 'http://localhost:5000/translate', // URL de tu servidor LibreTranslate
}

// Configurar el motor de traducción
if (LIBRE_TRANSLATE_CONFIG.enabled) {
  translate.engine = 'libre'
  translate.url = LIBRE_TRANSLATE_CONFIG.url
} else {
  // Fallback a traducción manual si LibreTranslate no está disponible
  console.warn('⚠️  LibreTranslate no está habilitado. Usando modo manual.')
}

const [, , operationFromArgs, ...paramsFromArgs] = process.argv

const verifyTranslations = files => {
  if (!Array.isArray(files) || files.length === 0) {
    return []
  }
  // Parse the JSON files and extract their keys
  const parsedFiles = files.map(file => {
    try {
      return require(file)
    } catch (error) {
      console.error(`Error parsing JSON file: ${error}`)
      return null
    }
  })
  // Track keys for each file
  const fileKeys = parsedFiles.map(file => new Set(Object.keys(file)))
  // Get all unique keys across files
  const allKeys = Array.from(new Set(parsedFiles.flatMap(Object.keys)))
  // Filter keys that are not present in all files
  const differentKeys = allKeys.filter(key => {
    return fileKeys.some(keys => !keys.has(key))
  })
  return differentKeys
}

const deleteKeyInJSON = (fileName, key) => {
  const fs = require('fs')
  const file = require(fileName)
  delete file[key]
  fs.writeFileSync(fileName, JSON.stringify(file, null, 2))
}

const updateKeyInJSON = (fileName, key, value) => {
  const fs = require('fs')
  const file = require(fileName)
  file[key] = value
  const sortedJson = Object.keys(file)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: file[key] }), {})
  fs.writeFileSync(fileName, JSON.stringify(sortedJson, null, 2))
}

const readKeyInJSON = (fileName, key) => {
  const file = require(fileName)
  return file[key]
}

const getMessageForInputKey = (lng, key) => {
  const output = [`${LANGUAGE_DESCRIPTION[lng]} translation?`]
  const fileName = `${TRANSLATION_FOLDER}/${lng}.json`
  const existingLabel = readKeyInJSON(fileName, key)
  if (existingLabel) {
    output.push(`(${existingLabel})`)
  }
  return output.join(' ')
}

// Función para traducir automáticamente usando IA
const autoTranslateFromSpanish = async (spanishText) => {
  if (!LIBRE_TRANSLATE_CONFIG.enabled) {
    console.log('⚠️  Traducción automática no disponible. LibreTranslate no está configurado.')
    return null
  }

  try {
    console.log('🤖 Traduciendo automáticamente...')
    
    const translations = {}
    
    // Traducir a inglés
    console.log('   📝 Traduciendo a inglés...')
    translations.en = await translate(spanishText, { from: 'es', to: 'en' })
    
    // Traducir a portugués  
    console.log('   📝 Traduciendo a portugués...')
    translations.pt = await translate(spanishText, { from: 'es', to: 'pt' })
    
    // Traducir a holandés
    console.log('   📝 Traduciendo a holandés...')
    translations.nl = await translate(spanishText, { from: 'es', to: 'nl' })
    
    console.log('✅ Traducción automática completada!')
    return translations
    
  } catch (error) {
    console.error('❌ Error en traducción automática:', error.message)
    console.log('🔄 Fallback a modo manual.')
    return null
  }
}

// Función para confirmar/editar traducciones automáticas
const confirmTranslations = async (key, spanishText, autoTranslations) => {
  const prompt = inquirer.createPromptModule()
  
  console.log('\n📋 Traducciones generadas automáticamente:')
  console.log(`🇪🇸 ES: ${spanishText}`)
  if (autoTranslations) {
    console.log(`🇺🇸 EN: ${autoTranslations.en}`)
    console.log(`🇧🇷 PT: ${autoTranslations.pt}`)
    console.log(`🇳🇱 NL: ${autoTranslations.nl}`)
  }
  
  const answers = await prompt([
    {
      type: 'confirm',
      name: 'useAutoTranslations',
      message: '¿Usar estas traducciones automáticas?',
      default: true,
      when: () => autoTranslations !== null,
    },
    {
      type: 'input',
      name: 'en',
      message: ({ key }) => getMessageForInputKey(LANGUAGES.EN, key),
      default: autoTranslations?.en || '',
      when: answers => !answers.useAutoTranslations || autoTranslations === null,
    },
    {
      type: 'input',
      name: 'pt',
      message: ({ key }) => getMessageForInputKey(LANGUAGES.PT, key),
      default: autoTranslations?.pt || '',
      when: answers => !answers.useAutoTranslations || autoTranslations === null,
    },
    {
      type: 'input',
      name: 'nl',
      message: ({ key }) => getMessageForInputKey(LANGUAGES.NL, key),
      default: autoTranslations?.nl || '',
      when: answers => !answers.useAutoTranslations || autoTranslations === null,
    },
  ])
  
  if (answers.useAutoTranslations && autoTranslations) {
    return {
      es: spanishText,
      en: autoTranslations.en,
      pt: autoTranslations.pt,
      nl: autoTranslations.nl,
    }
  } else {
    return {
      es: spanishText,
      en: answers.en,
      pt: answers.pt,
      nl: answers.nl,
    }
  }
}

if (operationFromArgs) {
  // verify the parameters
  if (operationFromArgs === 'create or update' && paramsFromArgs.length < 2) {
    console.error('La cantidad de parámetros es incorrecta.')
    console.error('Con IA: yarn translation "create or update" keyName textInSpanish')
    console.error('Manual: yarn translation "create or update" keyName english spanish portuguese dutch')
  }
  if (operationFromArgs === 'read' && paramsFromArgs.length !== 1) {
    console.error('La cantidad de parámetros es incorrecta.')
    console.error('yarn translation "read" keyName')
  }
  if (operationFromArgs === 'remove' && paramsFromArgs.length !== 1) {
    console.error('La cantidad de parámetros es incorrecta.')
    console.error('yarn translation "remove" keyName')
  }
  if (operationFromArgs === 'verify' && paramsFromArgs.length !== 0) {
    console.error('La cantidad de parámetros es incorrecta.')
    console.error('yarn translation "verify"')
  }
}

const prompt = inquirer.createPromptModule()

prompt([
  {
    type: 'list',
    name: 'operation',
    message: '¿Qué operación quieres realizar?',
    choices: ['Create or Update', 'Read', 'Remove', 'Verify'],
    default: 'Verify',
    filter(val) {
      return val.toLowerCase()
    },
    when: () => !operationFromArgs,
  },
  {
    type: 'input',
    name: 'key',
    message: '¿Cuál es la clave?',
    when: answers => ['create or update', 'read', 'remove'].includes(answers.operation),
  },
  // Para CREATE & UPDATE - Primero pedir el texto en español
  {
    type: 'input',
    name: 'es',
    message: '🇪🇸 Texto en español:',
    when: answers => ['create or update', 'create'].includes(answers.operation),
  },
])
  .then(async answers => {
    const operation = answers.operation || operationFromArgs

    if (['create or update', 'read', 'remove'].includes(operation)) {
      const key = answers.key || paramsFromArgs[0]
      
      if (operation === 'create or update') {
        const spanishText = answers.es || paramsFromArgs[1]
        
        if (!spanishText) {
          console.error('❌ Debes proporcionar el texto en español')
          return
        }
        
        // Intentar traducción automática
        const autoTranslations = await autoTranslateFromSpanish(spanishText)
        
        // Confirmar/editar traducciones
        const finalTranslations = await confirmTranslations(key, spanishText, autoTranslations)
        
        // Guardar todas las traducciones
        SUPPORTED_LANGUAGES.forEach(lng => {
          const fileName = `${TRANSLATION_FOLDER}/${lng}.json`
          const newLabel = finalTranslations[lng]
          updateKeyInJSON(fileName, key, newLabel)
        })
        
        console.log(`✅ Traducciones guardadas exitosamente para la clave "${key}"`)
        
      } else {
        // Operaciones read y remove (sin cambios)
        SUPPORTED_LANGUAGES.map(lng => {
          const fileName = `${TRANSLATION_FOLDER}/${lng}.json`
          const label = readKeyInJSON(fileName, key)
          if (operation === 'read') {
            console.info(`${lng}: ${label}`)
          } else if (operation === 'remove') {
            if (!label) {
              console.error(`La clave "${key}" no fue encontrada para el idioma "${lng}"`)
            } else {
              deleteKeyInJSON(fileName, key)
              console.warn(`La clave "${key}" fue eliminada exitosamente para "${lng}"`)
            }
          }
        })
      }
    }

    if (operation === 'verify') {
      const output = verifyTranslations(
        new Array(...SUPPORTED_LANGUAGES.map(language => `${TRANSLATION_FOLDER}/${language}.json`)),
      )
      if (output.length) {
        console.error(`Las siguientes claves no están presentes en todos los idiomas: ${output.join(', ')}`)
        if (process.env.CI) {
          // if the process is executed during CI, throw an error.
          process.exit(1)
        }
      } else {
        console.log('¡Todos los archivos de traducciones están alineados!')
      }
    }
  })
  .catch(error => {
    if (error.isTtyError) {
      console.error("No se pudo renderizar el prompt en el entorno actual")
    } else {
      console.log('Algo salió mal', error)
    }
  })
