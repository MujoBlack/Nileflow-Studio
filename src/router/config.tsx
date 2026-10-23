import type { RouteObject } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/home/page";
import ManageBooking from "@/pages/booking/page";
import Admin from "@/pages/admin/page";

/**
 * The public site is a single page. /book and /quote render that same page with
 * a full-screen panel open, so they keep their own shareable URLs.
 */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/book",
    element: <Home />,
  },
  {
    path: "/quote",
    element: <Home />,
  },
  {
    path: "/booking/:ref",
    element: <ManageBooking />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;