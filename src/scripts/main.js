var Provinces = [];

init();

function init() {
  getProvinces();
}

/* API Functions */

function getProvinces() {
  axios
    .get("https://www.el-tiempo.net/api/json/v1/provincias")
    .then((res) => {
      res.data.forEach((item) => {
        Provinces.push(item);
      });
      console.log(Provinces);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      fillProvinceList(Provinces);
    });
}

function getProvinceInfo(codprov) {
  let province;
  axios
    .get("https://www.el-tiempo.net/api/json/v1/provincias/" + codprov)
    .then((res) => {
      console.log(res.data);
      province = res.data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      return province;
    });
}

function getProvinceMunicipios(codprov) {
  let provMunicipios = [];
  axios
    .get(
      "https://www.el-tiempo.net/api/json/v1/provincias/" +
        codprov +
        "/municipios"
    )
    .then((res) => {
      console.log(res);

      //JSON returns both arrays and objects, checks to see which one response is
      if (Array.isArray(res.data)) {
        res.data.forEach((item) => {
          provMunicipios.push(item);
        });
      } else {
        Object.values(res.data).forEach((item) => {
          provMunicipios.push(item);
        });
      }
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
      console.log(res.data);
      municipio = res.data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      return municipio;
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
      getProvinceMunicipios(province.CODPROV);
    });

    list.appendChild(li);
  });
}

function seeMunicipiosProvince(municipios) {
  console.log(municipios);
  let provinceEl = document.getElementById("province" + municipios[0].CODPROV);

  //Reset list
  provinceEl.innerHTML = municipios[0].NOMBRE_PROVINCIA;

  let ul = document.createElement("ul");
  ul.id = "province" + municipios[0].CODPROV + "List";

  municipios.forEach((municipio) => {
    let li = document.createElement("li");

    li.innerHTML = municipio.NOMBRE;
    ul.appendChild(li);
  });

  provinceEl.appendChild(ul);
}
