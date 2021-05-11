<template>
  <div class="dx-card content">
    <div class="header">
      <div class="title">{{title}}</div>
      <div class="description">{{description}}</div>

      <form class="login-form" @submit.prevent="onSubmit">
        <dx-form :form-data="formData" :disabled="loading">
          <dx-item data-field="email" editor-type="dxTextBox"
            :editor-options="{ stylingMode: 'filled', placeholder: 'Email', mode: 'email' }">
            <dx-required-rule message="邮箱是必须的" />
            <dx-email-rule message="Email is invalid" />
            <dx-label :visible="false" />
          </dx-item>
          <dx-item data-field='password' editor-type='dxTextBox'
            :editor-options="{ stylingMode: 'filled', placeholder: 'Password', mode: 'password' }"
            @keydown.enter="onSubmit">
            <dx-required-rule message="密码是必须的" />
            <dx-label :visible="false" />
          </dx-item>
          <dx-item data-field="rememberMe" editor-type="dxCheckBox"
            :editor-options="{ text: 'Remember me', elementAttr: { class: 'form-text' } }">
            <dx-label :visible="false" />
          </dx-item>
          <dx-button-item>
            <dx-button-options width="100%" type="default" template="signInTemplate" :use-submit-behavior="true">
            </dx-button-options>
          </dx-button-item>
          <dx-item>
            <template #default>
              <div class="link">
                <router-link to="/reset-password">忘记密码</router-link>
              </div>
            </template>
          </dx-item>
          <dx-button-item>
            <dx-button-options text="Create an account" width="100%" :on-click="onCreateAccountClick" />
          </dx-button-item>
          <template #signInTemplate>
            <div>
              <span class="dx-button-text">
                <dx-load-indicator v-if="loading" width="24px" height="24px" :visible="true" />
                <span v-if="!loading">登 录</span>
              </span>
            </div>
          </template>
        </dx-form>
      </form>
    </div>
  </div>
</template>

<script>
import DxLoadIndicator from "devextreme-vue/load-indicator";
import DxForm, {
  DxItem,
  DxEmailRule,
  DxRequiredRule,
  DxLabel,
  DxButtonItem,
  DxButtonOptions
} from "devextreme-vue/form";
// import auth from "@/utils/auth";

import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from "vuex"
export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const formData = reactive({
      email: "11@qq.com",
      password: "11",
      rememberMe: true
    });
    const loading = ref(false);
    function onCreateAccountClick() {
      router.push("/create-account");
    }

    async function onSubmit() {
      // const { email, password } = formData;
      loading.value = true;
      // const result = await auth.logIn(email, password);
      // if (!result.isOk) {
      //   loading.value = false;
      //   notify(result.message, "error", 2000);
      // } else {
      //   router.push(route.query.redirect || "/home");
      // }
      await store.dispatch("user/login", formData)
        .then(() => {
          router.push(route.query.redirect || "/home");
          loading.value = false;
        }).catch((error) => {
          console.log(error);
          loading.value = false;
        })
    }

    return {
      formData,
      loading,
      onCreateAccountClick,
      onSubmit
    };
  },
  components: {
    DxLoadIndicator,
    DxForm,
    DxEmailRule,
    DxRequiredRule,
    DxItem,
    DxLabel,
    DxButtonItem,
    DxButtonOptions
  }
};
</script>

<style lang="scss" scoped>
@import '@/themes/generated/variables.base.scss';
.single-card .dx-card {
  width: 330px;
  margin: auto auto;
  padding: 40px;
  flex-grow: 0;
  top: 50%;
  margin-top: -159px;
  position: absolute;
  left: 50%;
  margin-left: -200px;
}

.login-form {
  .link {
    text-align: center;
    font-size: 16px;
    font-style: normal;

    a {
      text-decoration: none;
    }
  }
  .form-text {
    margin: 10px 0;
    color: rgba($base-text-color, alpha($base-text-color) * 0.7);
  }
}

.header {
  margin-bottom: 30px;

  .title {
    color: $base-text-color;
    line-height: 28px;
    font-weight: 500;
    font-size: 24px;
  }

  .description {
    color: rgba($base-text-color, alpha($base-text-color) * 0.7);
    line-height: 18px;
  }
}
</style>
