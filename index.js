import axios from 'axios';

//html elemnts
const iniciar_btn = document.getElementById('iniciar');
const ubicacion_btn = document.getElementById('ubicacion');
const terminar_btn = document.getElementById('terminar');
const tabla = document.getElementById('tabla_vuelos');

//
let vuelo_seleccionado = null;
let vuelos;

//setting up the page
axios({
  method: 'get',
  url: `http://${process.env.HOST}:${process.env.API_PORT}/api/vuelos`
}).then(res => {
  vuelos = res.data.data;
  actualizar_vuelos(vuelos);
}, err => {
  console.log(err);
});

//actualizando la tabla de vuelos
const actualizar_vuelos = (vuelos) => {
  tabla.innerHTML = '';
  vuelos.forEach(el => {
    console.log(el);
    const tr = document.createElement('tr');

    //vuelo
    let td = document.createElement('td');
    td.innerHTML = `
    <span>${el.id_vuelo}</span>
    `;
    tr.appendChild(td);

    //avion
    td = document.createElement('td');
    td.innerHTML = `
    <span>${el.avion}</span>
    `;
    tr.appendChild(td);

    //origen
    td = document.createElement('td');
    td.innerHTML = `
    <span>${el.origen}</span>
    `;
    tr.appendChild(td);

    //destino
    td = document.createElement('td');
    td.innerHTML = `
    <span>${el.destino}</span>
    `;
    tr.appendChild(td);

    //destino
    td = document.createElement('td');
    const fecha = new Date(el.fecha_salida);
    td.innerHTML = `
    <span>${fecha.getDay()} / ${fecha.getMonth()} / ${fecha.getFullYear()}</span>
    `;
    tr.appendChild(td);

    tr.classList.add('vuelo_row');
    tr.addEventListener('click', () => {
      Array.from(document.getElementsByTagName('tr')).forEach(el => el.classList.remove('bg-danger'));
      tr.classList.add('bg-danger');
      vuelo_seleccionado = el;
    });
    tabla.appendChild(tr);
  });
};

iniciar_btn.addEventListener('click', () => {
  if(!vuelo_seleccionado) {
    alert('No has seleccionado ningún vuelo');
    return;
  }

  axios({
    method: 'post',
    url: `http://${process.env.HOST}:${process.env.API_PORT}/api/aviones/despegar`,
    data: {
      id: vuelo_seleccionado.avion
    }
  }).then(res => {
    console.log(res);
  }, err => {
    console.log(err);
  });
});

terminar_btn.addEventListener('click', () => {
  if(!vuelo_seleccionado) {
    alert('No has seleccionado ningún vuelo');
    return;
  }

  axios({
    method: 'post',
    url: `http://${process.env.HOST}:${process.env.API_PORT}/api/aviones/aterrizar`,
    data: {
      id: vuelo_seleccionado.avion
    }
  }).then(res => {
    console.log(res);
  }, err => {
    console.log(err);
  });
});


ubicacion_btn.addEventListener('click', () => {
  if(!vuelo_seleccionado) {
    alert('No has seleccionado ningún vuelo');
    return;
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude)
        console.log(position.coords.longitude)
        axios({
          method: 'post',
          url: `http://${process.env.HOST}:${process.env.API_PORT}/api/aviones/reportar`,
          data: {
            id: vuelo_seleccionado.avion,
            latitud: position.coords.latitude,
            longitud: position.coords.longitude
          }
        }).then(res => {
          console.log(res);
        }, err => {
          console.log(err);
        });
      },
      (error) => {
        console.log(error);
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});

function sendPosition(position) {
}
