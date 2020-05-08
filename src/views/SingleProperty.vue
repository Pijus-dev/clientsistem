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
            <b-field label="Select a date">
              <b-datepicker
                placeholder="Type or select a date..."
                editable
                :unselectable-dates="arrDate"
                :min-date="minDate"
                v-model="date"
                multiple
              >
              </b-datepicker>
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <p class="title is-5">Total Price: {{ totalPrice }}</p>
            <form @submit.prevent="addDate">
              <b-button native-type="submit" id="btn">Continue</b-button>
            </form>
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
        price: 0
      },
      id: this.$route.params.id,
      loadingScreen: true,
      minDate: new Date(),
      date: [],
      reserveDate: [],
      arrDate: []
    };
  },
  computed: {
    totalPrice() {
      return Number(this.property.price) * this.date.length;
    }
  },
  methods: {
    addDate() {
      this.date.forEach(item => {
        this.reserveDate.unshift(item.toLocaleDateString("lt"));
      });
      firebase
        .firestore()
        .collection("properties")
        .doc(this.id)
        .update({
          reserveDate: this.reserveDate
        })
        .then(() => alert("done"));
    },
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
          data.data().reserveDate
            ? (this.reserveDate = data.data().reserveDate)
            : (this.reserveDate = []);
        })
        .then(() => {
          this.reserveDate.forEach(item => {
            this.arrDate.push(new Date(item));
          });
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
