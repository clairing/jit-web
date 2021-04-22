const state = {
  changes: []
}

const mutations = {

  updateChanges(state, changes) {
    state.changes = changes;
  }
}

const actions = {
  setChanges({ commit }, value) {
    commit('updateChanges', value);
  },
  async saveChange({ commit }) {
    commit('updateChanges', []);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
