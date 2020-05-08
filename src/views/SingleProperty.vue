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
              <img class="image" :src="carousel" />
            </b-carousel-item>
          </b-carousel>
        </div>
      </div>
      <div class="property">
        <b-notification
          :active.sync="isActive"
          v-bind:class="type"
          aria-close-label="Close notification"
        >
          {{ notification }}
        </b-notification>
        <h3 class="title">Details about the House:</h3>
        <hr />
        <div class="columns">
          <div class="column">
            <p class="title is-5">City: {{ property.city }}</p>
            <p class="title is-5">Price per night: {{ property.price }}&euro;</p>
            <p class="title is-5">
              Description: <span class="description">{{ property.name }}</span>
            </p>
          </div>
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
        <!-- <div class="columns">
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
        </div> -->
        <div class="columns">
          <div class="column">
            <p class="title is-5">Total Price: {{ totalPrice }}&euro;</p>
            <form @submit.prevent="addDate">
              <b-modal
                :active.sync="isComponentModalActive"
                has-modal-card
                trap-focus
                :destroy-on-hide="false"
                aria-role="dialog"
                aria-modal
              >
                <modal-form>
                  <Card
                    class="stripe-card"
                    :class="{ complete }"
                    stripe="pk_test_i28ouERO9Dli1OlxDdGM7HFA00hCEjnkrw"
                    :options="stripeOptions"
                    @change="complete = $event.complete"
                  />
                  <div class="buttons is-right">
                    <b-button type="is-warning" native-type="submit"
                      >Submit</b-button
                    >
                  </div>
                </modal-form>
              </b-modal>
              <b-button id="btn" native-type="submit">Continue</b-button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Card } from "vue-stripe-elements-plus";
import firebase from "firebase/app";
import "firebase/firebase-firestore";
import Spinner from "../components/Spinner";
export default {
  name: "SingleProperty",
  components: { Spinner, Card },
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
      type: "",
      isActive: false,
      notification: "",
      reserveDate: [],
      arrDate: [],
      isComponentModalActive: false,
      complete: false,
      options: {}
    };
  },
  computed: {
    totalPrice() {
      return Number(this.property.price) * this.date.length;
    }
  },
  methods: {
    addDate() {
      if (this.totalPrice > 0) {
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
          .then(() => {
            this.isComponentModalActive = true;
          });
      } else {
        this.isActive = true;
        this.type = "is-danger";
        this.notification = "You did not select any dates";
      }
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
.stripe-card {
  width: 500px;
  border: 1px solid grey;
  padding: 13px;
  margin-bottom: 15px;
  color: white;
}
.stripe-card.complete {
  border-color: green;
}
</style>
