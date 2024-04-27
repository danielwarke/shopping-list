/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateShoppingListDto {
  name?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdByUserId: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface UpdateShoppingListDto {
  name?: string;
}

export interface ReorderItem {
  listItemId: string;
  sortOrder: number;
}

export interface ReorderShoppingListDto {
  order: ReorderItem[];
}

export interface ListItem {
  id: string;
  name: string;
  complete: boolean;
  sortOrder: number;
  shoppingListId: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface RenameListItemDto {
  name: string;
}
