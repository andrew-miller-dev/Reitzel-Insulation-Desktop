import store from 'store'

//set the name of localstorage
const userid = 'user_id';
const menu = 'menu';

export function getUser() {
  return store.get(userid)
}
export function setUser(value) {
  return store.set(userid, value)
}
export function removeUser() {
  return store.remove(userid)
}

export function getMenu() {
  return store.get(menu);
}
export function setMenu(value) {
  return store.set(menu, value)
}
export function removeMenu() {
  return store.remove(menu)
}