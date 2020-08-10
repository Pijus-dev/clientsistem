<template>
  <div>
    <Hero text="Profile Details" />
    <div class="container">
      <div class="columns">
        <div class="column is-offset-one-quarter is-half">
          <div class="profile">
            <form @submit.prevent="editInfo">
              <div class="columns">
                <div class="column">
                  <b-field label="Name">
                    <b-input v-model="name" :placeholder="userName"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Surname">
                    <b-input v-model="surname" :placeholder="userSurname"></b-input>
                  </b-field>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <b-field label="Email">
                    <b-input disabled :placeholder="userEmail"></b-input>
                  </b-field>
                </div>
              </div>
              <div class="buttons is-right">
                <b-button id="btn" native-type="submit">Edit</b-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hero from "../components/Hero";
import firebase from "firebase/app";
import "firebase/firebase-firestore";
import "firebase/auth";
export default {
  name: "Profile",
  data() {
    return {
      userName: "",
      userSurname: "",
      userEmail: "",
      name: "",
      surname: "",
      email: ""
    };
  },
  components: { Hero },
  methods: {
    getName() {
      let user = firebase.auth().currentUser;
      if (user != null) {
        firebase
          .firestore()
          .collection("admin")
          .doc(user.uid)
          .get()
          .then(doc => {
            this.userName = doc.data().name;
            this.userSurname = doc.data().surname;
          });
      }
    },
    editInfo() {
      let currentUser = firebase.auth().currentUser;
      firebase
        .firestore()
        .collection("admin")
        .doc(currentUser.uid)
        .update({
          name: this.name,
          surname: this.surname
        })
        .then(() => {
          this.$buefy.toast.open({
            message: "Info was updated!",
            type: "is-success"
          });
        });
    }
  },
  beforeMount() {
    this.getName();
    this.userEmail = firebase.auth().currentUser.email;
  }
};
</script>

<style scoped>
.profile {
  margin: 30px 0;
  padding: 30px;
  box-shadow: 0 0px 4px 4px rgb(189, 230, 214);
  border-radius: 8px;
  background-image: url("../../public/Logo.jpg");
  background-size: cover;
}
.profile h2 {
  color: rgb(117, 114, 114);
  font-size: 1.8rem;
}
</style>