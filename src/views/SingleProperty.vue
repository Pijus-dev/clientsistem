<template>
  <div>
    <Spinner :loading="loadingScreen" />
    <Hero :text="property.title + ' ' + 'in' + ' ' + property.city" />
    <div class="container">
      <div class="columns karusele">
        <div class="column">
          <div class="flex-card">
            <b-carousel class="carousel" :indicator="false" :pause-info="false">
              <b-carousel-item v-for="(carousel, i) in property.img" :key="i">
                <img class="image" :src="carousel" />
              </b-carousel-item>
            </b-carousel>
          </div>
        </div>
      </div>
      <div class="property">
        <b-notification
          :active.sync="isActive"
          v-bind:class="type"
          aria-close-label="Close notification"
        >{{ notification }}</b-notification>
        <h3>Details about the House:</h3>
        <i class="fab fa-facebook-f"></i>
        <hr />
        <div class="columns">
          <div class="column">
            <p>City: {{ property.city }}</p>
            <p>Price per night: {{ property.price }}&euro;</p>
            <p>
              Description:
              <span class="description">{{ property.name }}</span>
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
              ></b-datepicker>
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <p>Total Price: {{ totalPrice }}&euro;</p>
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
                  <VCreditCard @change="creditInfoChanged" />
                  <div class="buttons is-right">
                    <b-button type="is-warning" native-type="submit">Submit</b-button>
                  </div>
                </modal-form>
              </b-modal>
              <b-button id="btn" native-type="submit">Continue</b-button>
            </form>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-6">
          <div class="reviews">
            <h3>Reviews:</h3>
            <hr />
            <div v-for="post in posts" :key="post.post" class="columns">
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-content">
                        <p>{{ post.post }}</p>
                        <hr />
                        <p>{{ post.userName }}</p>
                      </div>
                      <div class="media-right">
                        <Star-rating
                          :rating="post.stars"
                          :max-rating="4"
                          :read-only="true"
                          inactive-color="#000"
                          active-color="#FFDF00"
                          v-bind:star-size="15"
                        ></Star-rating>
                        <span>Posted Time:</span>
                        <p>{{ post.postedTime }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <b-field>
              <b-input
                type="textarea"
                v-model="comment"
                placeholder="Share your experience"
                maxlength="400"
              ></b-input>
            </b-field>
            <div class="rating">
              <div>
                Your Rating
                <Star-rating
                  v-model="rating"
                  v-bind:increment="0.5"
                  v-bind:max-rating="4"
                  inactive-color="#000"
                  active-color="#FFDF00"
                  v-bind:star-size="15"
                  @rating-selected="setRating"
                ></Star-rating>
              </div>
            </div>
            <b-button native-type="submit" @click="addComment" type="is-warning">Submit</b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";
import firebase from "firebase/app";
import Hero from "../components/Hero";
import "firebase/firebase-firestore";
import "firebase/auth";
import Spinner from "../components/Spinner";
import VCreditCard from "v-credit-card";
import "v-credit-card/dist/VCreditCard.css";
export default {
  name: "SingleProperty",
  components: { Spinner, VCreditCard, Hero, StarRating },
  data() {
    return {
      property: {
        id: "",
        price: 0
      },
      rating: 0,
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
      name: "",
      cardNumber: "",
      expiration: "",
      security: "",
      comment: "",
      posts: [],
      user: ""
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
        this.isComponentModalActive = true;
        this.date.forEach(item => {
          this.reserveDate.unshift(item.toLocaleDateString("lt"));
        });
        firebase
          .firestore()
          .collection("properties")
          .doc(this.id)
          .update({
            reserveDate: this.reserveDate
          });
      } else {
        this.isActive = true;
        this.type = "is-danger";
        this.notification = "You did not select any dates";
      }
    },
    creditInfoChanged(values) {
      for (const key in values) {
        this[key] = values[key];
      }
    },
    setRating(rating) {
      this.rating = rating;
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
    },
    getName() {
      let user = firebase.auth().currentUser;
      if (user != null) {
        firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then(doc => {
            this.user = doc.data().name;
          })
          .then(() => {
            console.log(this.userName);
          });
      }
    },
    addComment() {
      firebase
        .firestore()
        .collection("properties")
        .doc(this.id)
        .collection("reviews")
        .add({
          comment: this.comment,
          name: this.user,
          rating: this.rating,
          time: new Date(
            firebase.firestore.Timestamp.now().seconds * 1000
          ).toLocaleDateString()
        })
        .then(() => {
          alert("Done");
        });
    },
    getComment() {
      firebase
        .firestore()
        .collection("properties")
        .doc(this.id)
        .collection("reviews")
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            const obj = {
              post: doc.data().comment,
              userName: doc.data().name,
              postedTime: doc.data().time,
              stars: doc.data().rating
            };
            this.posts.push(obj);
          });
        });
    }
  },
  beforeMount() {
    this.get();
    this.getComment();
    this.getName();
  }
};
</script>

<style scoped>
img {
  height: 700px;
  border-radius: 8px;
}
.flex-card {
  display: flex;
  justify-content: center;
}
.property {
  margin: 30px 0;
  padding: 30px;
  box-shadow: 0 0px 2px 2px #eee;
  border-radius: 8px;
}
.reviews {
  background-image: url("../../public/Logo.jpg");
  margin: 30px 0;
  padding: 30px;
  box-shadow: 0 0px 2px 2px #4fa07a;
  border-radius: 8px;
  height: 700px;
  overflow: scroll;
}
.karusele {
  margin-top: 10px;
}
h3 {
  color: rgb(51, 49, 49);
  font-size: 2rem;
}
.reviews p {
  font-size: 1em;
}
p {
  color: rgb(51, 49, 49);
  font-size: 1.35em;
  padding-top: 7px;
  padding-bottom: 7px;
}
.card {
  border-radius: 10px !important;
}
.rating {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
}
.description {
  font-size: 0.8em;
  animation: slide-up 2s;
}
</style>
