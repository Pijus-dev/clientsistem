<template>
  <div class="bg">
    <div class="column">
      <div class="column is-5 main">
        <div class="register">
          <form @submit.prevent="login">
            <b-notification
              :active.sync="isActive"
              v-bind:class="type"
              aria-close-label="Close notification"
            >
              {{ notification }}
            </b-notification>
            <div class="columns">
              <div class="column">
                <b-field label="Email">
                  <b-input
                    v-model="email"
                    placeholder="Email"
                    rounded
                    required
                  ></b-input>
                </b-field>
              </div>
            </div>
            <div class="columns">
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
            <div class="buttons is-right">
              <b-button id="btn" native-type="submit" rounded>Login</b-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      isActive: false,
      type: "",
      notification: ""
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push("/");
        })
        .catch(e => {
          (this.isActive = false),
            (this.type = "is-danger"),
            (this.notification = e.message);
        });
    }
  }
};
</script>

<style>
.bg {
  background-image: url("https://mail.google.com/mail/u/0?ui=2&ik=e2000575e1&attid=0.1.1&permmsgid=msg-f:1666057099166983737&th=171f061ac35da639&view=fimg&sz=s0-l75-ft&attbid=ANGjdJ9dOqWhR-wRp50PvpCzRhfQgyTPNiRpZ3qmeimt4cSNzEnJONBV7oM1qBhciD2kQwzMdH5lWpmqXYGcrK06XnyEjoh58fASTxZWWwSxppQre_Du_eYyYkKuy14&disp=emb");
  height: 98vh;
  background-size: cover;
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
</style>
