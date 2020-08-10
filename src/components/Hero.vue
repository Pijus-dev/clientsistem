<template>
  <section class="hero text">
    <div class="hero-body">
      <div class="container slide-left">
        <h1>{{ text }}</h1>
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

<style scoped>
@keyframes slide-left {
  from {
    margin-left: 100%;
  }

  to {
    margin-left: 0%;
  }
}
.slide-left h1 {
  animation: slide-left 2s;
}
</style>
