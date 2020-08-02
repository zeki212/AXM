<template>
  <div style="overflow: hidden;">
    <div class="choose_address_btn_box">
      <span @click="hidePopup">取消</span>
      <span @click="getAddressData">确定</span>
    </div>
    <div class="clearfix linkage">
      <div class="province pickerWrapper">
        <mt-picker :slots="provinces" @change="onProvinceChange" value-key="name"></mt-picker>
      </div>
      <div class="city pickerWrapper">
        <mt-picker :slots="citys" @change="onCityChange" value-key="name"></mt-picker>
      </div>
      <div class="area pickerWrapper">
        <mt-picker :slots="areas" @change="onAreaChange" value-key="name"></mt-picker>
      </div>
    </div>
  </div>
</template>

<script>
import CITY_DATA from "../store/area.json";
export default {
  computed: {
    result() {
      return {
        name: this.province.name + ' ' + this.city.name + ' ' + this.area.name,
        provinceName: this.province.name,
        cityName: this.city.name,
        areaName: this.area.name,
        provinceId: this.province.id,
        cityId: this.city.id,
        areaId: this.area.id
      }
    }
  },
  data() {
    return {
      province: {
        name: '北京',
        id: '110000'
      },
      maskFlag: false,
      city: {
        name: '北京市',
        id: '110100'
      },
      area: {
        name: '东城区',
        id: '110101'
      },
      flag: 0, //最开始省市区那三个picker会初始化调用change事件，但是此时没有省市区数据，因此会报错，
      //所以以这个标识符来控制当时第一次初始化时调用change事件时直接return
      provinces: [
        {
          flex: 1,
          values: this._getProvince(),
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'right'
        }
      ],
      citys: [
        {
          flex: 1,
          values: this._getCity('北京'),
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }
      ],
      areas: [
        {
          flex: 1,
          values: this._getArea('北京', '北京市'),
          className: 'slot1',
          textAlign: 'center'
        }
      ]

    };
  },
  methods: {
    hidePopup() {
      this.$emit('hideAddressPopup');
    },
    getAddressData() {
      this.$emit('getAddress', this.result); //触发父组件的getLinkage事件接收结果数据
    },
    onProvinceChange(picker, values) {
      if (this.flag === 0) {
        return
      }
      let provinceIndex = picker.getSlotValue(0)
      this.province = provinceIndex
      let city = this._getCity(provinceIndex.name)
      this.citys[0].values = city
      this.city = city[0]
    },
    onCityChange(picker, values) {
      if (this.flag === 0) {
        return
      }
      let cityIndex = picker.getSlotValue(0)
      this.city = cityIndex
      let provinceIndex = this.province
      let area = this._getArea(provinceIndex.name, cityIndex.name)
      this.areas[0].values = area
      this.area = area[0]
    },
    onAreaChange(picker, values) {
      if (this.flag === 0) {
        this.flag = 1
        return
      }
      let areaIndex = picker.getSlotValue(0)
      this.area = areaIndex
    },
    //得到省份数据
    _getProvince() {
      let province = []
      CITY_DATA.forEach(function (item, index) {
        let obj = {}
        obj.id = item.id
        obj.name = item.name
        province.push(obj)
      })
      return province
    },
    //根据省份得到城市数据
    _getCity(province) {
      let city = []
      CITY_DATA.forEach((item, index) => {
        if (item.name === province) {
          item.list.forEach((item, index) => {
            let obj = {}
            obj.id = item.id
            obj.name = item.name
            city.push(obj)
            return
          })
        }
      })
      return city
    },
    //根据城市和省份得到区域数据
    _getArea(province, city) {
      let area = []
      CITY_DATA.forEach((item, index) => {
        if (item.name === province) {
          item.list.forEach((data, index) => {
            if (data.name === city) {
              if (data.list) {
                data.list.forEach((result) => {
                  let obj = {}
                  obj.id = result.id
                  obj.name = result.name
                  area.push(obj)
                  return
                })
              } else {
                area.push(data);
              }
            }
          })
        }
      })
      if (area.length == 0) { //如果没有区域数据则第三个picker显示的内容
        area.push({
          name: '',
          id: '000000'
        })
      }
      return area
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.pickerWrapper {
  width: 33.3%;
  float: left;
}
.choose_address_btn_box {
  display: flex;
  justify-content: space-between;
  padding: 5px 5%;
  border-bottom: 1px #eee solid;
}
.choose_address_btn_box span {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  padding: 0 15px;
  border: 1px #ccc solid;
  border-radius: 4px;
  color: #333;
}
</style>