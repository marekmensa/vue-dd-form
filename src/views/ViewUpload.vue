<template>
  <label class="input-upload">
    <div class="input-upload__label" v-text="label" v-if="label"></div>
    <div class="input-upload__area">
      <icon-upload v-if="!imagePath" class="input-upload__icon"></icon-upload>
      <div class="input-upload__image-wrapper">
        <img v-if="imagePath && isImage" class="input-upload__image" :src="imagePath">
        <icon-file class="input-upload__icon" v-else-if="imagePath"></icon-file>
      </div>
      <input class="input-upload__input" type="file" name="image" @change="upload($event.target.name, $event.target.files)">
    </div>
  </label>
</template>
<script>
  import axios from 'axios';
  import iconUpload from '../assets/icon-upload.vue';
  import iconFile from '../assets/file.vue';

  export default {
    data() {
      return {
        label: this.description.label,
      };
    },
    computed: {
      imagePath() {
        return this.value || null;
      },
      extension() {
        return this.imagePath ? this.imagePath.split('.').pop().split('?')[0] : null;
      },
      isImage() {
        const imageFormats = ['png', 'jpg', 'jpeg', 'gif'];
        return this.extension && imageFormats.indexOf(this.extension.toLowerCase()) !== -1;
      },
    },
    props: [
      'path',
      'value',
      'description',
    ],
    methods: {
      update(e) {
        this.$emit('change', {
          path: this.path,
          value: e.target.value,
        });
      },
      upload(name, fileList) {
        const formData = new FormData();
        if (fileList.length) {
          formData.append(name, fileList[0], fileList[0].name);
          formData.append('payload', JSON.stringify(this.description.payload));
          axios.post(this.description.endpoint, formData).then(({ data }) => {
            if (data.status === 'success') {
              const path = data.data[0].path;
              this.$emit('change', { path: this.path, value: path });
              this.$store.dispatch('notifications/push', {
                key: 'uploaded',
                type: 'success',
              });
            } else {
              this.$store.dispatch('notifications/push', {
                key: data.message,
                type: 'failure',
              });
            }
          }).catch(() => {
            this.$store.dispatch('notifications/push', {
              key: 'errorTryAgain',
              type: 'failure',
            });
          });
        }
      },
    },
    components: {
      iconUpload,
      iconFile,
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .input-upload {
    cursor: pointer;

    &__area {
      width: 100%;
      height: 0;
      padding-bottom: 50px;
      border: 1px dashed #d8d8d8;;
      position: relative;
    }

    &__icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 30px;
    }

    &__label {
      text-align: left;
      margin-bottom: 10px;
      color: #797979;
      font-size: 16px;
      font-weight: 300;
    }

    &__image-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    &__image {
      max-width: 100%;
      max-height: 100%;
    }

    &__input {
      display: none;
    }
  }
</style>
