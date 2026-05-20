# Tales Colores  
### Juego de lógica basado en patrones usando p5.js y p5.quadrille

## Descripción del proyecto

**Tales Colores** es un videojuego de lógica desarrollado con **JavaScript**, **p5.js** y **p5.quadrille**, donde el jugador debe mover fichas de colores dentro de un tablero para formar patrones específicos y eliminar bloques estratégicamente.

El juego se basa en mecánicas de resolución de puzzles, donde cada movimiento debe planearse cuidadosamente debido a la cantidad limitada de intentos disponibles en cada nivel. A medida que el jugador avanza, el tamaño del tablero, los obstáculos y la complejidad de los patrones aumentan progresivamente.

El desarrollo del proyecto se realizó priorizando primero la **lógica funcional del juego** y posteriormente realizando ajustes en la parte **visual y estética**, permitiendo una estructura de trabajo más organizada y mantenible.

---

#  Objetivos del proyecto

Los objetivos fueron refinados progresivamente durante el desarrollo de los talleres del curso.

### Objetivo general

Diseñar e implementar un videojuego de lógica interactivo basado en cuadrículas utilizando **p5.js** y **p5.quadrille**, aplicando estructuras de datos, detección de patrones y control de estados del juego.

### Objetivos específicos

- Implementar un sistema de movimiento de piezas dentro de un tablero bidimensional.
- Aplicar mecánicas de detección de patrones geométricos.
- Integrar una arquitectura modular separando lógica, estilos y datos.
- Implementar niveles progresivos mediante un archivo JSON externo.
- Aplicar principios básicos de experiencia visual e interacción con el usuario.
- Comprender y aplicar las funcionalidades de la librería **Quadrille** para manipulación de cuadrículas.
- Implementar un sistema de historial para deshacer movimientos.
- Diseñar una experiencia de juego escalable para futuras expansiones.

---

#  Mecánica del juego

El jugador debe mover piezas de colores en cuatro direcciones:

- ⬆️ Arriba
- ⬇️ Abajo
- ⬅️ Izquierda
- ➡️ Derecha

El objetivo consiste en formar patrones específicos de bloques para eliminarlos del tablero.

Cuando un patrón válido es detectado:

- La figura desaparece.
- El jugador obtiene un intento adicional.
- Se evalúa si el nivel fue completado.

El nivel finaliza cuando todas las piezas han sido eliminadas.

---

#  Decisiones de diseño

Durante el desarrollo del juego se tomaron diferentes decisiones de diseño tanto técnicas como jugables.

## 1. Desarrollo primero de la lógica

Se decidió construir inicialmente toda la parte funcional del sistema antes de trabajar la estética visual.

Primero se implementó:

- Movimiento de fichas.
- Restricciones del tablero.
- Colisiones.
- Patrones ganadores.
- Historial de movimientos.
- Carga dinámica de niveles.
- Sistema de intentos.
- Progresión entre niveles.

Posteriormente se realizaron mejoras visuales y de interfaz.

Esta decisión permitió detectar errores tempranos y mantener una estructura más clara del proyecto.

---

## 2. Estrategias de juego implementadas

Se implementaron varias estrategias de diseño orientadas a la resolución de puzzles:

### Restricción de movimientos

Cada nivel tiene una cantidad limitada de intentos, obligando al jugador a pensar estratégicamente antes de mover una pieza.

```js
attempts = 5;
```

---

### Recompensa por patrones exitosos

Cuando el jugador forma correctamente un patrón, recibe un intento adicional.

Esto genera una mecánica de recompensa y mejora la experiencia de juego.

---

### Sistema de deshacer movimiento

Se implementó un sistema de historial (`timeline`) que permite revertir acciones.

Esto reduce la frustración del jugador y fomenta la experimentación.

---

### Progresión de dificultad

La dificultad aumenta mediante:

- Tableros más grandes.
- Mayor cantidad de colores.
- Inclusión de obstáculos.
- Mayor complejidad espacial.

---

### Obstáculos inmóviles

Los bloques fijos (`G`) limitan los movimientos posibles y obligan al jugador a replantear estrategias.

---

### Patrones rotables y reflejables

Se decidió permitir que los patrones de victoria puedan reconocerse incluso si están:

- Rotados
- Reflejados
- Transpuestos

Esto aumenta la flexibilidad del sistema y evita una experiencia demasiado rígida.

---

# 🧩 Uso de p5.quadrille

La librería **p5.quadrille** fue fundamental para representar y manipular el tablero del juego.

Su uso permitió simplificar la implementación de estructuras matriciales y operaciones espaciales complejas.

## Funcionalidades utilizadas

### `createQuadrille()`

Se utilizó para:

- Crear tableros.
- Construir piezas de colores.
- Definir obstáculos.
- Generar patrones ganadores.

Ejemplo:

```js
game = createQuadrille(rows, level.boardPattern);
```

Se eligió porque permite trabajar fácilmente con cuadrículas sin implementar matrices manualmente.

---

### `read(row, col)`

Permite consultar el contenido de una celda.

Fue utilizada para:

- Detectar colisiones.
- Verificar espacios vacíos.
- Identificar obstáculos.

Ejemplo:

js
game.read(row, col)

### `fill(row, col, value)`

Usada para modificar el contenido de una celda.

Fue esencial para mover fichas dentro del tablero.

Ejemplo:

```js
colors[i].fill(row - 1, col, colors[i].read(row, col));
```

---

### `search(pattern)`

Se utilizó para verificar si un patrón ganador existe dentro de una cuadrícula.

Ejemplo:

```js
colors[i].search(p, false)
```

Esta función permitió evitar algoritmos complejos de comparación manual.

---

### `clone()`

Usada para guardar estados previos del tablero.

Permitió implementar el sistema de **undo**.

Ejemplo:

```js
c.clone()
```

---

### `clear()`

Se utilizó para eliminar piezas del tablero una vez se detecta un patrón ganador.

Ejemplo:

```js
colors[i].clear()
```

---

### Transformaciones geométricas

Se utilizaron:

#### `rotate()`

```js
t_patron.clone().rotate(180)
```

#### `reflect()`

```js
l_patron.clone().reflect()
```

#### `transpose()`

```js
horizontal_patron.clone().transpose()
```

Estas funciones fueron elegidas para evitar duplicar manualmente múltiples versiones de los patrones.

---

### `Quadrille.or()`

Permitió fusionar el tablero con las piezas de color para validar colisiones.

```js
global_game = Quadrille.or(global_game, colors[i]);
```

---

# Diseño visual

Una vez finalizada la lógica principal, se realizaron ajustes visuales al juego.

Se implementaron:

- Fondo dinámico con video.
- Glassmorphism.
- Transparencias.
- Glow neon en bloques.
- Sombras y profundidad visual.
- Bordes redondeados.
- Centrado dinámico del tablero.
- Interfaz minimalista.

El objetivo fue mejorar la experiencia visual sin afectar la lógica principal.

---

#  Arquitectura del proyecto

El sistema fue dividido en módulos independientes.

Proyecto/
│── index.html
│── sketch.js
│── levels.json
│── styles.css


### Responsabilidad de cada archivo

### `sketch.js`

Contiene:

- Lógica principal.
- Movimiento.
- Patrones.
- Renderizado.
- Estados del juego.

### `levels.json`

Define:

- Tamaño del tablero.
- Posición de piezas.
- Obstáculos.
- Movimientos ideales.

### `styles.css`

Controla:

- Diseño visual.
- Posicionamiento.
- Fondo dinámico.
- Estética del canvas.

---

# 📈 Resultados obtenidos

Durante el desarrollo se logró implementar exitosamente:

✅ Sistema completo de movimiento.

✅ Restricciones espaciales.

✅ Detección automática de patrones.

✅ Sistema de recompensas.

✅ Niveles progresivos.

✅ Sistema de historial para deshacer movimientos.

✅ Carga dinámica de niveles mediante JSON.

✅ Integración correcta entre p5.js y Quadrille.

✅ Interfaz visual funcional y estética.

El proyecto logró cumplir los objetivos inicialmente planteados durante el curso.

---

#  Trabajos futuros

El proyecto puede expandirse significativamente.

## 1. Generación de niveles diarios

Se planteó implementar un sistema de niveles aleatorios basados en la fecha actual.

La idea consiste en:

- Obtener la fecha del sistema.
- Generar automáticamente configuraciones únicas.
- Hacer que cada día el juego tenga tableros distintos.

Por ejemplo:

- Todos los jugadores tendrían el mismo reto del día.
- El tablero cambiaría automáticamente cada 24 horas.

Esto aumentaría considerablemente la rejugabilidad.

---

## 2. Más mecánicas

- Nuevos tipos de obstáculos.
- Bloques especiales.
- Dificultades dinámicas.

---

## 3. Sistema competitivo

- Ranking.
- Tiempo récord.
- Estadísticas.
- Puntajes.

---

## 4. Compatibilidad móvil

Adaptación de controles táctiles para celulares.

---

## 5. Mejoras audiovisuales

- Sonidos.
- Música ambiental.
- Animaciones de transición.
- Efectos de partículas.

---

#  Uso de Inteligencia Artificial

La IA fue utilizada como herramienta de apoyo durante el desarrollo.

Se empleó para:

### Corrección de errores

- Interpretación de errores de consola.
- Explicación de errores en terminal.
- Depuración de bugs.

### Apoyo visual

- Ajustes estéticos.
- Guía de estilo visual.
- Recomendaciones de interfaz.

### Flujo de trabajo

- Organización del código.
- Comprensión de estructuras complejas.
- Apoyo en toma de decisiones técnicas.

La implementación, comprensión y adaptación del código fue realizada por el equipo de desarrollo.

La reutilización de código solo fue considerada cuando se entendió completamente su funcionamiento y fue adaptada a las necesidades del proyecto.

---

# 📚 Referencias y APIs utilizadas

## JavaScript

- Fetch API
- Arrays (`map`, `every`, `push`)
- `setTimeout()`
- Eventos de teclado
- Objetos y clases (`class Button`)
- Manipulación de fechas (`Date()`)

### Documentación oficial

- https://developer.mozilla.org/

---

## p5.js

Funciones utilizadas:

- `setup()`
- `draw()`
- `createCanvas()`
- `fill()`
- `stroke()`
- `rect()`
- `text()`
- `textAlign()`
- `textSize()`
- `clear()`
- `color()`

Documentación:

- https://p5js.org/reference/
https://gbgs.gitlab.io/
---

## p5.quadrille

Funciones utilizadas:

- `createQuadrille()`
- `read()`
- `fill()`
- `search()`
- `clone()`
- `clear()`
- `rotate()`
- `reflect()`
- `transpose()`
- `Quadrille.or()`

Documentación:

- https://github.com/crisvo2024/p5.quadrille

---

# ⚠️ Consideraciones académicas

Todas las fuentes externas utilizadas fueron reconocidas tanto en el informe como en los comentarios del código.

La reutilización de código únicamente fue realizada cuando este fue comprendido, adaptado y ajustado a las necesidades del proyecto.

Los materiales del curso obtenidos desde GitLab fueron utilizados exclusivamente con fines académicos, respetando las restricciones de uso establecidas.

---

# Conclusiones

El desarrollo de **Tales Colores** permitió aplicar conocimientos fundamentales relacionados con:

La librería **p5.quadrille** fue clave para reducir la complejidad de implementación del tablero y facilitar el manejo de patrones espaciales.

Asimismo, el enfoque de construir primero la lógica y después la parte visual permitió un proceso de desarrollo más estable, organizado y escalable.

Finalmente, el proyecto deja abierta la posibilidad de evolucionar hacia un sistema de retos diarios y niveles generados proceduralmente, aumentando su potencial de rejugabilidad y expansión futura.

---

Proyecto desarrollado con fines académicos como parte del proceso de aprendizaje del curso.
