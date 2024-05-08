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

export interface VerifyEmailDto {
  token: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
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

export interface ShoppingListWithPreview {
  id: string;
  name: string;
  createdByUserId: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt?: string;
  listItemsPreview: ListItem[];
  incompleteItemCount: number;
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

export interface ShareShoppingListDto {
  otherUserEmail: string;
}

export interface CreateListItemDto {
  name?: string;
  sortOrder?: number;
}

export interface RenameListItemDto {
  name: string;
}

import type { AxiosInstance, AxiosRequestConfig, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title Shopping List
 * @version 1.0
 * @contact
 *
 * A shopping list API which uses websockets to present live updates
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AppControllerGetHello
   * @request GET:/
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<string, any>({
      path: `/`,
      method: "GET",
      format: "json",
      ...params,
    });

  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerSignUp
     * @request POST:/auth/signup
     */
    authControllerSignUp: (data: SignUpDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerLogin
     * @request POST:/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerVerifyEmail
     * @request POST:/auth/verify-email
     */
    authControllerVerifyEmail: (data: VerifyEmailDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/verify-email`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerForgotPassword
     * @request POST:/auth/forgot-password
     */
    authControllerForgotPassword: (data: ForgotPasswordDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/forgot-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerResetPassword
     * @request POST:/auth/reset-password
     */
    authControllerResetPassword: (data: ResetPasswordDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerGetProfile
     * @request GET:/auth/profile
     * @secure
     */
    authControllerGetProfile: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/profile`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  shoppingLists = {
    /**
     * No description
     *
     * @tags shopping-lists
     * @name ShoppingListsControllerCreate
     * @request POST:/shopping-lists
     * @secure
     */
    shoppingListsControllerCreate: (data: CreateShoppingListDto, params: RequestParams = {}) =>
      this.request<ShoppingList, any>({
        path: `/shopping-lists`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags shopping-lists
     * @name ShoppingListsControllerFindAll
     * @request GET:/shopping-lists
     * @secure
     */
    shoppingListsControllerFindAll: (params: RequestParams = {}) =>
      this.request<ShoppingListWithPreview[], any>({
        path: `/shopping-lists`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags shopping-lists
     * @name ShoppingListsControllerFindOne
     * @request GET:/shopping-lists/{id}
     * @secure
     */
    shoppingListsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<ShoppingList, any>({
        path: `/shopping-lists/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags shopping-lists
     * @name ShoppingListsControllerRemove
     * @request DELETE:/shopping-lists/{id}
     * @secure
     */
    shoppingListsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<ShoppingList, any>({
        path: `/shopping-lists/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags shopping-lists
     * @name ShoppingListsControllerRename
     * @request PATCH:/shopping-lists/{id}/rename
     * @secure
     */
    shoppingListsControllerRename: (id: string, data: UpdateShoppingListDto, params: RequestParams = {}) =>
      this.request<ShoppingList, any>({
        path: `/shopping-lists/${id}/rename`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags shopping-lists
     * @name ShoppingListsControllerReorder
     * @request PATCH:/shopping-lists/{id}/reorder
     * @secure
     */
    shoppingListsControllerReorder: (id: string, data: ReorderShoppingListDto, params: RequestParams = {}) =>
      this.request<ListItem[], any>({
        path: `/shopping-lists/${id}/reorder`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags shopping-lists
     * @name ShoppingListsControllerShare
     * @request POST:/shopping-lists/{id}/share
     * @secure
     */
    shoppingListsControllerShare: (id: string, data: ShareShoppingListDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/shopping-lists/${id}/share`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags items
     * @name ListItemsControllerFindAll
     * @request GET:/shopping-lists/{shoppingListId}/items
     * @secure
     */
    listItemsControllerFindAll: (shoppingListId: string, params: RequestParams = {}) =>
      this.request<ListItem[], any>({
        path: `/shopping-lists/${shoppingListId}/items`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags items
     * @name ListItemsControllerCreate
     * @request POST:/shopping-lists/{shoppingListId}/items
     * @secure
     */
    listItemsControllerCreate: (shoppingListId: string, data: CreateListItemDto, params: RequestParams = {}) =>
      this.request<ListItem, any>({
        path: `/shopping-lists/${shoppingListId}/items`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags items
     * @name ListItemsControllerRename
     * @request PATCH:/shopping-lists/{shoppingListId}/items/{id}/rename
     * @secure
     */
    listItemsControllerRename: (
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
      }),

    /**
     * No description
     *
     * @tags items
     * @name ListItemsControllerToggleComplete
     * @request PATCH:/shopping-lists/{shoppingListId}/items/{id}/toggle-complete
     * @secure
     */
    listItemsControllerToggleComplete: (shoppingListId: string, id: string, params: RequestParams = {}) =>
      this.request<ListItem, any>({
        path: `/shopping-lists/${shoppingListId}/items/${id}/toggle-complete`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags items
     * @name ListItemsControllerRemove
     * @request DELETE:/shopping-lists/{shoppingListId}/items/{id}
     * @secure
     */
    listItemsControllerRemove: (shoppingListId: string, id: string, params: RequestParams = {}) =>
      this.request<ListItem, any>({
        path: `/shopping-lists/${shoppingListId}/items/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
