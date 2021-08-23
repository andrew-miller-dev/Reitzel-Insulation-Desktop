import { getMenu } from '../util/storage';
import {home, quotes, orders, invoices, customers, settings, users, trucks, roles} from './leftnavitems';

export function menuCreate() {
    settings.children = [];
    let menu = [settings];
    let roleMenu = getMenu();
    let menuArr = roleMenu.RoleMenu.split(', ');
    let menuArrRev = menuArr.reverse();
    menuArrRev.map((item) => {
        switch (item) {
            case '/home':
                menu.unshift(home);
                break;
            case '/quotes':
                menu.unshift(quotes);
                break;
            case '/orders':
                menu.unshift(orders);
                break;
            case '/invoices':
                menu.unshift(invoices);
                break;
            case '/customers':
                menu.unshift(customers);
                break;
            case '/users':
                settings.children.push(users);
                break;
            case '/trucks':
                settings.children.push(trucks);
                break;
            case '/roles':
                settings.children.push(roles);
                break;
            default:
                break;
        }
    })
    return menu;
}