import { getToken, setToken, removeToken } from "@/utils/js-cookie"
import { login, logout, getInfo } from '@/api/user'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avator: '',
    email: '',
    introduction: "",
    roles: [],
    is_formal: ''
  }
}
const state = getDefaultState()
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_INTRODUCION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_FORMAL: (state, is_formal) => {
    state.is_formal = is_formal
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_AVATOR: (state, avator) => {
    state.avator = avator
  },
  SET_NAME: (state, name) => {
    state.name = name
  }
}
const actions = {
  // login
  login({ commit }, userInfo) {
    const { email, password } = userInfo
    console.log(userInfo);
    return new Promise((resolve, reject) => {
      login({ username: email.trim(), password }).then(response => {
        console.log(response)
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        console.log(getToken());
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log(state);
      logout(state.token).then((response) => {
        const { data } = response
        removeToken()
        //  resetRouter()
        commit("RESET_STATE")
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // resetToken
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", '')
      commit('RESET_STATE', [])
      removeToken()
      resolve()
    })
  },
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject("验证失效,请重新登录")
        }
        const { name, avator, roles, introduction, user_email } = data
        console.log(data);
        if (!roles || roles.length < 0) {
          reject("getInfo，角色不能为空，必须为数组")
        }
        commit("SET_ROLES", roles)
        commit('SET_AVATOR', avator)
        commit('SET_NAME', name)
        commit('SET_EMAIL', user_email)
        commit('SET_INTRODUCION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
