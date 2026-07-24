# To-Do Ionic App (Technical Test)

## 🚀 Instalación y Ejecución

1. **Clonar e instalar dependencias:**
   ```bash
   git clone <tu-repo>
   cd todo-ionic-app
   npm install
   ```

2. **Ejecutar en el navegador:**
   ```bash
   ionic serve
   ```

## ⚙️ Guía de Prueba: Feature Flag (Firebase Remote Config)

La aplicación utiliza **Firebase Remote Config** para controlar dinámicamente la visibilidad de los filtros de categorías.
1. Ingresa a la consola de Firebase del proyecto.
2. Ve a **Remote Config** (bajo Release & Monitor).
3. Busca el parámetro `enable_category_filter` (Boolean).
4. Cambia su valor a `false` y **publica los cambios**.
5. Ve a la aplicación y recarga (o espera unos segundos según el intervalo de fetch). La barra de categorías desaparecerá instantáneamente sin necesidad de recompilar o redesplegar la aplicación, gracias a la implementación reactiva con Angular Signals.

## Compilación Nativa (Android & iOS)

Dado que este proyecto utiliza la arquitectura moderna de compilación de Angular 17+ (Application Builder) y la integración nativa a través de **Cordova** tradicional en lugar de Capacitor, la forma correcta de sincronizar y compilar es utilizando el CLI de Cordova directamente tras compilar los assets web:

**1. Compilar el código web de Angular para producción:**
```bash
ionic build --configuration production
```
Esto generará los assets optimizados en la carpeta `/www`.

**2. Preparar la plataforma nativa (Copiar assets a Cordova):**
```bash
# Para Android
npx cordova prepare android

# Para iOS
npx cordova prepare ios
```

**3. Generación del binario en Android (.apk):**
```bash
# Compilar el APK de debug directamente por terminal:
npx cordova build android --debug
```
*Alternativa con UI (Recomendado):* Abre la carpeta `platforms/android` en Android Studio y ejecuta `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

**4. Generación del binario en iOS (.ipa):**
```bash
# Instalar los Pods en la carpeta de iOS
cd platforms/ios
pod install
cd ../..

# Abrir el Workspace de Xcode
open platforms/ios/App.xcworkspace
```
*En Xcode:*
1. Ve a la pestaña **Signing & Capabilities** del proyecto.
2. Selecciona tu cuenta de Apple ID personal en **Team**.
3. Selecciona **"Any iOS Device (arm64)"** en la barra superior.
4. Ve al menú **Product > Archive**.
5. Tras completarse, exporta el archivo `.ipa` usando el botón **Distribute App**.

---

## 🧠 Respuestas Teóricas (Nivel Senior)

### 1. ¿Cuáles fueron los principales desafíos que enfrentaste?
El desafío principal consistió en arquitectar una solución que fuera escalable y moderna mientras se integraban múltiples APIs (Ionic Storage, Firebase, Angular CDK). Un punto clave fue migrar la lógica reactiva desde un enfoque tradicional (RxJS con `BehaviorSubject`) hacia el nuevo estándar de Angular Signals. Lograr que Firebase Remote Config actualizara un Signal en tiempo real y que el motor de renderizado virtual (`cdk-virtual-scroll-viewport`) respondiera a esos cambios mediante `computed` signals requirió un entendimiento profundo del ciclo de vida de Angular y la estrategia `OnPush`.

### 2. ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?
Para garantizar que la app funcione fluidamente a 60FPS en dispositivos móviles, implementé:
- **ChangeDetectionStrategy.OnPush:** Evita comprobaciones innecesarias del DOM. El componente solo se re-renderiza cuando un Signal cambia o hay un input explícito.
- **Signals y Control Flow de Angular 17+:** Uso de `@for` y `@if`. El nuevo `@for` incluye optimización nativa por referencia (equivalente y superior a `trackBy`), actualizando únicamente el nodo modificado en lugar de toda la lista.
- **CDK Virtual Scroll:** Para listas de tareas que pueden crecer exponencialmente, el `cdk-virtual-scroll-viewport` renderiza únicamente los elementos visibles en el viewport. Esto reduce la carga de memoria (RAM) del WebView y previene el lag en el scroll.

### 3. ¿Cómo aseguraste la calidad y mantenibilidad del código?
Aseguré la mantenibilidad aplicando principios SOLID y una arquitectura basada en dominio. 
- **Desacoplamiento:** La UI (`pages/home`) no tiene lógica de persistencia. Toda responsabilidad de datos recae sobre servicios Singleton (`task.service.ts`, `category.service.ts`).
- **Inyección de dependencias moderna:** Utilizando la función `inject()` de Angular, reduciendo el boilerplate en los constructores.
- **Estética y UI/UX:** Implementé variables CSS, SCSS modular y una estética *Glassmorphism* que transmite calidad premium desde el primer impacto visual.
- **Control de Versiones Semántico:** Uso estricto de la convención de *Conventional Commits* en la rama `feature/todo-categories-remoteconfig`.
