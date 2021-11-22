<template>
  <v-app>
    <v-overlay :value="isPreloader">
      <span>Идет формирование отчёта...</span>
    </v-overlay>
    <v-card hover color="primary" class="text-center">
      <h2 @click="window.location.reload(false)" style="color: white; padding: 10px 0">Отчёт по планируемым платежам</h2>
      <!--      <h2 style="color: white">Отчёт</h2>-->
<!--      <v-tabs dark background-color="primary" show-arrows centered>-->
<!--        <v-tab to="/main">-->
<!--          Планируемые платежи-->
<!--        </v-tab>-->
<!---->
<!--      </v-tabs>-->
    </v-card>
    <v-main>
      <router-view/>
    </v-main>

  </v-app>
</template>

<script>


export default {
  name: 'App',

  components: {},
  async created() {

    this.$eventBus.$on("preloader", () => this.isPreloader = !this.isPreloader);
    // eslint-disable-next-line no-undef
    // BX24.callMethod('entity.delete', {'ENTITY': 'SETTINGS'})
    // eslint-disable-next-line no-undef



  },
  methods: {},
  computed: {
    window: () => window,
  },
  data: () => ({
    isPreloader: false,
  }),
};
</script>
<style>
body, html {
  overflow-y: auto !important;
}

.v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
}

</style>