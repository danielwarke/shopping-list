"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaModel = void 0;
const user_relations_1 = require("./user_relations");
const shopping_list_relations_1 = require("./shopping_list_relations");
const list_item_relations_1 = require("./list_item_relations");
const user_1 = require("./user");
const shopping_list_1 = require("./shopping_list");
const list_item_1 = require("./list_item");
var PrismaModel;
(function (PrismaModel) {
    class UserRelations extends user_relations_1.UserRelations {
    }
    PrismaModel.UserRelations = UserRelations;
    class ShoppingListRelations extends shopping_list_relations_1.ShoppingListRelations {
    }
    PrismaModel.ShoppingListRelations = ShoppingListRelations;
    class ListItemRelations extends list_item_relations_1.ListItemRelations {
    }
    PrismaModel.ListItemRelations = ListItemRelations;
    class User extends user_1.User {
    }
    PrismaModel.User = User;
    class ShoppingList extends shopping_list_1.ShoppingList {
    }
    PrismaModel.ShoppingList = ShoppingList;
    class ListItem extends list_item_1.ListItem {
    }
    PrismaModel.ListItem = ListItem;
    PrismaModel.extraModels = [
        UserRelations,
        ShoppingListRelations,
        ListItemRelations,
        User,
        ShoppingList,
        ListItem,
    ];
})(PrismaModel = exports.PrismaModel || (exports.PrismaModel = {}));
//# sourceMappingURL=index.js.map