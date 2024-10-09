<script setup lang="ts">
import { ref } from "vue";
import Demo from "./components/demo1.vue";

const editorValue = ref<string>("please input value...");
</script>

<template>
  <header>
    <h1>Tinymce test</h1>
  </header>
  <main>
    <Demo v-model:value="editorValue" />
    <br />

    <section>
      <h2>Editor content(string) :</h2>
      <br />
      <div>
        {{ editorValue }}
      </div>
    </section>
  </main>
  <!-- <footer></footer> -->
</template>
