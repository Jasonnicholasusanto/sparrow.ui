export interface NavbarRoute {
  id: number;
  label: string;
  href: string;
  parentId?: number | null;
  orderIndex?: number | null;
  isActive: boolean;
  isVisible: boolean;
  children?: NavbarRoute[];
}

export interface NavbarRouteResponse {
  navbarRoutes: NavbarRoute[] | null;
}
