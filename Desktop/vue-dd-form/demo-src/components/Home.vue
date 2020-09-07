<template>
  <div class="home">
    <ul class="switcher">
      <li><a class="switcher__item" :class="{'switcher__item--active' : active === types.BASIC }" @click="select(types.BASIC)">Basic</a></li>
      <li><a class="switcher__item" :class="{'switcher__item--active' : active === types.ADVANCED }" @click="select(types.ADVANCED)">Advanced</a></li>
      <li><a class="switcher__item" :class="{'switcher__item--active' : active === types.DYNAMIC }" @click="select(types.DYNAMIC)">Dynamic values</a></li>
      <li><a class="switcher__item" :class="{'switcher__item--active' : active === types.CUSTOM }" @click="select(types.CUSTOM)">Custom views</a></li>
      <li><a class="switcher__item" :class="{'switcher__item--active' : active === types.WRAPPERS }" @click="select(types.WRAPPERS)">Wrappers (beta)</a></li>
    </ul>
    <div class="preview-code">
      <div class="preview-code__box">
        <h3><span class="highlight">1.</span> descriptions</h3>
        <vue-code-highlight language="js" v-if="renderCode">
          <pre>{{ JSON.stringify(descriptions[active], null, 4) }}</pre>
        </vue-code-highlight>
      </div>
      <div class="preview-code__box">
        <h3><span class="highlight">2.</span> data (changes in real-time)</h3>
        <vue-code-highlight language="js" v-if="renderCode">
          <pre>{{ JSON.stringify(output[active], null, 4) }}</pre>
        </vue-code-highlight>
      </div>
    </div>
    <div class="preview-form">
      <h3>
        <span class="highlight">3.</span> form
      </h3>

      <!-- EXAMPLE 1: BASIC -->
      <dd-form
        v-if="renderForm && active === types.BASIC"
        class="preview-form__interface preview-form__interface--basic"
        :descriptions="descriptions.basic"
        :data="output.basic"
        @submit="submit"
        @change="change"
      >
      </dd-form>

      <!-- EXAMPLE 2: ADVANCED -->
      <dd-form
        v-else-if="renderForm && active === types.ADVANCED"
        class="preview-form__interface preview-form__interface--advanced"
        :descriptions="descriptions.advanced"
        :data="output.advanced"
        @submit="submit"
        @change="change"
      >
      </dd-form>

      <!-- EXAMPLE 3: DYNAMIC -->
      <dd-form
        v-else-if="renderForm && active === types.DYNAMIC"
        class="preview-form__interface preview-form__interface--dynamic"
        :descriptions="descriptions.dynamic"
        :data="output.dynamic"
        :functions="functions"
        @submit="submit"
        @change="change"
      >
      </dd-form>

      <!-- EXAMPLE 4: CUSTOM -->
      <dd-form
        v-else-if="renderForm && active === types.CUSTOM"
        class="preview-form__interface preview-form__interface--custom"
        :descriptions="descriptions.custom"
        :data="output.custom"
        :views="customViews"
        @submit="submit"
        @change="change"
      >
      </dd-form>

      <!-- EXAMPLE 5: WRAPPERS -->
      <dd-form
        v-else-if="renderForm && active === types.WRAPPERS"
        class="preview-form__interface preview-form__interface--wrappers"
        :descriptions="descriptions[active]"
        :data="output[active]"
        @submit="submit"
        @change="change"
      >
      </dd-form>
    </div>
    <p class="copyright">© Designed & develped by Marek Mensa
    </p>
  </div>
</template>

<script>
import { component as VueCodeHighlight } from 'vue-code-highlight';
import compact from "lodash/compact";
import "vue-code-highlight/themes/prism-tomorrow.css";
import "vue-code-highlight/themes/window.css";
import descriptionsBasic from '../assets/descriptions-basic.json';
import descriptionsAdvanced from '../assets/descriptions-advanced.json';
import descriptionsDynamic from '../assets/descriptions-dynamic.json';
import descriptionsCustom from '../assets/descriptions-custom.json';
import descriptionsWrappers from '../assets/descriptions-wrappers.json';
import usernameGenerator from '../components/UsernameGenerator.vue';

export default {
  name: 'Home',
  props: {
  },
  methods: {
    select(type) {
      this.active = type;
      this.forceCodeRerender();
      this.forceFormRerender();
    },
    submit({ data }) {
      this.output[this.active] = data;
      this.forceCodeRerender();
    },
    change({  path, data }) {
      this.output[this.active] = data;
      this.forceCodeRerender();
      if (path == 'limitLogins') this.forceFormRerender();
    },
    firstUpper(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    forceCodeRerender() {
      this.renderCode = false;

      this.$nextTick(() => {
        this.renderCode = true;
      });
    },
    forceFormRerender() {
      this.renderForm = false;

      this.$nextTick(() => {
        this.renderForm = true;
      });
    },
    splitPath(path) {
      return compact(path.split(/[.[\]]/));
    },
    userIndex({ path }) {
      const index = Number(this.splitPath(path)[1]);
      return index + 1;
    },
    addable() {
      return !this.output.dynamic.users || this.output.dynamic.users.length < 5;
    },
    limitNotSelected() {
      return this.output.dynamic.limitLogins === false;
    },
    userTypes() {
      return ['basic', 'anonymous', 'admin'];
    }
  },
  data() {
    return {
      types: {
        BASIC: 'basic',
        ADVANCED: 'advanced',
        DYNAMIC: 'dynamic',
        CUSTOM: 'custom',
        WRAPPERS: 'wrappers',
      },
      active: '',
      customViews: {
        generator: usernameGenerator,
      },
      output: {
        basic: {
          "title": "Parasite",
          "description": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
          "genres": [],
          "language": "Korean"
        },
        advanced: {},
        dynamic: {},
        custom: {},
        wrappers: {},
      },
      descriptions: {
        basic: descriptionsBasic,
        advanced: descriptionsAdvanced,
        dynamic: descriptionsDynamic,
        custom: descriptionsCustom,
        wrappers: descriptionsWrappers,
      },
      functions: {
        '_addable': this.addable,
        '_limitNotSelected': this.limitNotSelected,
        '_userTypes': this.userTypes,
        '_userIndex': this.userIndex,
      },
      renderCode: true,
      renderForm: true,
    };
  },
  components: {
    VueCodeHighlight,
  },
  computed: {
  },
  created() {
    this.active = this.types.BASIC;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.copyright {
  text-align: left;
  padding-left: 20px;
  color: #959595;
} 
.highlight {
  color: #42b983;
}
.switcher {
  &__item {
    cursor: pointer;
    color: #2c3e50;
    transition: 0.3s all ease;
    font-size: 18px;
    padding: 0 20px;
    &--active, &:hover {
      color: #42b983;
      text-decoration: underline;
    }
  }
}
.preview-form {
  width: 100%;
  background: white;
  padding: 40px 0;
  margin-top: 40px;

  &__interface {
    text-align: left;
    max-width: 700px;
    margin: 0 auto;
    &--wrappers {
      max-width: 100% !important;
      .view--root > .view--branch {
        flex-direction: row !important;
        flex-wrap: wrap !important;
        justify-content: left;
      }
      .row--boxed {
        margin-right: 60px;
      }
      .row--boxed .view__wrapper, .row--boxed .view__container {
        width: 100%;
      }
      .milestones {
        margin-top: 60px;
      }
    }
  }
}
.preview-code {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 60px;
  &__box {
    width: 42.5%;
  }
}
</style>
