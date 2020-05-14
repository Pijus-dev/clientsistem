<template>
  <section class="hero text">
    <div class="hero-body">
      <div class="container">
        <h1>
          {{ text }}
        </h1>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Hero",
  props: {
    text: String
  }
};
</script>

<style></style>
