<template>
  <v-card elevation="2" class="mt-1 mx-1">
    <v-card class="mt-2 mb-3 pa-4 text-center">

      <div class="d-flex align-center justify-center">
        <v-carousel v-model="model" style="width: 220px"  height="24px" hide-delimiters >
          <v-carousel-item v-for="(time,index) of timePeriods" :key="index">
            <v-btn :disabled="!time.value" @click="setPeriod(time.value)" plain x-small>{{ time.name }}</v-btn>
          </v-carousel-item>

        </v-carousel>


<!--        <div class="d-flex flex-column">-->
<!--          <v-btn  plain x-small>Текущий месяц</v-btn>-->
<!--          <v-btn plain  x-small>Прошлый месяц</v-btn>-->
<!--          <v-btn plain  x-small>Год</v-btn>-->
<!--        </div>-->
        <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="dates"
            persistent
            width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                class="ml-7"
                style="min-width: 300px "
                v-model="dateRangeText"
                label="Выберите период отчета"
                persistent-hint
                hint=""
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>

          </template>

          <v-date-picker
              v-model="dates"
              no-title
              locale="ru"
              range
          >
            <v-spacer></v-spacer>
            <v-btn
                text
                color="primary"
                @click="modal = false"
            >
              Отмена
            </v-btn>
            <v-btn
                text
                color="primary"
                @click="createReport"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <v-select class="ml-5" @change="createReport" v-model="currentCategory" multiple :items="category">

        </v-select>
        <!--        <v-btn class="ml-6" color="accent" @click="createReport"> Сформировать отчет</v-btn>-->

      </div>


    </v-card>

    <v-data-table
        locale="RU"
        v-if="items"
        :headers="headers"
        :items="items"
        item-key="deal"
    >
      <template v-slot:item.company_name="{ item }">
        <a style="text-decoration: none" target="_blank"
           :href="'https://chirana.bitrix24.ru/crm/company/details/'+ item.company_id+'/'">{{ item.company_name }}</a>
      </template>

      <template v-slot:item.deal_name="{ item }">
        <a style="text-decoration: none" target="_blank"
           :href="'https://chirana.bitrix24.ru/crm/deal/details/'+ item.deal_id+'/'">{{ item.deal_name }}</a>
      </template>
      <template v-slot:item.plan_date="{ item }">
        {{ formatDate(item.plan_date) }}
      </template>
      <template v-slot:item.products="{ item }">
        <span v-for="(prod, indx) in item.products"
              :key="indx">{{ indx === 0 ? prod.PRODUCT_NAME : ', ' + prod.PRODUCT_NAME }}</span>
      </template>
    </v-data-table>

  </v-card>

</template>

<script>
export default {
  name: "Main",
  data: () => {
    return {
      timePeriods: [
        {name: 'Период', value: ''},
        {name: 'Текущий месяц', value: 'month'},
        {name: 'Прошлый месяц', value: 'last_month'},
        {name: 'Текущий год', value: 'year'},
        {name: 'Прошлый год', value: 'last_year'},
      ],
      model: 0,
      currentCategory: [3, 27],
      category: [
        {
          value: 3,
          text: "Авторизация проектов"
        }, {
          value: 27,
          text: "Тендеры"
        }

      ],
      modal: false,
      // dates: [(new Date(new Date('2021-08-17T03:00:00') - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
      dates: [(new Date(new Date('2021-08-01T03:00:00') - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), (new Date(new Date('2021-08-18T03:00:00') - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
      headers: [
        {text: 'Сделка', value: 'deal_name', width: '15%',},
        {
          width: '35%',
          text: 'Компания',
          align: 'start',
          value: 'company_name',
        },

        {text: 'Товары', value: 'products', width: '30%',},
        {text: 'Дата план. оплаты', value: 'plan_date', width: '10%',},

        {
          width: '10%',
          text: 'Сумма',
          value: 'deal_amount'
        },

      ],
      items: [],
      users: [],
      window: undefined,
    }
  },
  computed: {
    dateRangeText() {
      if (!this.dates.length || this.dates [0] === (new Date(new Date('1970-01-01T03:24:00') - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)) {
        return 'Выберите период'
      } else if (this.dates.length === 1) {
        return "Отчёт за " + this.formatDate(this.dates[0]);
      } else {
        if (this.dates[0] > this.dates[1]) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.dates = this.dates.reverse();
        }
        return "Период с " + this.formatDate(this.dates[0]) + " по " + this.formatDate(this.dates[1]);
      }
    }
  },
  filters: {},
  methods: {
    setPeriod (period) {
      console.log(period)
    },

    formatDate(arg) {
      if (!arg) return '';
      let date = new Date(arg);
      let dd = date.getDate();
      if (dd < 10) dd = '0' + dd;
      let mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      let yy = date.getFullYear() % 100;
      if (yy < 10) yy = '0' + yy;
      return dd + '.' + mm + '.' + yy;
    },


    async collectData() {


      this.items = []
      this.$refs?.dialog?.save(this.dates)
      let result = [];

      let startDate;
      let finishDate;
      if (this.dates.length === 1) {
        startDate = new Date(this.dates[0]);
        finishDate = new Date(this.dates[0]);
      } else {
        if (new Date(this.dates[0]) > new Date(this.dates[1])) {
          startDate = new Date(this.dates[1]);
          finishDate = new Date(this.dates[0]);
        } else {
          startDate = new Date(this.dates[0]);
          finishDate = new Date(this.dates[1]);
        }
      }
      startDate.setHours(0, 0, 0);
      finishDate.setHours(23, 59, 59);


      let categories = this.currentCategory.length ? this.currentCategory : [3, 27];
      let stages = [];
      for (let catID of categories) {
        let temp = await this.callMethod("crm.status.list", {filter: {"ENTITY_ID": "DEAL_STAGE_" + catID}});
        let needle;
        if (catID === 3) {
           needle = temp.find((er)=> er.STATUS_ID === 'C3:2').SORT;
        }
        else if (catID === 27) {
           needle = temp.find((er)=> er.STATUS_ID === 'C27:5').SORT;
        }
        else {
          console.log("Неизвестная категория!")
        }
        if (needle) stages = stages.concat(temp.filter ((el)=>  Number(el.SORT) >= Number(needle) ).map((el)=> el.STATUS_ID));
      }



      let filter = {
        '>=DATE_CREATE': startDate.toISOString(),
        '<=DATE_CREATE': finishDate.toISOString(),
        'CATEGORY_ID': categories,
        'STAGE_ID': stages,
      }


      let deals = await this.callMethod("crm.deal.list", {
        order: {"ID": "ASC"},
        filter: filter,
        select: ["ID", "COMPANY_ID", "TITLE", "OPPORTUNITY", 'UF_CRM_1637597981', 'STAGE_ID']
      })


      if (deals.length) {
        let products = (await this.callMethod("crm.productrow.list", {
          filter:
              {
                "OWNER_TYPE": 'D',
                "OWNER_ID": deals.map((el) => el.ID)
              },
          select: ['OWNER_ID', "PRODUCT_ID", "PRODUCT_NAME", "PRICE", "QUANTITY"]
        }))


        let companies = (await this.callMethod("crm.company.list", {
          filter:
              {
                "ID": deals.map((el) => el.COMPANY_ID)
              },
          select: ["ID", "TITLE"]
        }))


        deals.forEach((deal) => {
          let data = {
            plan_date: deal.UF_CRM_1637597981,
            deal_name: deal.TITLE,
            deal_id: deal.ID,
            deal_amount: deal.OPPORTUNITY,
            company_name: companies?.find((comp) => comp.ID === deal.COMPANY_ID)?.TITLE,
            company_id: deal.COMPANY_ID,
            products: products?.filter((prod) => prod.OWNER_ID === deal.ID),
          };
          result.push(data)
        })
      }

      return (result)
    },

    async createReport() {
      let data = await this.collectData();
      this.items = data;


    }
  },


  async created() {
    this.window = window;
    this.createReport()
  }
}
</script>


<style>
.v-window__next, .v-window__prev {
  margin: 0 !important;
  top: auto!important;

  width: 24px;
}
.v-btn--icon.v-size--default {
  height: 20px!important;
  width: 20px!important;

}

.v-window__next i, .v-window__prev i {
  font-size: 17px !important;
  height: 20px!important;
  width: 20px!important;
}

.v-input__prepend-outer{
  margin-top: 8px!important;
}
.v-text-field input{
  padding: 14px 0 8px !important;
}
.v-select__selection--comma{
  padding-top: 4px !important;
  margin-bottom: 4px!important;
}


</style>