import ajax from "./base";
import { baseURL } from "../config/values";

//get the information from weather api
export const reqWeather = async (city) => {
  const url = `http://api.openweathermap.org/data/2.5/weather`;
  const result = await ajax(url, {
    q: city,
    appid: "31b67d550e93316925f5913b31894f17",
  });
  return result;
};

export async function getLogin(loginId, loginPwd) {
  var tableName = "users";
  var columns = "*";
  var condition = `Email='${loginId}'and Password='${loginPwd}'`;
  const user = await ajax(
    `${baseURL}/fetchValues`,
    { tableName, columns, condition },
    "post"
  );
  console.log("user", user);
  if (user !== []) return user;
  else {
    return 0;
  }
}

//add user
export async function addUser(user) {
  var tableName = "users";
  var values = `${null},'${user.loginFirstName}','${user.loginLastName}','${user.email}','${user.loginPwd}','${user.role}'`;
  var users = await ajax(`${baseURL}/insertValues`, { tableName, values }, "post");
  console.log("user", users);
  if (users !== []) return users;
  else {
    return 0;
  }
}
//update user
export async function updateUser(id, loginFirstName, loginLastName, loginPwd, email, role) {
  var tableName = "users";
  var columnsAndValues = `FirstName='${loginFirstName}',LastName='${loginLastName}',Password='${loginPwd}',Email='${email}',SecurityLevel='${role}'`;
  var condition = `UserID='${id}'`;
  const result = await ajax(
    `${baseURL}/updateValues`,
    { tableName, columnsAndValues, condition },
    "post"
  );
  console.log("result", result);
  if (result !== []) return result;
  else {
    return 0;
  }
}
//delete user
export async function deleteUser(id) {
  var tableName = "users";
  var condition = `UserID='${id}'`;
  const result = await ajax(`${baseURL}/deleteValues`, { tableName, condition }, "post");
  console.log("result", result);
  if (result !== []) return result;
  else {
    return 0;
  }
}

//get the userlist information
export async function getUsers() {
  var tableName = "users";
  var columns = "*";
  var condition = ``;
  const user = await ajax(
    `${baseURL}/fetchValues`,
    { tableName, columns, condition },
    "post"
  );
  console.log("user", user);
  if (user !== []) return user;
  else {
    return 0;
  }
}

//adding a new role
export async function addRole(value) {
  var tableName = 'roles';
  var values = `${null},'${value}','[]'`
  const role = await ajax(
    `${baseURL}/insertValues`,
    {tableName, values},
    "post"
  );
  if(role !== []) return role;
  else return 0;
}

//getting the role lists
export async function getRoles() {
  var tableName = 'roles';
  const roleList = await ajax (
    `${baseURL}/fetchValues`,
    {tableName},
    "post"
  );
  if(roleList !== []) return roleList;
  else return 0;
}

export async function updateRole(value, id) {
  var tableName = 'roles';
  var columnsAndValues = `RoleMenu = '${value}'`
  var condition = `RoleID='${id.RoleID}'`;
  const update = await ajax(
    `${baseURL}/updateValues`,
    {tableName, columnsAndValues,condition},
    "post"
  );
  if (update !== []) return update;
  else return 0;
}

export async function deleteRole(id) {
  var tableName = 'roles';
  var condition = `RoleID = '${id}'`;
  const deleteRole = await ajax(
    `${baseURL}/deleteValues`,
    {tableName, condition},
    "post"
  );
  if(deleteRole !== []) return deleteRole;
  else return 0; 
}

export async function getMenuData(data) {
  var tableName = 'roles';
  var condition = `RoleName = '${data.SecurityLevel}'`
  const menuList = await ajax (
    `${baseURL}/fetchValues`,
    {tableName, condition},
    "post"
  );
  if(menuList !== []) return menuList;
  else return 0;
}

export const datas = {
  user: [
    {
      imgUrl:
        "https://img.icons8.com/ios-filled/50/000000/change-user-male.png",
    },
  ],
  role: [
    {
      id: "1",
      authTime: "",
      authAuthor: "",
      menus: [""],
      createAt: "",
      rolename: "admin",
    },
    {
      id: "2",
      authTime: "",
      authAuthor: "",
      menus: [""],
      createAt: "",
      rolename: "salesman",
    },
    {
      id: "3",
      authTime: "",
      authAuthor: "",
      menus: [""],
      createAt: "",
      rolename: "trucklead",
    },
    {
      id: "4",
      authTime: "",
      authAuthor: "",
      menus: [""],
      createAt: "",
      rolename: "manager",
    },
  ],
};
