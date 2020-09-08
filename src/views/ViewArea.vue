<template>
  <div class="input-area__wrapper" @mouseenter="hover=true" @mouseleave="hover=false">
    <div class="input-area__description" v-if="label">
      <label class="input-area__label" v-text="label"></label>
    </div>
    <vue-editor
      v-if="html"
      v-model="content"
      :editor-toolbar="customToolbar"
      @input="updateHtml"
    ></vue-editor>
    <textarea
      class="input-area"
      :value="value"
      @input="update"
      v-else
    ></textarea>
  </div>
</template>
<script>
import { VueEditor } from 'vue2-editor';
import { mapGetters } from 'vuex';
import axios from 'axios';
import dompurify from 'dompurify';

class UploadAdapter {
  constructor(loader, profile) {
    this.loader = loader;
    this.profile = profile;
  }
  // eslint-disable-next-line arrow-body-style
  upload() {
    // eslint-disable-next-line arrow-body-style
    return this.loader.file.then((uploadedFile) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', uploadedFile);
        formData.append('id', this.profile.email);
        formData.append('uid', this.profile.uid);
        axios
          .post('/api/images', formData)
          .then(({ data }) => {
            if (data.status === 'success') {
              resolve({ default: data.data[0].path });
            } else {
              reject(data.message);
            }
          })
          .catch(() => {
            reject();
          });
      });
    });
  }
  // eslint-disable-next-line class-methods-use-this
  abort() {}
}

export default {
  props: ['path', 'value', 'description'],
  computed: {
    ...mapGetters('user', ['profile']),
  },
  data() {
    return {
      hover: false,
      content: '',
      label: this.description.label,
      html: this.description.html,
      customToolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }]],
    };
  },
  created() {
    this.content = this.value;
  },
  components: {
    VueEditor,
  },
  methods: {
    dompurify,
    clean(input) {
      return dompurify.sanitize(input);
    },
    update(e) {
      this.$emit('change', {
        path: this.path,
        value: e.target.value,
      });
    },
    updateHtml() {
      this.$emit('change', {
        path: this.path,
        value: this.clean(this.content),
      });
    },
    CustomUploadAdapterPlugin(editor) {
      // eslint-disable-next-line arrow-body-style,no-param-reassign
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader, this.profile);
      };
    },
  },
};

</script>
<style lang="scss" rel="stylesheet/scss" scoped>

.input-area {
  outline: none;
  border: 1px solid #d8d8d8 !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  background-color: #ffffff;
  height: 150px;
  flex-grow: 1;
  padding: 10px !important;
  font-family: inherit;
  transition: 0.3s;
  font-size: 16px;
  font-weight: 300;
  height: 200px;
  color: #000000;
  letter-spacing: 1px;
  overflow: hidden;
  overflow-y: scroll;
  resize: none;

  strong {
    font-weight: 500;
  }

  p {
    margin: 0;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
    cursor: default;
  }

  &__description {
    margin-bottom: 10px;
  }

  &__label {
    color: #797979;
    font-size: 16px;
    height: auto;
    font-weight: 300;
    letter-spacing: 0.15px;
    position: relative;

    &::after {
      color: #ffd012;
      line-height: 1;
      position: absolute;
      right: 0;
      top: 0;
      transform: translate(130%, -10%);
    }
  }
}

 .ql-container .ql-snow {
    border-color: #d8d8d8 !important;
  }

  .ql-editor {
    font-family: 'Open Sans', sans-serif;
    font-weight: 200;
}
</style>