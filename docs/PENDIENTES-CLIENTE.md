# Pendientes y dudas para el cliente — Rediseño (rebranding)

Registro de diferencias entre el Figma y el sitio, y de dudas que necesitan respuesta del cliente.
Se actualiza a medida que avanzamos. Última actualización: **30/10/2026**.

**Criterio acordado:** cuando un texto del Figma difiere del que ya está cargado en el sitio, **se mantiene el texto actual** hasta que el cliente confirme.

---

## 1. Preguntas para el cliente

### General (todo el sitio)

1. **Tipografía de títulos (Fieldwork):** el Figma usa *Fieldwork* (Geo DemiBold), que es una fuente paga y no está en Google Fonts. ¿Nos pueden pasar los archivos (`.woff2` u `.otf`: Regular, DemiBold y Bold) y confirmar que la licencia permite usarla en la web? Mientras tanto usamos *Montserrat*, que es parecida.
2. **Logo:** ¿nos pasan el logo oficial en SVG? Hoy se muestra una versión en texto ("TopRentals®"). En el footer de la página Corporate del Figma aparece además un ícono de edificio sobre el logo.
3. **Footer:** en el Figma de **Corporate** aparece un footer distinto al de la Home, con columnas (Top Rentals, Destinos, Accesos, Propietarios, Real Estate). ¿Ese footer nuevo va en **todo el sitio** o solo en Corporate? Hoy hay un único footer para todo el sitio, igual al de la Home.
4. **Botón "Reservar ahora" del header:** en el Figma cambia de color según la página: oscuro en la Home, rojo en Propiedades y blanco en Corporate. ¿Es intencional? Lo implementamos así.
5. **Barra promocional "15%off SDF":** aparece arriba de todo el sitio y parece un texto de prueba. ¿La sacamos o tienen el texto definitivo? Se edita desde el admin.

### Home

6. **Fotos de "Ubicaciones" (Buenos Aires y Quito):** hoy usamos recortes de baja resolución sacados del Figma. ¿Nos pasan las fotos originales en alta (mínimo 1200 px de ancho)? Las mismas fotos se usan en "Destinos" de Corporate.
7. **Banner principal (hero):** por indicación quedó **sin cambios** por ahora. ¿Ya está definido el diseño nuevo del banner?

### Propiedades

8. **Filtros nuevos:** ya están implementados, pero se muestran solo cuando hay datos cargados. Desde el admin (Propiedades), el cliente tiene que:
   - **Huéspedes:** cargar la capacidad de cada unidad en el campo "Huéspedes" (ej.: "Hasta 4 huéspedes").
   - **Disponibilidad (Grupos · Solo · Familia):** marcar en cada propiedad para quién es ideal. La marca "Grupos" también activa el botón "Grupos" de la franja roja.
   - **Unidades exclusivas:** ¿qué define que una propiedad tenga "unidades exclusivas"? Una vez definido, se marca en cada propiedad.
   - El botón **"Disponible ahora"** del Figma **se descartó**, porque no hay forma confiable de saber la disponibilidad sin consultar al motor de reservas.
9. **Nombres de los botones de país:** hoy dicen "Argentina" y "Ecuador", y en el Figma "Buenos Aires" y "Ecuador". ¿Cuál prefieren? Se cambia desde el admin (Propiedades → Filtros).
10. **Nombres de propiedades:** en el sitio figuran con el prefijo "Top Rentals" (ej.: "Top Rentals Downtown") y en el Figma sin prefijo y con otros nombres (ej.: "Downtown – Torre Bellini", "Huergo 475"). ¿Cuál usamos?
11. **Datos de las tarjetas:** el Figma muestra cantidad de unidades y servicios en cada tarjeta (ej.: "134 unidades · Piscina · Gym · SUM"). Hoy solo Downtown tiene esos datos cargados. Para que aparezcan en todas, hay que completar en el admin las cifras ("Unidades") y las etiquetas de cada propiedad.
12. **Foto del banner de Propiedades:** la actual mide 1440 px de ancho. Si tienen una versión de 1920 px o más, se ve mejor en pantallas grandes.

### Corporate — diferencias de texto (se mantiene el texto actual)

13. **Subtítulo del hero:**
    - Actual: "Soluciones de alojamiento profesional para empresas, equipos en movimiento y proyectos flexibles."
    - Figma: "…equipos en movimiento y proyectos de cualquier duración. Buenos Aires · Quito."
14. **Botón secundario del hero:**
    - Actual: "Cotizar →"
    - Figma: "Cotizar alojamiento →"
15. **Texto junto a la etiqueta "CORPORATIVO" (hero):** se agregó como en el Figma ("• Consultoras y proyectos por tiempo determinado"). El texto se edita desde el admin (Corporate → Hero). Ojo: repite un ítem de "Diseñado para". ¿Lo dejamos o prefieren otro texto?
16. **"Diseñado para equipos que viajan"**, lista de destinatarios:
    - Actual (4 ítems): Empresas con equipos en movimiento · Relocaciones de corta y larga estadía · Agencias mayoristas de viajes · Programas de jóvenes profesionales y grupos universitarios.
    - Figma (5 ítems): Empresas con equipos en movimiento · Ejecutivos y profesionales en estadías temporales · Relocaciones de corta y larga estadía · Consultoras y proyectos por tiempo determinado · Programas de Jóvenes Profesionales.
17. **Beneficios:** cambios menores de redacción.
    - Actual: "Servicios adicionales a medida."
    - Figma: "Servicios adicionales a medida para huéspedes".
18. **Destinos:**
    - Actual: "ECUADOR"
    - Figma: "QUITO, ECUADOR"
19. **Formulario de acceso corporativo:** el Figma no incluye el campo **Email**. Lo mantuvimos porque sin email no se puede contactar al interesado desde Zoho. ¿Están de acuerdo?
20. **Foto del banner de Corporate:** mide 1440 px de ancho; si hay una versión de 1920 px, mejor.

### Motor de reservas (GNAHS)

21. **EpiQ:** el listado de GNAHS indica que el ID 12 es **EpiQ** (antes figuraba como "Top Rentals Quito"); ya lo corregimos. Queda pendiente su página de edificio, que iban a probar crear desde el admin.
22. **Velocidad del motor:** la demora al cargar `/reservas` es del lado de GNAHS (descargan su código y consultan precios). Si les parece, se lo podemos comentar a ellos.

### Seguridad

23. **Credenciales enviadas por mail:** en la cadena de mails circularon en texto plano contraseñas (Gmail, Elfsight, Vercel, GitHub, cPanel, admin), el *Client Secret* de Zoho y claves de GNAHS. Recomendamos **cambiarlas** (sobre todo las que comparten la misma contraseña) y compartirlas de ahora en más por un gestor de contraseñas (1Password, Bitwarden).

### Fichas de edificios (ej. Núñez Hub)

24. ~~**Color por edificio**~~ — **Resuelto:** todos los edificios tienen la misma estética (header, franja final y botón de grupos en rojo, como en el Figma de Núñez Hub).
25. **Botón "Ver disponibilidad" en cada unidad:** se agregó como en el Figma, pero **lleva al motor de la torre**, no a la unidad puntual (el motor no permite elegir unidad desde el sitio). En la reunión del 2/6 se había descartado por ese motivo. ¿Lo dejamos así?
26. ~~**Título "Unidades disponibles"**~~ — **Resuelto:** se usa "UNIDADES *disponibles*", como en el Figma (reemplaza lo acordado en la reunión del 2/6).
27. **Campo "Tipo de unidad" en el buscador de la ficha:** el motor de GNAHS no permite elegir el tipo de unidad desde nuestro buscador, así que **no lo pusimos**. Quedan Entrada, Salida, Huéspedes y "Reservar →"; el tipo se elige dentro del motor.
28. **Botón "Descargar PDF torre":** estaba en la ficha anterior y no figura en el Figma, así que lo sacamos. ¿Lo necesitan? Si es así, ¿tienen los PDF de cada torre?
29. **Opiniones:** los comentarios de huéspedes y las reseñas de Google (Elfsight) no aparecen en el Figma. Los mantuvimos, debajo de la franja de grupos. ¿Les parece bien esa ubicación?
30. **Contenido por edificio que hay que cargar en el admin** (cada sección se oculta si está vacía):
    - **Foto de la franja con el nombre** (1920×500 px, fachada). Si no se carga, se usa la primera foto de la galería.
    - **Puntos de interés con foto:** se escriben como "Nombre | URL de la foto" (ej. "El Monumental | /uploads/monumental.jpg").
    - **Restaurantes cercanos** (uno por línea).
    - **Amenities y servicios:** se marcan con casillas (Piscina, Solarium, Fitness Center, SUM, Lavandería, Limpieza, WiFi, Cocheras, Seguridad 24hs, Cowork, Terraza, Recepción 24/7). ¿Falta alguno?
    - **Foto de cada unidad** (900×300 px).
    - **Cifras** (Unidades, Huéspedes, etc.): se muestran en la franja del nombre, en el resumen de unidades y en "Grupos". Hoy solo Downtown las tiene cargadas.
31. **Nombre del edificio en la franja:** el Figma lo muestra con una parte en cursiva ("*Núñez* HUB"). Hoy se muestra el nombre tal como está cargado (ej. "Top Rentals Downtown"). Está relacionado con el punto 10 (nombres de las propiedades).
32. **Fotos de puntos de interés de Núñez Hub:** cargamos los 8 lugares y los 4 restaurantes del Figma. Las fotos son **recortes provisorios** de la captura del Figma (175×46 px originales) y se ven algo pixeladas. ¿Nos pasan las fotos originales (mín. 1200 px de ancho)? Para los demás edificios hacen falta los lugares, las fotos y los restaurantes de cada uno.
33. **Núñez Hub vs. WOW Núñez:** en el sitio, la propiedad "Hub Núñez" tiene la dirección web `/propiedades/wow-nunez`, y el Figma muestra "WOW Núñez" como otra propiedad aparte (en "Otras propiedades"). ¿Son dos edificios distintos? Si es así, hay que corregir la dirección web de Hub Núñez y cargar WOW Núñez.
34. ~~**Nombres de amenities**~~ — **Resuelto:** cada edificio muestra sus amenities con el nombre de su pantalla del Figma (texto libre en el admin; el ícono se elige solo).
35. **Contenido de Núñez Hub cargado desde el Figma:** textos, etiquetas, unidades, cifras, grupos y franja final. Hay que revisar:
    - **Unidades:** el Figma muestra 5 (Studio, Dos Ambientes, Dos Amb. Plus, Tres Ambientes y Tres Amb. Plus); antes estaban cargadas 4 con nombres en inglés y su Tour 360°. Los tours se pasaron así: Studio → Studio, One Bedroom → Dos Ambientes, Two Bedroom Opción 1 → Tres Ambientes, Two Bedroom Opción 2 → Tres Amb. Plus. **Dos Amb. Plus quedó sin tour.** ¿Es correcta esa correspondencia?
    - **Cifras de grupos:** el Figma dice "29 Unidades · 60 Huéspedes · 5 Unidades · 24/7 Seguridad"; el segundo "Unidades" parece un error, así que pusimos **"5 Modelos"**.
    - **Fotos de unidades:** son recortes provisorios de la captura del Figma. ¿Nos pasan las originales?
    - **Galería y foto de la franja:** siguen las fotos genéricas de la propiedad; el Figma muestra otras (living, dormitorio, balcón y fachada curva). ¿Nos pasan esas fotos?
    - Todo se puede corregir desde el admin.

### Resto de los edificios (carga desde el Figma, 30/10)

36. **IDs del motor posiblemente cruzados (importante):** la propiedad con la dirección de **Núñez Hub** (Av. del Libertador 7200) está asociada al ID 2 de GNAHS, que se llama **"WOW Nuñez"**; y la de **WOW Núñez** (Núñez 2422) al ID 11, "Torre Nuñez". Si están cruzados, "Reservar" lleva a la torre equivocada. ¿Pueden confirmar qué ID corresponde a cada edificio?
37. **Unidades sueltas Cerviño, República de Siria y Jaramillo:** tienen pantalla en el Figma pero **no existen en el sitio ni en el listado del motor de reservas**, y usan otra plantilla ("El departamento", fotos del departamento). ¿Se reservan por GNAHS? Si es así, necesitamos su ID. Las pantallas ya están transcriptas, listas para cargar.
38. **Se cargó el contenido del Figma en 10 edificios** (Downtown, Huergo, Palermo Soho, Dorrego, Qorner, Montañeses, Palermo Chico, Palermo Hollywood, Libertador y WOW Núñez): textos, etiquetas, puntos de interés, restaurantes, unidades, amenities, cifras y franja final. Todo editable desde el admin. Puntos a revisar:
    - **Tours 360° sin unidad equivalente en el Figma** (quedaron fuera): Downtown "Lounge"; Huergo "2 Ambientes B" y "3 Ambientes Plus"; Qorner "4 Ambientes". **Unidades nuevas sin tour:** Downtown "Dúplex Piso 45", Huergo "Studio Plus", Núñez Hub "Dos Amb. Plus".
    - **Qorner:** el sitio lo tenía en Buenos Aires / Palermo (Costa Rica 5545); el Figma dice **Quito, Av. Portugal E9-57 y Av. de los Shyris**. Lo corregimos a Quito.
    - **Direcciones distintas:** Palermo Soho — sitio "Honduras 4567", Figma "Godoy Cruz 2573". Montañeses — sitio "Montañeses 2599", Figma "2585". No las cambiamos: ¿cuál es la correcta?
    - **Nombres:** en el sitio siguen los del catálogo (ej. "Top Rentals Belgrano" para Libertador, "Top Rentals Nuñez" para WOW Núñez); la franja de cada ficha ya muestra el nombre del Figma.
    - **Cifra "Unidades" repetida** (Downtown, Palermo Soho, Palermo Chico, Palermo Hollywood): la segunda pasó a **"Modelos"**.
    - **Sin franja de grupos en el Figma:** Dorrego, Qorner y WOW Núñez. En el sitio se muestra la franja con el texto por defecto. ¿La ocultamos en esos edificios?
    - **Posibles errores de tipeo en el Figma** (se cargaron tal cual): Qorner "El Quseque"; Libertador "Kichinette"; Jaramillo "perfecto **for** estadías"; República de Siria "Arabe" sin tilde.
    - **Fotos:** solo había fotos reales en Downtown (galería, puntos y unidades), Huergo y Libertador (puntos) y Palermo Hollywood (unidades y Recoleta). El resto de las pantallas tienen cuadros de muestra: hacen falta las fotos de cada edificio.
    - **Mapas de Montañeses y Libertador:** en el Figma son una captura genérica del centro; en el sitio se muestra el mapa real de cada dirección.

---

## 2. Notas internas (no hace falta enviarlas al cliente)

- **Contenido en producción:** en producción el contenido se lee de Vercel Blob y pisa los JSON del repo. Las cursivas de los títulos y las imágenes nuevas pueden no verse hasta guardarlas desde el admin.
- **Buscadores:** la Home y la ficha de edificio usan el buscador propio (diseño Figma, redirige al motor con `checkin`, `checkout`, `rooms`, `room1_adults`, `establishment_id`). El widget oficial de GNAHS ya no se usa en esas páginas.
- **Motor en navegación interna:** se corrigió que `/reservas` quedara en blanco al entrar por segunda vez sin recargar. *Mis reservas*, *Club* y *Agencias* cargan scripts de GNAHS de forma parecida: revisar si tienen el mismo problema.
- **Dominio:** pendiente unificar en `https://www.thetoprentals.com` con redirecciones 301, conservando rutas y parámetros (`gclid`, `fbclid`, `utm_*`). Se configura en Vercel cuando se apunte el dominio.
- **Fuente del cuerpo de texto:** se asumió *Manrope*. Falta confirmarla inspeccionando un texto común en el Figma.
- **Corporate en inglés:** las cursivas de los títulos se aplicaron solo en español.
- **Pendiente subir a vercel.app:** Propiedades, Corporate y fichas de edificios.
- **Transcripciones del Figma:** en `scratchpad/buildings/*.json` de la sesión (incluye Cerviño, República de Siria y Jaramillo, aún no cargadas).
- **Footer con columnas:** también aparece en el Figma de la ficha de edificio (ver punto 3).
