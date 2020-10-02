<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<!-- eslint-disable vue/require-v-for-key -->
<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div
    class="view__container"
    :class="{'view__container--removable' : isRemovable}"
    @mouseenter="easeHover(true)"
    @mouseleave="easeHover(false)"
  >
    <!-- SLOT: DRAG BUTTON -->
    <div class="button--drag" :style="elementStyles[!hover ? 'hidden' : 'none']">
      <slot name="drag-button"></slot>
    </div>
    <!-- VIEW: BRANCH (GROUP) -->
    <div class="view view--branch" :class="description.class" v-if="isGroup && !isHidden">
      <component
        :is="allViews['group.headline']"
        v-if="description.label"
      >{{ description.label }}</component>
      <div class="view__wrapper" v-for="(wrapper, index) in groupWrappers" :class="wrapper">
        <dd-form-view
          v-for="(node, index) in groupNodes"
          v-if="isViewInWrapper(node, wrapper)"
          :key="viewKeys[index]"
          :descriptions="descriptions"
          :data="dataValue[node]"
          :path="groupNodePath(node)"
          :functions="functions"
          :views="views"
          :lang="lang"
          @change="update"
        ></dd-form-view>
      </div>
    </div>
    <!-- VIEW: BRANCH (COLLECTION) -->
    <div class="view view--branch" :class="description.class" v-else-if="isCollection && !isHidden">
      <component
        :is="allViews['collection.headline']"
        v-if="description.label"
      >{{ description.label }}</component>
      <draggable
        class="view__wrapper"
        ghost-class="ghost"
        :class="{'view__wrapper--draggable': isDraggable}"
        :disabled="!isDraggable"
        :options="draggableOptions"
        v-model="dataValue"
        @change="updateCollection"
      >
        <dd-form-view
          v-for="(value, index) in dataValue"
          :key="viewKeys[index]"
          :descriptions="descriptions"
          :data="value"
          :path="collectionNodePath(index)"
          :functions="functions"
          :views="views"
          :lang="lang"
          @change="update"
        >
         <component
            :is="allViews['collection.button-drag']"
            :text="lang['drag']"
            slot="drag-button"
            :show="isDraggable"
          ></component>
          <component
            @remove="remove(path, index)"
            :is="allViews['collection.button-remove']"
            :text="lang['remove']"
            slot="remove-button"
            :show="isDeletable"
          ></component>
        </dd-form-view>
      </draggable>
      <component
        class="button--add"
        :is="allViews['collection.button-add']"
        :text="lang['add']"
        @add="add(path, descriptionForNextChild(path, dataValue.length))"
        v-if="isAddable && isNextChildDescribed"
      ></component>
    </div>
    <!-- VIEW: LEAF -->
    <div class="view view--leaf" :class="description.class" v-else-if="isLeaf && !isHidden">
      <component
        v-if="allViews[description.view]"
        :is="allViews[description.view]"
        :value="dataValue"
        :description="description"
        :path="path"
        @change="update"
      ></component>
    </div>
    <!-- SLOT: REMOVE BUTTON -->
    <div class="button--remove" :style="elementStyles[!hover ? 'hidden' : 'none']">
      <slot name="remove-button"></slot>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import set from 'lodash/set';
import unset from 'lodash/unset';
import union from 'lodash/union';
import clone from 'lodash/clone';
import compact from 'lodash/compact';
import includes from 'lodash/includes';
import merge from 'lodash/merge';
import isUndefined from 'lodash/isUndefined';
import forEach from 'lodash/forEach';
import uuid from 'shortid';
import draggable from 'vuedraggable';
import { viewTypes as types, defaultViewValues as defaults } from './config';
import headline from './views/Headline.vue';
import buttonAdd from './views/ButtonAdd.vue';
import buttonRemove from './views/ButtonRemove.vue';
import buttonDrag from './views/ButtonDrag.vue';
import viewText from './views/ViewText.vue';
import viewUpload from './views/ViewUpload.vue';
import viewArea from './views/ViewArea.vue';
import viewSelect from './views/ViewSelect.vue';
import viewTick from './views/ViewTick.vue';
import viewCheckbox from './views/ViewCheckbox.vue';
import viewCounter from './views/ViewCounter.vue';
import viewDatetime from './views/ViewDatetime.vue';
import viewRadio from './views/ViewRadio.vue';

export default {
  name: 'ddFormView',
  props: ['descriptions', 'data', 'path', 'functions', 'views', 'lang'],
  data() {
    return {
      hover: false,
      hoverTimeout: null,
      hoverProcessing: false,
      types: { ...types },
      dataValue: this.data,
      allViews: {
        /* default views */
        text: viewText,
        upload: viewUpload,
        area: viewArea,
        select: viewSelect,
        tick: viewTick,
        checkbox: viewCheckbox,
        counter: viewCounter,
        datetime: viewDatetime,
        radio: viewRadio,
        /* default views' subelements */
        'group.headline': headline,
        'collection.button-add': buttonAdd,
        'collection.headline': headline,
        'collection.button-remove': buttonRemove,
        'collection.button-drag': buttonDrag,
        /* custom views */
        ...this.views,
      },
      viewKeys: [],
      draggableOptions: {
        draggable: '.view__container',
        filter: 'input',
        preventOnFilter: false,
        animation: 0,
      },
      elementStyles: {
        hidden: {
          visibility: 'hidden',
          opacity: '0',
        },
        none: {},
      },
    };
  },
  created() {
    if (isUndefined(this.data)) {
      this.update({ path: this.path, value: defaults[this.description.view] });
    }
    if (!this.isLeaf)
      this.generateKeys(this.isGroup ? this.groupNodes : this.dataValue);
    if (this.isDatetime) this.purifyDatetime();
  },
  computed: {
    isRoot() {
      return !this.path;
    },
    descriptionPath() {
      let firstValid = null;
      this.findFirstValidDescriptionPath((path) => {
        firstValid = path;
      });
      return firstValid;
    },
    description() {
      const description = this.descriptionPath
        ? clone(this.descriptions[this.descriptionPath])
        : { view: 'group' };
      forEach(description, (value, key) => {
        description[key] = this.getValue(value);
      });
      return description;
    },
    isGroup() {
      return this.description && this.description.view === types.GROUP;
    },
    isDatetime() {
      return this.description && this.description.view === types.DATETIME;
    },
    isCollection() {
      return this.description && this.description.view === types.COLLECTION;
    },
    isLeaf() {
      // eslint-disable-next-line max-len
      return (
        this.description &&
        this.description.view !== types.GROUP &&
        this.description.view !== types.COLLECTION
      );
    },
    isRemovable() {
      return !!this.$slots['remove-button'];
    },
    isHidden() {
      return this.description.hidden;
    },
    isDraggable() {
      return (
        !!this.description.draggable || isUndefined(this.description.draggable)
      );
    },
    isDeletable() {
      return (
        !!this.description.deletable || isUndefined(this.description.deletable)
      );
    },
    isAddable() {
      return (
        !!this.description.addable || isUndefined(this.description.addable)
      );
    },
    isNextChildDescribed() {
      return !!this.descriptionForNextChild(this.path, this.dataValue.length);
    },
    pathNodes() {
      return this.splitPath(this.path || '');
    },
    descriptionNodesMap() {
      const map = {};
      Object.keys(this.descriptions).forEach((key) => {
        map[key] = this.splitPath(key);
      });
      return map;
    },
    groupNodes() {
      const nodes = [];
      Object.keys(this.descriptions).forEach((key) => {
        if (this.isRoot) {
          const node = this.splitPath(key)[0];
          nodes.push(node);
        } else {
          const restOfPath = compact(key.split(`${this.descriptionPath}.`))[0];
          const node = this.splitPath(restOfPath)[0];
          if (
            key !== this.descriptionPath &&
            key.startsWith(this.descriptionPath)
          )
            nodes.push(node);
        }
      });
      return union(nodes);
    },
    groupWrappers() {
      // eslint-disable-next-line arrow-body-style
      const groupNodeDescriptions = this.groupNodes.map((node) => {
        return this.findFirstDescriptionForNode(node);
      });
      const allWrappers = groupNodeDescriptions
        .map((desc) => (desc ? desc.wrapper : ''))
        .filter((w) => w);
      return [...union(allWrappers), null];
    },
  },
  methods: {
    get,
    set,
    unset,
    clone,
    compact,
    isUndefined,
    forEach,
    uuid,
    splitPath(path) {
      return compact(path.split(/[.[\]]/));
    },
    validate(pathNodes, descriptionNodesMap) {
      if (pathNodes.length !== descriptionNodesMap.length) return false;
      let valid = true;
      pathNodes.forEach((node, index) => {
        const descriptionNode = descriptionNodesMap[index];
        if (descriptionNode !== node && descriptionNode !== '*') valid = false;
      });
      return valid;
    },
    purifyDatetime() {
      let date = clone(this.dataValue);
      /* String value polyfill */
      if (typeof this.dataValue === 'string') date = Date(date);
      /* Firebase Timestamp polyfill */
      if (this.dataValue.seconds) date = date.toDate();
      this.dataValue = date;
    },
    isViewInWrapper(node, wrapper) {
      const viewDescription = this.findFirstDescriptionForNode(node);
      const viewWrapper = viewDescription ? viewDescription.wrapper : null;
      return viewWrapper === wrapper || (!wrapper && !viewWrapper);
    },
    findFirstValidDescriptionPath(func, path) {
      Object.keys(this.descriptionNodesMap).forEach((key) => {
        const descriptionNodes = this.descriptionNodesMap[key];
        // eslint-disable-next-line max-len
        if (
          this.validate(
            path ? this.splitPath(path) : this.pathNodes,
            descriptionNodes,
          )
        )
          func(key);
      });
    },
    findFirstDescriptionForNode(node) {
      const nodePrefix = !this.isRoot ? `${this.path}.` : '';
      const path = `${nodePrefix}${node}`;
      let found = null;
      this.findFirstValidDescriptionPath((foundPath) => {
        found = foundPath;
      }, path);
      return this.descriptions[found];
    },
    groupNodePath(key) {
      return this.isRoot ? key : `${this.path}.${key}`;
    },
    collectionNodePath(key) {
      return `${this.path}[${key}]`;
    },
    descriptionForNextChild(collectionPath, length) {
      let firstValid = null;
      const pathsOfNextChild = `${collectionPath}[${length}]`;
      this.findFirstValidDescriptionPath((foundDescriptionPath) => {
        // eslint-disable-next-line max-len
        if (foundDescriptionPath)
          firstValid = {
            ...this.descriptions[foundDescriptionPath],
            path: foundDescriptionPath,
          };
      }, pathsOfNextChild);
      return firstValid;
    },
    remove(path, index) {
      const current = this.dataValue.filter((val, i) => i !== index);
      this.update({ path, value: current });
      this.$emit('remove', { path, value: current });
      this.removeKey(index);
    },
    add(path, descriptionForChild) {
      const current = clone(this.dataValue);
      if (descriptionForChild) {
        current.push(this.chunkForPath(path, descriptionForChild));
        this.addKey();
      }
      this.update({ path, value: current });
      this.$emit('add', { path, value: current });
    },
    addKey() {
      this.viewKeys.push(uuid.generate());
    },
    removeKey(index) {
      this.viewKeys = this.viewKeys.filter((val, i) => i !== index);
    },
    chunkForPath(path, description) {
      const type = description.view;
      // eslint-disable-next-line max-len
      let chunk = clone(defaults[description.view]);
      if (type === types.GROUP) {
        // TODO temporary fix - if group under collection, items get merged (in demo / Advanced)
        chunk = clone({});
        Object.keys(this.descriptions).forEach((key) => {
          const restOfDescription = compact(
            key.split(`${description.path}.`),
          )[0];
          const currentDescription = this.descriptions[key];
          // eslint-disable-next-line max-len
          if (
            key.startsWith(description.path) &&
            !includes(restOfDescription, '[')
          ) {
            // eslint-disable-next-line max-len
            const emptyViewValue = clone(defaults[currentDescription.view]);
            // eslint-disable-next-line max-len
            set(
              chunk,
              restOfDescription,
              !isUndefined(emptyViewValue) ? emptyViewValue : null,
            );
          }
        });
        const append = description.append ? this.getValue(description.append) : {};
        chunk = merge(chunk, append);
      }
      return chunk;
    },
    getValue(value) {
      let output = value;
      if (typeof value === 'string') {
        if (this.functions) {
          const variables = this.getStringVariables(value);
          if (this.functions[value]) {
            output = this.functions[value]({
              path: this.path,
              value: this.dataValue,
            });
          } else if (variables) {
            variables.forEach((variable) => {
              if (this.functions[variable]) {
                // eslint-disable-next-line max-len
                const replace = this.functions[variable]({
                  path: this.path,
                  value: this.dataValue,
                });
                output = this.replaceAll(output, `{${variable}}`, replace);
              }
            });
          }
        }
      }
      return output;
    },
    getStringVariables(str) {
      const found = [];
      const rxp = /{([^}]+)}/g;
      let curMatch;
      // eslint-disable-next-line
      while ((curMatch = rxp.exec(str))) {
        found.push(curMatch[1]);
      }
      return found;
    },
    replaceAll(str, find, replace) {
      return str.replace(new RegExp(find, 'g'), replace);
    },
    generateKeys(values) {
      const keys = [];
      values.forEach((v, i) => {
        keys[i] = uuid.generate();
      });
      this.viewKeys = [...keys];
    },
    updateCollection() {
      this.update({ path: this.path, value: this.dataValue });
      this.generateKeys(this.dataValue);
    },
    update({ path, value }) {
      this.setLocalData({ path, value });
      this.$emit('change', { path, value });
    },
    setLocalData({ path, value }) {
      if (path === this.path) {
        this.dataValue = clone(value);
      } else {
        const restOfPath = compact(path.split(this.path))[0];
        set(this.dataValue, restOfPath, value);
        // TODO temporary fix for group in a group (path with duplicate data)
        unset(this.dataValue, '');
      }
    },
    easeHover(value) {

      /* clear any hover countdown */
      if (this.hoverTimeout) clearTimeout(this.hoverTimeout);

      /* show controls immediately @mouseenter */
      if (value) {
        this.hover = true;
        this.hoverProcessing = false;
      }

      /* hide controls 2000ms @mouseleave */
      else {
        this.hoverProcessing = true;
        this.hoverTimeout = setTimeout(() => {
          this.hover = false;
          this.hoverProcessing = false;
        }, 2000);
      }
    }
  },
  components: {
    draggable,
    headline,
    buttonAdd,
    buttonRemove,
    buttonDrag,
    viewText,
    viewUpload,
    viewArea,
    viewSelect,
    viewTick,
    viewCheckbox,
    viewCounter,
    viewDatetime,
    viewRadio,
  },
};
</script>
