<template>
  <div>
    <Spinner :loading="loadingScreen" />
    <section class="hero text">
      <div class="hero-body">
        <div class="container">
          <h1>{{ property.title }} in {{ property.city }}</h1>
        </div>
      </div>
    </section>
    <div class="container">
      <div class="columns karusele">
        <div class="column">
          <b-carousel class="carousel" :indicator="false" :pause-info="false">
            <b-carousel-item v-for="(carousel, i) in property.img" :key="i">
              <img :src="carousel" />
            </b-carousel-item>
          </b-carousel>
        </div>
      </div>
      <div class="property">
        <h3 class="title">Details about the House:</h3>
        <hr />
        <div class="columns">
          <div class="column">
            <p class="title is-5">City: {{ property.city }}</p>
            <p class="title is-5">Price per night: {{ property.price }}</p>
            <p class="title is-5">
              Description: <span class="description">{{ property.name }}</span>
            </p>
          </div>
          <div class="column"></div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="table is-bordered is-hoverable">
              <table>
                <thead>
                  <tr>
                    <th>Available Dates</th>
                    <th>Book</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2020 - 05 - 20</td>
                    <td>
                      <b-checkbox></b-checkbox>
                    </td>
                  </tr>
                  <tr>
                    <td>2020 - 10 - 05</td>
                    <td>
                      <b-checkbox></b-checkbox>
                    </td>
                  </tr>
                  <tr>
                    <td>2020 - 05 - 20</td>
                    <td>
                      <b-checkbox></b-checkbox>
                    </td>
                  </tr>
                  <tr>
                    <td>2020 - 10 - 05</td>
                    <td>
                      <b-checkbox></b-checkbox>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <p class="title is-5">Total Price:</p>
            <b-button @click="redirect(property.id)" id="btn"
              >Continue</b-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firebase-firestore";
import Spinner from "../components/Spinner";
export default {
  name: "SingleProperty",
  components: { Spinner },
  data() {
    return {
      property: {
        id: "",
        price: undefined
      },
      id: this.$route.params.id,
      loadingScreen: true
    };
  },
  methods: {
    get() {
      firebase
        .firestore()
        .collection("properties")
        .doc(this.id)
        .get()
        .then(data => {
          (this.property.id = data.id),
            (this.property.title = data.data().text),
            (this.property.img = data.data().img),
            (this.property.price = data.data().price),
            (this.property.city = data.data().city);
          this.property.name = data.data().name;
        })
        .then(() => {
          this.loadingScreen = false;
        });
    }
  },
  beforeMount() {
    this.get();
  }
};
</script>

<style scoped>
img {
  height: 560px !important;
  width: 100% !important;
}
.property {
  margin: 30px 0;
  padding: 30px;
  box-shadow: 0 0px 2px 2px #eee;
  border-radius: 8px;
}
.description {
  font-size: 0.8em;
}
/* .bookings {
  display: flex;
  justify-content: center;
} */
.dates {
  padding: 10px !important;
  width: 100% !important;
}
tr,
td,
th {
  padding: 15px !important;
}
th,
td {
  text-align: center !important;
}
.table {
  border-radius: 10% !important;
}
table {
  width: 70% !important;
  /* margin: auto; */
}
.karusele {
  margin-top: 10px;
}
</style>
