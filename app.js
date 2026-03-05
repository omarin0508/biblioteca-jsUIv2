/*
=========================================
BIBLIOTECA PERSONAL EN JAVASCRIPT
- Clases: Libro, Biblioteca
- Arreglos: this.libros
- Funciones/Métodos: agregar, listar, buscar, eliminar, prestar, devolver
- UI: formulario + tabla en HTML
=========================================
*/

class Libro {
  constructor(titulo, autor, genero, anio) {
    this.titulo = titulo
    this.autor = autor
    this.genero = genero
    this.anio = anio
    this.prestado = false
  }

  describir() {
    return `${this.titulo} - ${this.autor} (${this.genero}, ${this.anio})`
  }
}

class Biblioteca {
  constructor() {
    this.libros = []
  }

  agregarLibro(libro) {
    this.libros.push(libro)
    console.log(`✅ Libro agregado: ${libro.titulo}`)
  }

  mostrarLibros() {
    console.log("📚 Lista de libros en la biblioteca:")
    this.libros.forEach((libro, i) => console.log(`${i + 1}. ${libro.describir()}`))
  }

  buscarPorTitulo(tituloBuscado) {
    const t = tituloBuscado.toLowerCase()
    const libro = this.libros.find(l => l.titulo.toLowerCase() === t)

    if (libro) {
      console.log("🔎 Libro encontrado:", libro.describir())
      return libro
    }
    console.log("⚠️ Libro no encontrado:", tituloBuscado)
    return null
  }

  eliminarPorTitulo(tituloBuscado) {
    const t = tituloBuscado.toLowerCase()
    const index = this.libros.findIndex(l => l.titulo.toLowerCase() === t)

    if (index !== -1) {
      const eliminado = this.libros.splice(index, 1)[0]
      console.log(`🗑️ Libro eliminado: ${eliminado.titulo}`)
      return true
    }
    console.log("⚠️ No se encontró el libro para eliminar:", tituloBuscado)
    return false
  }

  prestarLibro(tituloBuscado) {
    const libro = this.buscarPorTitulo(tituloBuscado)
    if (!libro) return false

    if (libro.prestado) {
      console.log("⚠️ Ese libro ya está prestado.")
      return false
    }
    libro.prestado = true
    console.log(`📕 Libro prestado: ${libro.titulo}`)
    return true
  }

  devolverLibro(tituloBuscado) {
    const libro = this.buscarPorTitulo(tituloBuscado)
    if (!libro) return false

    if (!libro.prestado) {
      console.log("⚠️ Ese libro no estaba prestado.")
      return false
    }
    libro.prestado = false
    console.log(`✅ Libro devuelto: ${libro.titulo}`)
    return true
  }
}

/*
=========================================
ZONA DE PRUEBAS (datos iniciales)
=========================================
*/
console.log("🚀 Biblioteca iniciada correctamente")

const miBiblioteca = new Biblioteca()

miBiblioteca.agregarLibro(new Libro("El Principito", "Antoine de Saint-Exupéry", "Ficción", 1943))
miBiblioteca.agregarLibro(new Libro("1984", "George Orwell", "Distopía", 1949))
miBiblioteca.agregarLibro(new Libro("Cien años de soledad", "Gabriel García Márquez", "Realismo mágico", 1967))

/*
=========================================
UI (DOM): tabla en la página
=========================================
*/
const tablaLibrosEl = document.getElementById("tablaLibros")
const cuerpoTablaEl = document.getElementById("cuerpoTabla")
const msgVacioEl = document.getElementById("msgVacio")

const tituloEl = document.getElementById("titulo")
const autorEl = document.getElementById("autor")
const generoEl = document.getElementById("genero")
const anioEl = document.getElementById("anio")

const btnAgregar = document.getElementById("btnAgregar")
const btnMostrar = document.getElementById("btnMostrar")
const btnTable = document.getElementById("btnTable")

function renderTabla() {
  // Limpiar cuerpo de tabla
  cuerpoTablaEl.innerHTML = ""

  // Si está vacío: oculto tabla, muestro mensaje
  if (miBiblioteca.libros.length === 0) {
    tablaLibrosEl.style.display = "none"
    msgVacioEl.style.display = "block"
    return
  }

  // Si hay libros: muestro tabla, oculto mensaje
  tablaLibrosEl.style.display = "table"
  msgVacioEl.style.display = "none"

  miBiblioteca.libros.forEach((libro) => {
    const fila = document.createElement("tr")

    const estadoHTML = libro.prestado
      ? `<span class="tag tag-bad">Prestado</span>`
      : `<span class="tag tag-ok">Disponible</span>`

    // Acciones: Prestar/Devolver + Eliminar
    const accionesHTML = `
      <div class="acciones">
        <button class="btnMini ${libro.prestado ? "btnDevolver" : "btnPrestar"}" data-accion="toggle" data-titulo="${libro.titulo}">
          ${libro.prestado ? "Devolver" : "Prestar"}
        </button>
        <button class="btnMini btnEliminar" data-accion="eliminar" data-titulo="${libro.titulo}">
          Eliminar
        </button>
      </div>
    `

    fila.innerHTML = `
      <td>${libro.titulo}</td>
      <td>${libro.autor}</td>
      <td>${libro.genero}</td>
      <td>${libro.anio}</td>
      <td>${estadoHTML}</td>
      <td>${accionesHTML}</td>
    `

    cuerpoTablaEl.appendChild(fila)
  })
}

/* Delegación de eventos:
   Un solo listener para todos los botones de la tabla */
cuerpoTablaEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button")
  if (!btn) return

  const accion = btn.dataset.accion
  const titulo = btn.dataset.titulo
  if (!accion || !titulo) return

  if (accion === "toggle") {
    const libro = miBiblioteca.buscarPorTitulo(titulo)
    if (!libro) return

    if (libro.prestado) miBiblioteca.devolverLibro(titulo)
    else miBiblioteca.prestarLibro(titulo)

    renderTabla()
  }

  if (accion === "eliminar") {
    miBiblioteca.eliminarPorTitulo(titulo)
    renderTabla()
  }
})

function agregarLibroDesdeFormulario() {
  const titulo = tituloEl.value.trim()
  const autor = autorEl.value.trim()
  const genero = generoEl.value.trim()
  const anio = Number(anioEl.value)

  if (!titulo || !autor || !genero || !anio) {
    alert("Por favor completa todos los campos (año debe ser número).")
    return
  }

  miBiblioteca.agregarLibro(new Libro(titulo, autor, genero, anio))

  // limpiar inputs
  tituloEl.value = ""
  autorEl.value = ""
  generoEl.value = ""
  anioEl.value = ""

  renderTabla()
}

// Eventos (formularios / consola)
btnAgregar.addEventListener("click", agregarLibroDesdeFormulario)
btnMostrar.addEventListener("click", () => miBiblioteca.mostrarLibros())
btnTable.addEventListener("click", () => console.table(miBiblioteca.libros))

// Primera pintada
renderTabla()