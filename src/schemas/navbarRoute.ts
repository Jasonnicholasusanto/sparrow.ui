export interface NavbarRoute {
  id: number;
  label: string;
  href: string;
  parent_id?: number | null;
  order_index?: number | null;
  is_active: boolean;
  is_visible: boolean;
  children?: NavbarRoute[];
}

export interface NavbarRouteResponse {
  navbar_routes: NavbarRoute[] | null;
}
