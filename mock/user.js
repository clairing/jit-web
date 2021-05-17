/* eslint-disable no-debugger */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    user_aid: 'Admin',
    user_name: '管理员',
    user_email: '813193419@qq.com',
    user_phone_num: '',
    user_logo: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    user_type: '',
    is_formal: '1'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    user_aid: '',
    user_name: '',
    user_email: '',
    user_phone_num: '',
    user_logo: '',
    user_type: '',
    is_formal: '3'

  }
}

module.exports = [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      // const { username } = config.body
      const token = tokens["admin"]
      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }
      return {
        code: 200,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 200,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/user/wxLogin',
    type: 'post',
    response: config => {
      const { code } = config.body
      if (!code) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }
      return {
        code: 200,
        data: {
          token: 'admin-token'
        }
      }
    }
  },
  {
    url: '/user/phoneLogin',
    type: 'post',
    response: config => {
      const { vcode } = config.body
      if (!vcode) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }
      return {
        code: 200,
        data: {
          token: 'admin-token'
        }
      }
    }
  },
  {
    url: '/user/getVcode',
    type: 'post',
    response: config => {
      const { phone, pcode } = config.body
      console.log(config.body)
      if (!phone || !pcode) {
        return {
          code: 50000,
          message: '发送失败!'
        }
      }
      return {
        code: 200,
        data: {
          vcode: '420322'
        }
      }
    }
  }
]
