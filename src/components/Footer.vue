<template>
  <footer  class="column bg-black">
    <q-tabs align="left" class="bg-secondary">
      <q-route-tab to="/home" label="Home"/>|
      <q-route-tab to="/book" label="Classify"/>|
      <q-route-tab to="/rank" label="Rank"/>|
      <q-route-tab to="/author" label="Author"/>|
    </q-tabs>
    <div style="height: 150px">


    </div>
  </footer>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Footer"
};
</script>

<style scoped>

</style>
