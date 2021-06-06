init();

function init() {}

function getProvinces() {
  let provinces = [];
  axios
    .get("https://www.el-tiempo.net/api/json/v1/provincias")
    .then((res) => {
      res.data.forEach((item) => {
        provinces.push(item);
      });
      console.log(provinces);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      return provinces;
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
  let province;
  axios
    .get(
      "https://www.el-tiempo.net/api/json/v1/provincias/" +
        codprov +
        "/municipios"
    )
    .then((res) => {
      console.log(res);
      province = res.data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      return province;
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
