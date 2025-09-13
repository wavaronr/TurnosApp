# Aplicación de Calendario de Turnos

Esta es una aplicación React para gestionar los turnos de personal. Permite a los administradores asignar turnos de mañana, tarde, noche o libre a diferentes personas en un calendario semanal.

## Guía de Estilo de la Aplicación

Esta guía define los principios estéticos y de diseño para asegurar una experiencia de usuario coherente y moderna en toda la aplicación.

### 1. Filosofía de Diseño: "Glassmorphism" y Minimalismo

El diseño se basa en el **"Glassmorphism"** (efecto de vidrio esmerilado). Esta elección busca crear una interfaz limpia, moderna y con una sensación de profundidad.

*   **Capas y Transparencia:** Los elementos interactivos como modales, tarjetas (`cards`) y paneles laterales (`offcanvas`) no son opacos. Usan un fondo blanco translúcido (`rgba(255, 255, 255, 0.7)` o similar) con un filtro `backdrop-filter: blur()`. Esto permite que el fondo principal se vislumbre, creando una jerarquía visual clara.
*   **Bordes Sutiles:** Se utiliza un borde fino (`1px solid rgba(255, 255, 255, 0.25)`) en estos elementos para definir sus límites sin ser demasiado imponentes.
*   **Sombras Suaves:** Las sombras (`box-shadow`) son suaves y difusas (`rgba(0, 0, 0, 0.15)`), utilizadas para "elevar" los elementos de la interfaz, dándoles profundidad y destacando su interactividad.

### 2. Paleta de Colores

La paleta de colores es minimalista y profesional, con un color de acento fuerte para las acciones principales.

*   **Color Primario (Acento):** Azul Oscuro Intenso (`#0e007b`). Se utiliza para los botones de acción principal (Login, Guardar, Añadir), cabeceras importantes y para resaltar elementos de navegación activos. Su variante en hover es ligeramente más clara (`#0022a1`).
*   **Color Secundario (Interactivo):** Naranja Vistoso (`#FF8C00`). Reservado para acciones de alta frecuencia dentro de componentes, como el botón `+` para añadir personas a un turno. Su objetivo es atraer la atención sin competir con el azul primario.
*   **Colores Neutros:**
    *   **Texto Principal:** Grises oscuros (`#333`, `#555`) para garantizar la legibilidad.
    *   **Fondos de Componente:** Fondos blancos (`#fff`) o grises muy claros (`#f9f9f9`, `#e9ecef`) para las áreas de contenido, proporcionando un alto contraste.
    *   **Fondos de Página:** El fondo general de la aplicación es transparente, lo que permite que un posible fondo degradado o imagen de fondo (aún no implementado) se muestre a través de los elementos de "Glassmorphism".

### 3. Tipografía

*   **Fuente Principal:** Se prioriza la familia de fuentes `sans-serif` nativa del sistema operativo del usuario (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, etc.). Esto asegura un rendimiento óptimo y una sensación familiar para el usuario.
*   **Jerarquía:** La jerarquía visual se establece mediante el grosor (`font-weight`), el tamaño (`font-size`) y el color del texto, no mediante diferentes familias de fuentes.

### 4. Componentes y Patrones

*   **Bordes Redondeados:** Se aplica un `border-radius` consistente (entre `5px` y `15px`) a tarjetas, botones, modales y campos de entrada para una apariencia suave y moderna.
*   **Botones:**
    *   **Principales:** Fondo sólido con el color primario (`#0e007b`), texto blanco y bordes redondeados.
    *   **Secundarios/Cancelación:** Fondo de color neutro o gris (`#868e96`).
    *   **Iconos:** Sin fondo (`background: none`), utilizando solo el color para la interacción.
*   **Interacciones y Feedback:**
    *   **Hover:** Las transiciones (`transition`) se usan ampliamente para suavizar los cambios de color, sombras y transformaciones (`transform: translateY()`). Esto proporciona al usuario una retroalimentación visual inmediata y agradable de que un elemento es interactivo.
    *   **Activo/Seleccionado:** El estado activo se indica claramente, a menudo con un cambio de color más pronunciado o un subrayado, como en el menú de navegación principal.
