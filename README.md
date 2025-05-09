 ## Reporte Final - API de Medicamentos

 ¿Que hace este proyecto?
Este proyecto consiste en una API REST desarrollada con **Node.js** y **Express.js**, cuya funcionalidad principal es gestionar información sobre medicamentos. La API permite listar todos los medicamentos, obtener uno por su ID, buscar medicamentos por nombre, y filtrar según su presentación.

---

##  ¿ Porque lo elegimos este tema?
Este tema elegimos por que consideramos importante el mundo farmacológico, partiendo como
una de las entidades más importantes del país el PAMI. 

---

##  Origen de los Datos

La fuente de datos es un archivo local `data/medicamentos.json`, el cual contiene un arreglo de objetos representando medicamentos con atributos como:

- `id`: identificador único
- `nombre`: nombre del medicamento
- `presentacion`: tipo (ej. jarabe, comprimido, etc.)
- `precio`: valor numérico

>  Este archivo puede ser reemplazado o complementado en el futuro con una base de datos real como MongoDB o PostgreSQL.



##  Métodos Disponibles (Endpoints)

A continuación se describen los métodos expuestos por la API con sus respectivos parámetros de entrada y respuesta:


### 1. Obtener todos los medicamentos

- **Método**: `GET`
- **Ruta**: `/medicamentos`
- **Entradas**: Ninguna
- **Salida**: Lista completa de medicamentos

####  Ejemplo de uso
```http
GET /medicamentos
```

#### 🔄 Respuesta
```json
[
  {
    "id": 1,
    "nombre": "Paracetamol",
    "presentacion": "comprimido",
    "precio": 100
  },
  ...
]
```

---

### 2. Obtener medicamento por ID

- **Método**: `GET`
- **Ruta**: `/medicamentos/:id`
- **Entradas**:
  - `id` (número en la URL)
- **Salida**: Objeto del medicamento correspondiente o error si no existe

####  Ejemplo de uso
```http
GET /medicamentos/1
```

#### 🔄 Respuesta
```json
{
  "id": 1,
  "nombre": "Paracetamol",
  "presentacion": "comprimido",
  "precio": 100
}
```

---

### 3. Buscar medicamentos por nombre (parcial)

- **Método**: `GET`
- **Ruta**: `/medicamentos/buscar?nombre=parac`
- **Entradas**:
  - `nombre` (query string parcial o completo)
- **Salida**: Lista de medicamentos que coincidan

#### 🧪 Ejemplo de uso
```http
GET /medicamentos/buscar?nombre=ibup
```

#### 🔄 Respuesta
```json
[
  {
    "id": 2,
    "nombre": "Ibuprofeno",
    "presentacion": "comprimido",
    "precio": 120
  }
]
```

---

### 4. Filtrar medicamentos por presentación

- **Método**: `GET`
- **Ruta**: `/medicamentos/presentacion/:tipo`
- **Entradas**:
  - `tipo`: tipo de presentación (ej. jarabe, comprimido)
- **Salida**: Lista de medicamentos con dicha presentación

####  Ejemplo de uso
```http
GET /medicamentos/presentacion/jarabe
```

####  Respuesta
```json
[
  {
    "id": 3,
    "nombre": "Amoxicilina",
    "presentacion": "jarabe",
    "precio": 150
  }
]
```

##Campos de entrada y salida

GET	/medicamentos	—	Lista de medicamentos

GET	/medicamentos/:id	:id (número)	Objeto del medicamento con ese id

GET	/medicamentos/filtro/:droga	:droga (string)	Lista de medicamentos que contienen esa droga

GET	/medicamentos/ordenar/:campo	:campo (ej: DROGA, MARCA)	Lista ordenada de medicamentos por ese campo

POST	/medicamentos	JSON con: DROGA, MARCA	Objeto del nuevo medicamento creado (con id)

PUT	/medicamentos/:id	:id y JSON con nuevos campos (DROGA, MARCA, etc.)	Objeto actualizado

DELETE	/medicamentos/:id	:id (número)	Código 204 (sin contenido) si se elimina correctamente

GET	/info	—	Texto informativo sobre el estado de la API

---

##  Conclusión

Esta API representa un ejemplo práctico de desarrollo backend con Node.js. Se eligió por su claridad, aplicabilidad en contextos reales y posibilidad de extenderse fácilmente. La estructura modular junto con las rutas utilizadas con Express nos permitió trabajar con un código mas legible y ordenado.

> Ideal para futuras integraciones con interfaces web o móviles.

---
