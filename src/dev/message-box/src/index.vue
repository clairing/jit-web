<template>
  <DxPopup v-model:visible="popupVisible" :drag-enabled="false" :close-on-outside-click="true"
    :show-close-button="false" :show-title="true" :width="300" :height="280" container=".dx-viewport"
    title="Information">
    <DxPosition at="center" my="center" />
    <div>11111111111111</div>
    <div>{{content}}</div>
    <template #popup-content>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
        Penatibus et magnis dis parturient. Eget dolor morbi non arcu risus. Tristique magna sit amet purus gravida
        quis blandit.
        Auctor urna nunc id cursus metus aliquam eleifend mi in. Tellus orci ac auctor augue mauris augue neque
        gravida. Nullam vehicula ipsum a arcu.
        Nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi. Cursus in hac habitasse platea dictumst.
        Egestas dui id ornare arcu.
        Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim.
      </p>
      <p>
        Mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar. Neque volutpat ac tincidunt vitae
        semper quis lectus.
        Sed sed risus pretium quam vulputate dignissim suspendisse in. Urna nec tincidunt praesent semper feugiat nibh
        sed pulvinar.
        Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Amet cursus sit amet dictum sit amet justo
        donec enim.
        Vestibulum rhoncus est pellentesque elit ullamcorper. Id aliquet risus feugiat in ante metus dictum at.
      </p>
    </template>
    <DxToolbarItem widget="dxButton" toolbar="bottom" text="Outlined" location="before" />
    <DxToolbarItem widget="dxButton" toolbar="bottom" text="Outlined" location="after" />
  </DxPopup>
</template>
<script>
import { DxPopup, DxPosition, DxToolbarItem } from 'devextreme-vue/popup';
import { defineComponent, ref } from "vue";
export default defineComponent({
  inheritAttrs: false,
  name: 'Message',
  components: {
    DxPopup,
    DxPosition,
    DxToolbarItem,
  },
  props: {
    content: {
      type: String,
      default: ""
    }
  },
  setup() {
    const popupVisible = ref(true)
    return {
      currentEmployee: {},
      popupVisible
    };
  }
});
</script>
<style>
#container {
  padding: 10px;
}

#container ul {
  list-style-type: none;
  text-align: center;
}

#container ul li {
  display: inline-block;
  width: 160px;
  margin: 10px;
}

#container ul li img {
  width: 100px;
}

.button-info {
  margin: 10px;
}

.dx-popup-content p {
  margin-bottom: 10px;
  margin-top: 0;
}
</style>

