<template>
  <section>
    <div class="container">
      <b-navbar>
        <template slot="brand">
          <b-navbar-item tag="router-link" :to="{ path: '/' }">
            <img src="../public/logo3.png" />
          </b-navbar-item>
        </template>

        <template slot="end">
          <b-navbar-item>
            <router-link to="/">Properties</router-link>
          </b-navbar-item>
        </template>
      </b-navbar>
    </div>
    <router-view />
  </section>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@300&display=swap");
* {
  font-family: "Rubik", sans-serif !important;
}
.navbar-item img {
  max-height: 60px !important;
}
a {
  color: rgb(66, 134, 66) !important;
  font-size: 1em;
}
h1 {
  color: white !important;
  font-size: 2rem !important;
}
.text {
  background-color: rgba(24, 143, 77, 0.55);
}
#btn {
  color: rgb(66, 134, 66) !important;
  border-color: rgb(66, 134, 66) !important;
}
#btn:hover {
  color: white !important;
  background-color: rgb(66, 134, 66) !important ;
}
</style>
