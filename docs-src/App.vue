<template>
  <div id="app">
    <div class="header">
      <img alt="Vue logo" src="./assets/logo-vue.png" class="header__logo">
      <h1 class="header__title"><strong>vue-dd-form</strong> demo</h1>
      <div class="header__spacer"></div>
      <a href="https://github.com/marekmensa/vue-dd-form" class="header__button-wrapper" target="_blank">
        <button class="header__button">View code
          <GithubIcon class="header__button-icon"></GithubIcon>
        </button>
      </a>
    </div>
    <Home />
  </div>
</template>

<script>
import Home from './components/Home.vue';
import GithubIcon from './assets/logo-github.svg';


export default {
  name: 'App',
  components: {
    Home,
    GithubIcon,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
body {
  margin: 0;
  background: #eeeeee;
}
pre {
  display: block !important;
  max-height: 350px;
  margin-top: 20px !important;
}
.header {
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  
  &__logo {
    width: 40px;
    height: 40px;
  }

  &__title {
    padding: 0 20px;
    font-weight: 200;
    white-space: nowrap;
    strong {
    font-weight: 600;
    }
  }
  
  &__spacer {
    width: 100%;
  }
  
  &__button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: none;
    font-size: 1rem;
    height: 2.5em;
    line-height: 1.5;
    cursor: pointer;
    padding-bottom: calc(.5em - 1px);
    padding-left: 1em;
    padding-right: 1em;
    padding-top: calc(.5em - 1px);
    text-align: center;
    white-space: nowrap;
    background-color: #0a0a0a;
    color: #fff;
  }
  &__button-icon {
    width: 30px;
    margin-left: 5px;
  }

  &__button-wrapper {
    text-decoration: none;
  }
}
</style>
