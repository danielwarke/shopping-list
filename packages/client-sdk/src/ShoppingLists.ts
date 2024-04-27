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

import {
  CreateShoppingListDto,
  ListItem,
  RenameListItemDto,
  ReorderShoppingListDto,
  ShoppingList,
  UpdateShoppingListDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class ShoppingLists<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags shopping-lists
   * @name ShoppingListsControllerCreate
   * @request POST:/shopping-lists
   * @secure
   */
  shoppingListsControllerCreate = (
    data: CreateShoppingListDto,
    params: RequestParams = {},
  ) =>
    this.request<ShoppingList, any>({
      path: `/shopping-lists`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags shopping-lists
   * @name ShoppingListsControllerFindAll
   * @request GET:/shopping-lists
   * @secure
   */
  shoppingListsControllerFindAll = (params: RequestParams = {}) =>
    this.request<ShoppingList[], any>({
      path: `/shopping-lists`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags shopping-lists
   * @name ShoppingListsControllerFindOne
   * @request GET:/shopping-lists/{id}
   * @secure
   */
  shoppingListsControllerFindOne = (id: string, params: RequestParams = {}) =>
    this.request<ShoppingList, any>({
      path: `/shopping-lists/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags shopping-lists
   * @name ShoppingListsControllerRemove
   * @request DELETE:/shopping-lists/{id}
   * @secure
   */
  shoppingListsControllerRemove = (id: string, params: RequestParams = {}) =>
    this.request<ShoppingList, any>({
      path: `/shopping-lists/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags shopping-lists
   * @name ShoppingListsControllerRename
   * @request PATCH:/shopping-lists/{id}/rename
   * @secure
   */
  shoppingListsControllerRename = (
    id: string,
    data: UpdateShoppingListDto,
    params: RequestParams = {},
  ) =>
    this.request<ShoppingList, any>({
      path: `/shopping-lists/${id}/rename`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags shopping-lists
   * @name ShoppingListsControllerReorder
   * @request PATCH:/shopping-lists/{id}/reorder
   * @secure
   */
  shoppingListsControllerReorder = (
    id: string,
    data: ReorderShoppingListDto,
    params: RequestParams = {},
  ) =>
    this.request<ListItem[], any>({
      path: `/shopping-lists/${id}/reorder`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags items
   * @name ListItemsControllerFindAll
   * @request GET:/shopping-lists/{shoppingListId}/items
   * @secure
   */
  listItemsControllerFindAll = (
    shoppingListId: string,
    params: RequestParams = {},
  ) =>
    this.request<ListItem[], any>({
      path: `/shopping-lists/${shoppingListId}/items`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags items
   * @name ListItemsControllerCreate
   * @request POST:/shopping-lists/{shoppingListId}/items
   * @secure
   */
  listItemsControllerCreate = (
    shoppingListId: string,
    data: CreateShoppingListDto,
    params: RequestParams = {},
  ) =>
    this.request<ListItem, any>({
      path: `/shopping-lists/${shoppingListId}/items`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags items
   * @name ListItemsControllerRename
   * @request PATCH:/shopping-lists/{shoppingListId}/items/{id}/rename
   * @secure
   */
  listItemsControllerRename = (
    shoppingListId: string,
    id: string,
    data: RenameListItemDto,
    params: RequestParams = {},
  ) =>
    this.request<ListItem, any>({
      path: `/shopping-lists/${shoppingListId}/items/${id}/rename`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags items
   * @name ListItemsControllerToggleComplete
   * @request PATCH:/shopping-lists/{shoppingListId}/items/{id}/toggle-complete
   * @secure
   */
  listItemsControllerToggleComplete = (
    shoppingListId: string,
    id: string,
    params: RequestParams = {},
  ) =>
    this.request<ListItem, any>({
      path: `/shopping-lists/${shoppingListId}/items/${id}/toggle-complete`,
      method: "PATCH",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags items
   * @name ListItemsControllerRemove
   * @request DELETE:/shopping-lists/{shoppingListId}/items/{id}
   * @secure
   */
  listItemsControllerRemove = (
    shoppingListId: string,
    id: string,
    params: RequestParams = {},
  ) =>
    this.request<ListItem, any>({
      path: `/shopping-lists/${shoppingListId}/items/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
}
