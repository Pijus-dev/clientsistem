<template>
  <div class="bg">
    <div class="column">
      <div class="column is-5 main">
        <div class="register">
          <form @submit.prevent="addInfo">
            <b-notification
              :active.sync="isActive"
              v-bind:class="type"
              aria-close-label="Close notification"
            >
              {{ notification }}
            </b-notification>
            <div class="columns">
              <div class="column">
                <b-field label="Name">
                  <b-input
                    v-model="name"
                    placeholder="Name"
                    rounded
                    required
                  ></b-input>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Surname">
                  <b-input
                    v-model="surname"
                    placeholder="Surname"
                    rounded
                    required
                  ></b-input>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-field label="Email">
                  <b-input
                    type="email"
                    placeholder="some@example.com"
                    rounded
                    maxlength="30"
                    required
                    v-model="email"
                  >
                  </b-input>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Password">
                  <b-input
                    type="password"
                    placeholder="Password"
                    rounded
                    maxlength="30"
                    required
                    v-model="password"
                  >
                  </b-input>
                </b-field>
              </div>
            </div>
            <router-link to="/login">Have an account? Log In</router-link>
            <div class="buttons is-right">
              <b-button id="btn" native-type="submit" rounded
                >Register</b-button
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firebase-firestore";
import "firebase/auth";
export default {
  name: "Register",
  data() {
    return {
      name: "",
      surname: "",
      email: "",
      password: "",
      isActive: false,
      type: "",
      notification: ""
    };
  },
  methods: {
    addInfo() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(cred => {
          firebase
            .firestore()
            .collection("users")
            .doc(cred.user.uid)
            .set({
              name: this.name,
              surname: this.surname
            });
        })
        .then(() => {
          (this.isActive = true),
            (this.type = "is-warning"),
            (this.notification =
              "You have successfuly registered, please go to login page");
        });
    }
  }
};
</script>

<style scoped>
.bg {
  background-image: url("https://mail.google.com/mail/u/0?ui=2&ik=e2000575e1&attid=0.1.1&permmsgid=msg-f:1666057099166983737&th=171f061ac35da639&view=fimg&sz=s0-l75-ft&attbid=ANGjdJ9dOqWhR-wRp50PvpCzRhfQgyTPNiRpZ3qmeimt4cSNzEnJONBV7oM1qBhciD2kQwzMdH5lWpmqXYGcrK06XnyEjoh58fASTxZWWwSxppQre_Du_eYyYkKuy14&disp=emb");
  height: 98vh;
  background-size: cover;
  /* opacity: 0.4; */
}
.main {
  margin: 0 auto !important;
}
.register {
  margin: 160px auto !important;
  padding: 30px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 0px 6px 6px #eee;
  background-image: linear-gradient(
    to top,
    #75b585,
    #8dbc89,
    #a3c38e,
    #b8ca96,
    #cbd1a0
  );
}
a{
  color:white !important
}
</style>
