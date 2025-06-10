#!/usr/bin/env node

// Ejemplo de uso de los diferentes modos del script de traducciones mejorado

const { exec } = require('child_process')
const util = require('util')
const execAsync = util.promisify(exec)

console.log('🚀 Demostrando los diferentes modos del script de traducciones mejorado\n')

const examples = [
  {
    title: '🤖 Modo Automático (Línea de comandos)',
    description: 'Solo proporciona español, IA traduce automáticamente',
    command: 'node translation-script-improved.js "create or update" "ejemplo_auto" "Hola mundo desde IA"',
  },
  {
    title: '✋ Modo Manual (Línea de comandos)',
    description: 'Proporciona todas las traducciones manualmente',
    command: 'node translation-script-improved.js "create or update" "ejemplo_manual" "Hello manual world" "Hola mundo manual" "Olá mundo manual" "Hallo handmatige wereld"',
  },
  {
    title: '📖 Leer traducciones',
    description: 'Ver todas las traducciones de una clave',
    command: 'node translation-script-improved.js "read" "ejemplo_auto"',
  },
  {
    title: '🔍 Verificar consistencia',
    description: 'Verificar que todas las claves existan en todos los idiomas',
    command: 'node translation-script-improved.js "verify"',
  },
  {
    title: '🗑️ Eliminar traducciones',
    description: 'Eliminar una clave de todos los idiomas',
    command: 'node translation-script-improved.js "remove" "ejemplo_manual"',
  }
]

async function runExample(example) {
  console.log(`\n=== ${example.title} ===`)
  console.log(`📝 ${example.description}`)
  console.log(`💻 Comando: ${example.command}`)
  console.log('📊 Resultado:')
  console.log('─'.repeat(50))
  
  try {
    const { stdout, stderr } = await execAsync(example.command)
    if (stdout) console.log(stdout)
    if (stderr) console.log('⚠️ ', stderr)
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
  
  console.log('─'.repeat(50))
}

async function runAllExamples() {
  console.log('ℹ️  Nota: Estos ejemplos requieren que el script esté en el mismo directorio')
  console.log('ℹ️  y que tengas la carpeta src/translations/ configurada.\n')
  
  console.log('⚠️  IMPORTANTE: Para el modo automático, necesitas LibreTranslate ejecutándose:')
  console.log('   docker run -ti --rm -p 5000:5000 libretranslate/libretranslate')
  console.log('   o')
  console.log('   docker-compose up -d\n')
  
  // Verificar si LibreTranslate está disponible
  console.log('🔍 Verificando disponibilidad de LibreTranslate...')
  try {
    const fetch = require('node-fetch')
    const response = await fetch('http://localhost:5000/health', { timeout: 3000 })
    if (response.ok) {
      console.log('✅ LibreTranslate está disponible - modo automático funcionará\n')
    } else {
      console.log('❌ LibreTranslate no responde - solo modo manual disponible\n')
    }
  } catch (error) {
    console.log('❌ LibreTranslate no está ejecutándose - solo modo manual disponible\n')
  }
  
  // Preguntar al usuario si quiere continuar
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  const answer = await new Promise(resolve => {
    rl.question('¿Continuar con los ejemplos? (y/n): ', resolve)
  })
  rl.close()
  
  if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    console.log('👋 ¡Hasta luego!')
    return
  }
  
  console.log('\n🎬 Ejecutando ejemplos...\n')
  
  for (const example of examples) {
    await runExample(example)
    
    // Pausa entre ejemplos
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n🎉 ¡Ejemplos completados!')
  console.log('\n💡 Consejos:')
  console.log('   • Usa modo interactivo sin parámetros: node translation-script-improved.js')
  console.log('   • El modo automático detecta LibreTranslate automáticamente')
  console.log('   • Puedes editar las traducciones automáticas antes de guardar')
  console.log('   • En línea de comandos, 2 parámetros = automático, 5 parámetros = manual')
}

// Ejemplo de configuración de archivos de traducción
function createExampleTranslationFiles() {
  const fs = require('fs')
  const path = require('path')
  
  const translationsDir = path.join(__dirname, '..', 'src', 'translations')
  
  console.log(`📁 Creando directorio de ejemplo: ${translationsDir}`)
  
  if (!fs.existsSync(translationsDir)) {
    fs.mkdirSync(translationsDir, { recursive: true })
  }
  
  const languages = ['en', 'es', 'pt', 'nl']
  const exampleTranslations = {
    'welcome_message': {
      en: 'Welcome to our application',
      es: 'Bienvenido a nuestra aplicación',
      pt: 'Bem-vindo à nossa aplicação',
      nl: 'Welkom bij onze applicatie'
    },
    'login_button': {
      en: 'Login',
      es: 'Iniciar sesión',
      pt: 'Entrar',
      nl: 'Inloggen'
    }
  }
  
  for (const lang of languages) {
    const filePath = path.join(translationsDir, `${lang}.json`)
    const content = {}
    
    for (const [key, translations] of Object.entries(exampleTranslations)) {
      content[key] = translations[lang]
    }
    
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2))
    console.log(`✅ Creado: ${filePath}`)
  }
  
  console.log('\n🎯 Archivos de ejemplo creados. Ahora puedes probar el script.')
}

// Verificar argumentos de línea de comandos
const [,, action] = process.argv

if (action === 'setup') {
  createExampleTranslationFiles()
} else if (action === 'run') {
  runAllExamples()
} else {
  console.log('📖 Uso:')
  console.log('  node example-modes.js setup  # Crear archivos de ejemplo')
  console.log('  node example-modes.js run    # Ejecutar ejemplos')
  console.log('')
  console.log('💡 O ejecuta directamente:')
  console.log('  node translation-script-improved.js  # Modo interactivo')
}
