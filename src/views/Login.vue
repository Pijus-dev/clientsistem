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
            >{{ notification }}</b-notification>
            <div class="columns">
              <div class="column">
                <b-field label="Email">
                  <b-input v-model="email" placeholder="Email" rounded required></b-input>
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
                  ></b-input>
                </b-field>
              </div>
            </div>
            <div class="buttons is-right">
              <b-button id="btn" native-type="submit" rounded>Login</b-button>
            </div>
          </form>
          <p @click="prompt" class="has-text-white">Forgot password?</p>
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
          (this.isActive = true),
            (this.type = "is-danger"),
            (this.notification = e.message);
        });
    },
    prompt() {
      this.$buefy.dialog.prompt({
        message: `Enter your Email`,
        inputAttrs: {
          placeholder: "some@example.com",
          maxlength: 30,
          value: ""
        },
        trapFocus: true,
        onConfirm: value => {
          let auth = firebase.auth();

          auth
            .sendPasswordResetEmail(value)
            .then(function() {
              alert("Email sent");
            })
            .catch(function(error) {
              alert(error.message);
            });
        }
      });
    },
    passwordReset() {
      let auth = firebase.auth();

      auth
        .sendPasswordResetEmail(this.email)
        .then(function() {
          alert("Email sent");
        })
        .catch(function(error) {
          alert(error.message);
        });
    }
  }
};
</script>

<style>
.bg {
  background-image: url("../../public/Logo.jpg");
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
p {
  cursor: pointer;
}
</style>
