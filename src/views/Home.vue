<template>
  <div>
    <Spinner v-bind:loading="loadingScreen" />
    <section class="hero text">
      <div class="hero-body">
        <div class="container">
          <h1>
            Places to Stay
          </h1>
        </div>
      </div>
    </section>
    <div class="container">
      <div class="search">
        <b-field label="Find Your House By Title">
          <b-autocomplete
            rounded
            v-model="title"
            placeholder="e.g. Apartments in Vilnius"
          >
          </b-autocomplete>
        </b-field>
      </div>
      <div class="selected">
        <b-field label="Select Your City">
          <b-select placeholder="Select a City" v-model="city" rounded>
            <option v-for="city in filter" :key="city.id">{{ city }}</option>
          </b-select>
        </b-field>
      </div>
      <div class="columns is-multiline properties">
        <div
          v-for="property in filterTitle"
          :key="property.id"
          class="column is-4"
        >
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img
                  :src="property.img"
                  @click="redirect(property.id)"
                  :alt="property.text"
                />
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <p class="title is-6">{{ property.text }}</p>
                  <p class="title is-4">{{ property.city }}</p>
                </div>
              </div>
              <hr />
              <div class="content">
                {{ property.name }}
                <p @click="redirect(property.id)">readMore</p>
              </div>
            </div>
            <div class="buttons is-right">
              <b-button @click="redirect(property.id)" id="btn"
                >Rent {{ property.price }}$</b-button
              >
            </div>
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
import uniq from "lodash/uniq";
export default {
  name: "Home",
  components: { Spinner },
  data() {
    return {
      properties: [],
      title: "",
      city: "",
      loadingScreen: true
    };
  },
  computed: {
    filterTitle() {
      return this.properties.filter(value => {
        return (
          value.text.toLowerCase().includes(this.title.toLowerCase()) &&
          value.city.toLowerCase().includes(this.city.toLowerCase())
        );
      });
    },
    filter() {
      return uniq(this.properties.map(({ city }) => city));
    }
  },
  methods: {
    get() {
      firebase
        .firestore()
        .collection("properties")
        .get()
        .then(data => {
          data.forEach(product => {
            const obj = {
              id: product.id,
              text: product.data().text,
              price: product.data().price,
              city: product.data().city,
              name: this.cutText(product.data().name),
              img: product.data().img[0]
            };
            this.properties.push(obj);
          });
        })
        .then(() => {
          this.loadingScreen = false;
        });
    },
    cutText(string) {
      if (string.length > 200) {
        string = string.substring(0, 200) + "...";
        return string;
      } else {
        return string;
      }
    },
    redirect(id) {
      this.$router.push("property/id/" + id);
    }
    // filter() {
    //   return (this.cities = [...new Set(this.properties)]);
    // }
  },
  beforeMount() {
    this.get();
  }
};
</script>
<style scoped>
.properties {
  margin-top: 15px;
}
.card {
  border-radius: 8px !important;
}
img {
  border-radius: 8px !important;
}
img:hover {
  opacity: 0.6;
  cursor: pointer;
}
p {
  color: rgb(66, 134, 66) !important;
  cursor: pointer;
}
#btn {
  color: rgb(66, 134, 66) !important;
  border-color: rgb(66, 134, 66) !important;
  margin-right: 15px;
  margin-bottom: 15px;
}
#btn:hover {
  color: white !important;
  background-color: rgb(66, 134, 66) !important ;
}
.search {
  margin-top: 10px;
}
.selected {
  margin-top: 13px;
}
</style>
