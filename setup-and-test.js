const translate = require("translate");
const inquirer = require("inquirer");

// Configuración de LibreTranslate
const LIBRE_TRANSLATE_URL = "https://lt.vern.cc/translate";

// Función para verificar si LibreTranslate está ejecutándose
const checkLibreTranslateHealth = async () => {
    try {
        const fetch = require("node-fetch");
        const response = await fetch("https://lt.vern.cc/");
        return response.ok;
    } catch (error) {
        return false;
    }
};

// Función para instalar node-fetch si no está disponible
const ensureNodeFetch = async () => {
    try {
        require("node-fetch");
        return true;
    } catch (error) {
        console.log("📦 Instalando node-fetch...");
        const { exec } = require("child_process");
        return new Promise((resolve) => {
            exec("npm install node-fetch@2", (error) => {
                if (error) {
                    console.error(
                        "❌ Error instalando node-fetch:",
                        error.message
                    );
                    resolve(false);
                } else {
                    console.log("✅ node-fetch instalado correctamente");
                    resolve(true);
                }
            });
        });
    }
};

// Función para probar traducciones
const testTranslations = async () => {
    console.log("🧪 Probando traducciones...");

    const testText = "Hola mundo";

    try {
        translate.engine = "libre";
        translate.url = LIBRE_TRANSLATE_URL;

        console.log(`📝 Texto original: "${testText}"`);

        const enResult = await translate(testText, { from: "es", to: "en" });
        console.log(`🇺🇸 EN: "${enResult}"`);

        const ptResult = await translate(testText, { from: "es", to: "pt" });
        console.log(`🇧🇷 PT: "${ptResult}"`);

        const nlResult = await translate(testText, { from: "es", to: "nl" });
        console.log(`🇳🇱 NL: "${nlResult}"`);

        console.log("✅ ¡Todas las traducciones funcionaron correctamente!");
        return true;
    } catch (error) {
        console.error("❌ Error en las traducciones:", error.message);
        return false;
    }
};

// Función principal de configuración
const setupAndTest = async () => {
    console.log("🚀 Configurando y probando el sistema de traducción...\n");

    // Verificar node-fetch
    const hasFetch = await ensureNodeFetch();
    if (!hasFetch) {
        console.error(
            "❌ No se pudo instalar node-fetch. Instálalo manualmente: npm install node-fetch@2"
        );
        return;
    }

    // Verificar si LibreTranslate está ejecutándose
    console.log("🔍 Verificando si LibreTranslate está ejecutándose...");
    const isRunning = await checkLibreTranslateHealth();

    if (!isRunning) {
        console.log("❌ LibreTranslate no está ejecutándose.");
        console.log(
            "\n📋 Para iniciar LibreTranslate, ejecuta uno de estos comandos:"
        );
        console.log(
            "   Docker: docker run -ti --rm -p 5000:5000 libretranslate/libretranslate"
        );
        console.log("   Docker Compose: docker-compose up -d");
        console.log(
            "\n⏳ Una vez que LibreTranslate esté ejecutándose, vuelve a ejecutar este script."
        );
        return;
    }

    console.log("✅ LibreTranslate está ejecutándose correctamente!");

    // Probar traducciones
    const testResult = await testTranslations();

    if (testResult) {
        console.log("\n🎉 ¡Configuración completada exitosamente!");
        console.log(
            "📝 Ahora puedes habilitar la traducción automática en tu script:"
        );
        console.log("   1. Abre translation-script-improved.js");
        console.log("   2. Cambia LIBRE_TRANSLATE_CONFIG.enabled = true");
        console.log("   3. ¡Listo para usar!");
    } else {
        console.log("\n❌ Hubo problemas con las traducciones.");
        console.log(
            "🔧 Verifica que LibreTranslate esté funcionando correctamente."
        );
    }
};

// Función para configurar automáticamente el script
const autoConfigureScript = async () => {
    const prompt = inquirer.createPromptModule();

    const answers = await prompt([
        {
            type: "confirm",
            name: "enableAutoTranslation",
            message: "¿Habilitar traducción automática en el script principal?",
            default: true,
        },
    ]);

    if (answers.enableAutoTranslation) {
        const fs = require("fs");
        const scriptPath = "./scripts/translation-script-improved.js";

        try {
            let scriptContent = fs.readFileSync(scriptPath, "utf8");
            scriptContent = scriptContent.replace(
                "enabled: false, // Cambia a true cuando tengas LibreTranslate configurado",
                "enabled: true, // Habilitado automáticamente"
            );
            fs.writeFileSync(scriptPath, scriptContent);
            console.log(
                "✅ Script principal configurado para usar traducción automática!"
            );
        } catch (error) {
            console.error("❌ Error configurando el script:", error.message);
        }
    }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
    setupAndTest()
        .then(async () => {
            await autoConfigureScript();
        })
        .catch(console.error);
}

module.exports = {
    checkLibreTranslateHealth,
    testTranslations,
    setupAndTest,
};
