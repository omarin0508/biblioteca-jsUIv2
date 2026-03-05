/*
=========================================
BIBLIOTECA PERSONAL EN JAVASCRIPT
- Clases: Libro, Biblioteca
- Arreglos: this.libros
- Funciones/Métodos: agregar, listar, buscar, eliminar, prestar, devolver
- UI: formulario + lista en HTML
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
UI (DOM): pintar libros en la página
=========================================
*/
const listaLibrosEl = document.getElementById("listaLibros")
const tituloEl = document.getElementById("titulo")
const autorEl = document.getElementById("autor")
const generoEl = document.getElementById("genero")
const anioEl = document.getElementById("anio")

const btnAgregar = document.getElementById("btnAgregar")
const btnMostrar = document.getElementById("btnMostrar")
const btnTable = document.getElementById("btnTable")

function renderLista() {
  // Limpiar
  listaLibrosEl.innerHTML = ""

  miBiblioteca.libros.forEach((libro) => {
    const li = document.createElement("li")
    li.textContent = libro.describir()

    // Etiqueta prestado / disponible
    const tag = document.createElement("span")
    tag.className = "tag" + (libro.prestado ? " prestado" : "")
    tag.textContent = libro.prestado ? "Prestado" : "Disponible"
    li.appendChild(tag)

    // Botón Prestar/Devolver
    const btnPD = document.createElement("button")
    btnPD.textContent = libro.prestado ? "Devolver" : "Prestar"
    btnPD.style.marginLeft = "10px"
    btnPD.onclick = () => {
      if (libro.prestado) miBiblioteca.devolverLibro(libro.titulo)
      else miBiblioteca.prestarLibro(libro.titulo)
      renderLista()
    }
    li.appendChild(btnPD)

    // Botón Eliminar
    const btnDel = document.createElement("button")
    btnDel.textContent = "Eliminar"
    btnDel.style.marginLeft = "8px"
    btnDel.onclick = () => {
      miBiblioteca.eliminarPorTitulo(libro.titulo)
      renderLista()
    }
    li.appendChild(btnDel)

    listaLibrosEl.appendChild(li)
  })
}

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

  renderLista()
}

// Eventos
btnAgregar.addEventListener("click", agregarLibroDesdeFormulario)
btnMostrar.addEventListener("click", () => miBiblioteca.mostrarLibros())
btnTable.addEventListener("click", () => console.table(miBiblioteca.libros))

// Primera pintada
renderLista()