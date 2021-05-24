import TokenService from "./token.service"

import router from '../router'

const AuthService = {

  logout() {
    TokenService.removeAccessToken()
    router.push({ path: "/" })
  }

}

export default AuthService