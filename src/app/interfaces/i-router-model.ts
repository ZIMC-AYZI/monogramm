export interface IAppRoutes {
  [key: string]: IAppRouteData;
}
export interface IAppRouteData {
  routerPath: string;
  fullPath?: string;
}
