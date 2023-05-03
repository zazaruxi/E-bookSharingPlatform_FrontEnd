<template>

  <q-tooltip :offset="[0, 8]">QSpinnerGears</q-tooltip>
  <div class="fullscreen bg-white text-secondary text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        <q-spinner-gears
          color="secondary"
          size="200px"
        />
      </div>

      <div class="text-h2" style="opacity:.4">
        Something Error here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="secondary"
        text-color="white"
        unelevated
        @click="goto()"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import Router from "src/router";
export default {
  name: "Error",
  setup(){
    const goto=()=>{
      Router.push(
        '/home'
      )
    }
    return{
      goto
    }
  }
}
</script>

<style scoped>

</style>
