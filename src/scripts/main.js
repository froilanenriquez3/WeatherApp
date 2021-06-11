var Provinces = [];
var Municipios = [];
var FilteredProvinces = [];
var FilteredMuns = [];
var Mode = "light";

init();

function init() {
  document
    .getElementById("btnAbc")
    .addEventListener("click", sortAlphabeticalProvinces);
  document
    .getElementById("btnAbcMun")
    .addEventListener("click", sortAlphabeticalMun);

  // document.getElementById("btnPobProv").addEventListener("click", () => {});
  document
    .getElementById("btnPobMun")
    .addEventListener("click", sortPopulationMun);

  document.getElementById("btnPdf").addEventListener("click", generatePdf);

  document
    .getElementById("btnSearchProv")
    .addEventListener("click", searchProv);
  document.getElementById("btnSearchMun").addEventListener("click", searchMun);

  document
    .getElementById("btnDark")
    .addEventListener("click", turnOffTheLights);

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
      fillProvinceList(Provinces);
    })
    .catch((err) => {
      console.log(err);
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
      fillMunList(Municipios);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getProvinceInfo(codprov) {
  let province;
  axios
    .get("https://www.el-tiempo.net/api/json/v2/provincias/" + codprov)
    .then((res) => {
      // console.log(res);
      province = res.data;
      seeInfoProvince(province);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getProvinceMunicipios(codprov) {
  axios
    .get(
      "https://www.el-tiempo.net/api/json/v2/provincias/" +
        codprov +
        "/municipios"
    )
    .then((res) => {
      // console.log(res);
      FilteredMuns = [];
      res.data.municipios.forEach((item) => {
        FilteredMuns.push(item);
      });
      seeMunicipiosProvince(FilteredMuns);
    })
    .catch((err) => {
      console.log(err);
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
      seeInfoMunicipio(municipio);
    })
    .catch((err) => {
      console.log(err);
    });
}

/* Functions */

function fillProvinceList(provinces) {
  let list = document.getElementById("provinceList");
  list.innerHTML = "";

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

  document.getElementById("provResults").innerHTML =
    provinces.length + " resultados";
}

function fillMunList(municipios) {
  let municipioUl = document.getElementById("provinceMunicipiosList");

  municipioUl.innerHTML = "";
  municipios.forEach((municipio, i) => {
    let li = document.createElement("li");
    let id = municipio.CODIGOINE.substring(0, 5);

    li.innerHTML = municipio.NOMBRE;
    li.addEventListener("click", () => {
      document.getElementById("provinceInfo").style.display = "none";
      document.getElementById("municipioInfo").style.display = "block";
      getMunicipioInfo(municipios[0].CODPROV, id);
    });
    municipioUl.appendChild(li);
  });

  document.getElementById("munResults").innerHTML =
    municipios.length + " resultados";
}

function seeMunicipiosProvince(municipios) {
  document.getElementById("btnAbcMun").addEventListener("click", () => {
    sortAlphabeticalMun(municipios);
  });

  let header = document.getElementById("provinceInfoHeader");
  header.innerHTML = "Municipios de " + municipios[0].NOMBRE_PROVINCIA;

  fillMunList(municipios);
}

function seeInfoMunicipio(municipio) {
  let header = document.getElementById("munHeader");
  header.innerHTML = municipio.municipio.NOMBRE;

  // let label = document.getElementById("mapLabel");
  // label.innerHTML = municipio.municipio.NOMBRE;

  document.getElementById("btnPdf").addEventListener("click", generatePdf);

  //Datos Municipio
  document.getElementById("munCapital").innerHTML =
    "Capital: " + municipio.municipio.NOMBRE_CAPITAL;
  document.getElementById("munPoblacion").innerHTML =
    "Población: " + municipio.municipio.POBLACION_MUNI;
  document.getElementById("munSuperficie").innerHTML =
    "Superficie: " + municipio.municipio.SUPERFICIE;
  document.getElementById("munPerimetro").innerHTML =
    "Perímetro: " + municipio.municipio.PERIMETRO;

  //Tiempo
  document.getElementById("munFecha").innerHTML = "Fecha: " + municipio.fecha;
  document.getElementById("munSky").innerHTML =
    "Estado: " + municipio.stateSky.description;
  document.getElementById("munTempActual").innerHTML =
    "Temp Actual: " + municipio.temperatura_actual + "º";
  document.getElementById("munTempMax").innerHTML =
    "Max: " + municipio.temperaturas.max + "º";
  document.getElementById("munTempMin").innerHTML =
    "Min: " + municipio.temperaturas.min + "º";
  document.getElementById("munHumedad").innerHTML =
    "Humedad: " + municipio.humedad;
  document.getElementById("munViento").innerHTML =
    "Viento: " + municipio.viento;
  document.getElementById("munLluvia").innerHTML =
    "Lluvia: " + municipio.lluvia;

  addMark(
    municipio.municipio.LONGITUD_ETRS89_REGCAN95,
    municipio.municipio.LATITUD_ETRS89_REGCAN95
  );
}

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
  let header = document.getElementById("provHeader");
  header.innerHTML = province.title;

  //Datos Municipio
  document.getElementById("provCapital").innerHTML =
    "Capital Provincia: " + province.provincia.CAPITAL_PROVINCIA;
  document.getElementById("provCom").innerHTML =
    "Comunidad Ciudad Autonoma: " +
    province.provincia.COMUNIDAD_CIUDAD_AUTONOMA;

  //Tiempo
  document.getElementById("provToday").innerHTML = "Hoy: " + province.today.p;
  document.getElementById("provTomorrow").innerHTML =
    "Mañana: " + province.tomorrow.p;
}

function sortAlphabeticalProvinces() {
  let ul = document.getElementById("provinceList");
  ul.innerHTML = "";

  if (FilteredProvinces.length > 0) {
    FilteredProvinces.sort((a, b) =>
      a.NOMBRE_PROVINCIA.localeCompare(b.NOMBRE_PROVINCIA)
    );
    fillProvinceList(FilteredProvinces);
  } else {
    Provinces.sort((a, b) =>
      a.NOMBRE_PROVINCIA.localeCompare(b.NOMBRE_PROVINCIA)
    );
    fillProvinceList(Provinces);
  }
}

function sortAlphabeticalMun() {
  let ul = document.getElementById("provinceMunicipiosList");
  ul.innerHTML = "";
  console.log("sort alphabetical");

  if (FilteredMuns.length > 0) {
    FilteredMuns.sort((a, b) =>
      a.NOMBRE.localeCompare(b.NOMBRE)
    );

    fillMunList(FilteredMuns);
  } else {
    Municipios.sort((a, b) =>
      a.NOMBRE.localeCompare(b.NOMBRE)
    );

    fillMunList(Municipios);
  }
}

function sortPopulationProv() {
  let ul = document.getElementById("provinceList");
  ul.innerHTML = "";

  if (FilteredProvinces.length > 0) {
    FilteredProvinces.sort((a, b) => a.POBLACION_MUNI - b.POBLACION_MUNI);
    fillProvinceList(FilteredProvinces);
  } else {
    Provinces.sort((a, b) => a.POBLACION_MUNI - b.POBLACION_MUNI);
    fillProvinceList(Provinces);
  }
}

function sortPopulationMun() {
  let ul = document.getElementById("provinceMunicipiosList");
  ul.innerHTML = "";

  if (FilteredMuns.length > 0) {
    FilteredMuns.sort((a, b) => a.POBLACION_MUNI - b.POBLACION_MUNI);

    fillMunList(FilteredMuns);
  } else {
    Municipios.sort((a, b) => a.POBLACION_MUNI - b.POBLACION_MUNI);

    fillMunList(Municipios);
  }
}

function generatePdf() {
  const el = document.getElementById("munDiv");
  const name = document.getElementById("munHeader").innerHTML;

  html2pdf().from(el).save(name);
}

function searchProv() {
  let name = document.getElementById("searchBarProv").value;

  FilteredProvinces = Provinces.filter((province) =>
    province.NOMBRE_PROVINCIA.toLowerCase().includes(name.toLowerCase())
  );

  fillProvinceList(FilteredProvinces);
}

function searchMun() {
  let header = document.getElementById("provinceInfoHeader");
  header.innerHTML = "Municipios";
  let name = document.getElementById("searchBarMun").value;

  FilteredMuns = Municipios.filter((municipio) =>
    municipio.NOMBRE.toLowerCase().includes(name.toLowerCase())
  );

  fillMunList(FilteredMuns);
}

function turnOffTheLights() {
  if (Mode == "light") {
    let body = document.getElementsByTagName("body");
    body[0].style.backgroundImage = 'url("../img/night.jpg")';

    let headers = document.getElementsByTagName("header");
    headers[0].style.backgroundColor = "MidnightBlue";
    headers[0].style.color = "white";

    let sections = Array.from(document.getElementsByTagName("section"));

    sections.map((section) => {
      section.style.backgroundColor = "MidnightBlue";
      section.style.color = "white";

      return section;
    });

    let btn = document.getElementById("btnDark");
    btn.innerHTML = "Light mode";
    Mode = "dark";
  } else {
    let body = document.getElementsByTagName("body");
    body[0].style.backgroundImage = 'url("../img/clouds.jpg")';

    let headers = document.getElementsByTagName("header");
    headers[0].style.backgroundColor = "white";
    headers[0].style.color = "black";

    let sections = Array.from(document.getElementsByTagName("section"));

    sections.map((section) => {
      section.style.backgroundColor = "white";
      section.style.color = "black";

      return section;
    });

    let btn = document.getElementById("btnDark");
    btn.innerHTML = "Dark mode";
    Mode = "light";
  }
}
