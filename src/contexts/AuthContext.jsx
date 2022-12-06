import { useState, useContext, createContext, useEffect } from 'react';
import { register, login, checkPermission } from './../api/auth';
import * as jwt from 'jsonwebtoken'
import { useLocation } from 'react-router-dom';


const defaultAuthContext = {
  isAuthenticated: false, // 使用者是否登入的判斷依據，預設為 false，若取得後端的有效憑證，則切換為 true
  currentMember: null, // 當前使用者相關資料，預設為 null，成功登入後就會有使用者資料
  register: null, // 註冊方法
  login: null, // 登入方法
  logout: null, // 登入方法
}

const AuthContext = createContext(defaultAuthContext)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [payload, setPayload] = useState(null)
  const { pathname } = useLocation()

  useEffect(() => {
    async function checkTokenIsValid() {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setIsAuthenticated(false)
        setPayload(null)
        return
      }

      const result = await checkPermission(authToken);

      if (result) {
        setIsAuthenticated(true)
        const tempPayLoad = jwt.decode(authToken)
        setPayload(tempPayLoad)
        return
      }
      else{
        setIsAuthenticated(false)
        setPayload(null)
      }
    }

    checkTokenIsValid();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload && {
          id: payload.sub, // 取出 sub 字串，可以做為使用者 id
          name: payload.name, // 取出使用者帳號
        },
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            password: data.password,
            email: data.email,
          });

          const tempPayLoad = jwt.decode(authToken); // 取得 payload 內容

          if (tempPayLoad) {
            setIsAuthenticated(true);
            setPayload(tempPayLoad);
            localStorage.setItem('authToken', authToken);
          } else {
            setIsAuthenticated(false);
            setPayload(null);
          }

          return success;
        },

        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });

          const tempPayLoad = jwt.decode(authToken); // 取得 payload 內容

          if (tempPayLoad) {
            setIsAuthenticated(true);
            setPayload(tempPayLoad);
            localStorage.setItem('authToken', authToken);
          } else {
            setIsAuthenticated(false);
            setPayload(null);
          }

          return success;
        },

        logout: () => {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          setPayload(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}