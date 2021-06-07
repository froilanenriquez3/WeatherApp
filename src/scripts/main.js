var Provinces = [];
var Municipios = [];

init();

function init() {
  getProvinces();
  getMunicipios();
}

/* API Functions */

function getProvinces() {
  axios
    .get("https://www.el-tiempo.net/api/json/v2/provincias")
    .then((res) => {
      // console.log(res.data);
      res.data.provincias.forEach((item) => {
        Provinces.push(item);
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      fillProvinceList(Provinces);
    });
}

function getMunicipios() {
  axios
    .get("https://www.el-tiempo.net/api/json/v2/municipios")
    .then((res) => {
      // console.log(res);
      res.data.forEach((item) => {
        Municipios.push(item);
      });
      // console.log(Municipios);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {});
}

function getProvinceInfo(codprov) {
  let province;
  axios
    .get("https://www.el-tiempo.net/api/json/v2/provincias/" + codprov)
    .then((res) => {
      // console.log(res);

      province = res.data;

      /* if (Array.isArray(res.data)) {
        province = res.data[0];
      } else {
        province = Object.keys(res.data)[0];
      } */
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      seeInfoProvince(province);
    });
}

function getProvinceMunicipios(codprov) {
  let provMunicipios = [];
  axios
    .get(
      "https://www.el-tiempo.net/api/json/v2/provincias/" +
        codprov +
        "/municipios"
    )
    .then((res) => {
      // console.log(res);

      res.data.municipios.forEach((item) => {
        provMunicipios.push(item);
      });

      //JSON returns both arrays and objects, checks to see which one response is
      /*  if (Array.isArray(res.data.municipios)) {
        res.data.municipios.forEach((item) => {
          provMunicipios.push(item);
        });
      } else {
        Object.values(res.data).forEach((item) => {
          provMunicipios.push(item);
        });
      } */
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      seeMunicipiosProvince(provMunicipios);
    });
}

function getMunicipioInfo(codprov, id) {
  let municipio;

  axios
    .get(
      "https://www.el-tiempo.net/api/json/v2/provincias/" +
        codprov +
        "/municipios/" +
        id
    )
    .then((res) => {
      // console.log(res.data);
      municipio = res.data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      seeInfoMunicipio(municipio);
    });
}

/* Functions */

function fillProvinceList(provinces) {
  let list = document.getElementById("provinceList");

  provinces.forEach((province) => {
    let li = document.createElement("li");

    li.innerHTML = province.NOMBRE_PROVINCIA;
    li.id = "province" + province.CODPROV;
    li.dataset.id = province.CODPROV;

    li.addEventListener("click", () => {
      // seeMunicipiosProvince(province);
      document.getElementById("provinceInfo").style.display = "block";
      document.getElementById("municipioInfo").style.display = "none";
      getProvinceMunicipios(province.CODPROV);
      getProvinceInfo(province.CODPROV);
    });

    list.appendChild(li);
  });
}

function seeMunicipiosProvince(municipios) {
  let header = document.getElementById("provinceInfoHeader");
  header.innerHTML = municipios[0].NOMBRE_PROVINCIA;
  let municipioUl = document.getElementById("provinceMunicipiosList");

  municipioUl.innerHTML = "";

  municipios.forEach((municipio, i) => {
    let li = document.createElement("li");
    let id = cleanIdMunicipio(municipio.CODIGOINE);

    li.innerHTML = municipio.NOMBRE;
    li.addEventListener("click", () => {
      document.getElementById("provinceInfo").style.display = "none";
      document.getElementById("municipioInfo").style.display = "block";
      getMunicipioInfo(municipios[0].CODPROV, id);
    });
    municipioUl.appendChild(li);
  });
}

function seeInfoMunicipio(municipio) {
  let header = document.getElementById("munHeader");
  header.innerHTML = municipio.municipio.NOMBRE;

  //Datos Municipio
  document.getElementById("munCapital").innerHTML =
    "Capital: " + municipio.municipio.NOMBRE_CAPITAL;
  document.getElementById("munPoblacion").innerHTML =
    "Poblacion: " + municipio.municipio.POBLACION_MUNI;
  document.getElementById("munSuperficie").innerHTML =
    "Superficie: " + municipio.municipio.SUPERFICIE;

  //Tiempo
  document.getElementById("munFecha").innerHTML = "Fecha: " + municipio.fecha;
  document.getElementById("munSky").innerHTML = municipio.stateSky.description;
  document.getElementById("munTempActual").innerHTML =
    "Temperatura Actual: " + municipio.temperatura_actual;
  document.getElementById("munTempMax").innerHTML =
    "Max: " + municipio.temperaturas.max;
  document.getElementById("munTempMin").innerHTML =
    "Min: " + municipio.temperaturas.min;
}

//Get request doesnt accept extra 0s
//Loop through id until nonzero character is found, take substring of id
function cleanIdMunicipio(id) {
  let finished = false;
  let counter = id.length - 1;

  while (!finished && counter > 0) {
    if (id.charAt(counter) != "0") finished = true;
    else counter--;
  }

  return id.substring(0, counter + 1);
}

function seeInfoProvince(province) {
  console.log(province);
  let header = document.getElementById("provHeader");
  header.innerHTML = province.title;

  //Datos Municipio
  document.getElementById("provCapital").innerHTML =
    "Capital Provincia: " + province.provincia.CAPITAL_PROVINCIA;
  document.getElementById("provCom").innerHTML =
    "Comunidad Ciudad Autonoma: " +
    province.provincia.COMUNIDAD_CIUDAD_AUTONOMA;

  //Tiempo
  document.getElementById("provToday").innerHTML = "Today: " + province.today.p;
  document.getElementById("provTomorrow").innerHTML =
    "Tomorrow: " + province.tomorrow.p;

}
