import NetWork from './network'
export const registerUser = (data:{})=>NetWork.post('/register',data)
export const sendEmailCode = (data:{})=>NetWork.get('/emailCode',data)
export const sendPhoneCode = (data:{})=>NetWork.get('/phoneCode',data)
export const loginUser = (data:{})=>NetWork.post('/login',data)