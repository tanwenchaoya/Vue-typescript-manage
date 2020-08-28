import NetWork from './network'
export const registerUser = (data:{})=>NetWork.post('/register',data)
export const sendEmailCode = (data:{})=>NetWork.get('/emailCode',data)
export const sendPhoneCode = (data:{})=>NetWork.get('/phoneCode',data)
export const loginUser = (data:{})=>NetWork.post('/login',data)

export const getUsers = (data:{})=>NetWork.get('/api/v1/users',data)
export const addNewUser = (data:{})=>NetWork.post('/api/v1/users',data)
export const deleteUser = (id:string)=>NetWork.delete( `/api/v1/users/${id}`)
export const updateUser = (id:string,data:{})=>NetWork.put( `/api/v1/users/${id}`,data)