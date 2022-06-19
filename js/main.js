const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
  fetchData()
  if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'))
    crearCarrito()
  }
})



cards.addEventListener('click', e => {
  agregarAlCarrito(e)
})

items.addEventListener('click', e => {
  botonAccion(e)

})

const fetchData = async() => {
    try {
        const res = await fetch('./productos.json')
        const data = await res.json()
        crearCards(data)
    } catch (error) {
        console.log('error');
      
    }
}

const crearCards = (data) => {
  console.log(data);
  data.forEach(producto => {
    templateCard.querySelector('h2').textContent = producto.nombre
    templateCard.querySelector('h4').textContent = producto.marca
    templateCard.querySelector('p').textContent = producto.precio
    templateCard.querySelector('img').setAttribute('src', producto.imagen)
    templateCard.querySelector('.btn').dataset.id = producto.id

    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
  })
  cards.appendChild(fragment)  
}

const agregarAlCarrito = e => {
  if(e.target.classList.contains('btn')) {
    setCarrito(e.target.parentElement)
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Producto agregado al carrito!',
      showConfirmButton: true,
  })
  }
  e.stopPropagation()
}



const setCarrito = objeto => {
  const producto = {
    id: objeto.querySelector('.btn').dataset.id,
    nombre: objeto.querySelector('h2').textContent,
    marca: objeto.querySelector('h4').textContent,
    precio: objeto.querySelector('p').textContent,
    cantidad: 1
  }
  if(carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1 
  }
  carrito[producto.id] = {...producto}
  crearCarrito()
}

const crearCarrito = () => {
  items.innerHTML = '';
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector('th').textContent = producto.id
    templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
    templateCarrito.querySelector('.btn-info').dataset.id = producto.id
    templateCarrito.querySelector('.btn-danger').dataset.id = producto.id 
    templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  })
  items.appendChild(fragment)
  crearFooter();

  localStorage.setItem('carrito', JSON.stringify(carrito))
}

const crearFooter = () => {
  footer.innerHTML = "";
  if(Object.keys(carrito).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
    return
  }

  const cantidades = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad ,0)
  const nPrecios = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
  
  templateFooter.querySelectorAll('td')[0].textContent = cantidades
  templateFooter.querySelector('span').textContent = nPrecios

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)
  footer.appendChild(fragment)

  const botonVaciar = document.getElementById('vaciar-carrito')
  botonVaciar.addEventListener('click', () => {
    Swal.fire({
      title: 'Seguro quieres eliminar el carrito?',
      text: "Tendrás que seleccionar nuevamente el producto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Borrado!',
          'Tus productos han sido eliminados.',
          'success'
          )
          carrito = {}
          crearCarrito()
      }
    })
  })
}

const botonAccion = e => {
  if (e.target.classList.contains('btn-info')) {
    const producto = carrito[e.target.dataset.id]
    producto.cantidad++
    carrito[e.target.dataset.id] = {...producto}
    crearCarrito()
  }

  if (e.target.classList.contains('btn-danger')) {
    const producto = carrito[e.target.dataset.id]
    producto.cantidad--
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id]
    }
    crearCarrito()
  }
  e.stopPropagation()
}









