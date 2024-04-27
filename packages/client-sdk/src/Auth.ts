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

import { LoginDto, SignUpDto } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Auth<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags auth
   * @name AuthControllerSignUp
   * @request POST:/auth/signup
   */
  authControllerSignUp = (data: SignUpDto, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/auth/signup`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthControllerLogin
   * @request POST:/auth/login
   */
  authControllerLogin = (data: LoginDto, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/auth/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthControllerGetProfile
   * @request GET:/auth/profile
   * @secure
   */
  authControllerGetProfile = (params: RequestParams = {}) =>
    this.request<object, any>({
      path: `/auth/profile`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
