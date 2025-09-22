// // middleware.ts
// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const url = request.nextUrl;

//   const roles = ["admin", "teacher", "student", "parent"];
//   const pathParts = url.pathname.split("/").filter(Boolean);

//   // अगर कोई role वाला path है → उसे rewrite कर दो बिना role वाले path पर
//   if (pathParts.length > 1 && roles.includes(pathParts[0])) {
//     url.pathname = "/" + pathParts.slice(1).join("/");
//     return NextResponse.rewrite(url);
//   }

//   // direct access block कर दो (e.g. /class → redirect to /admin/class)
//   if (pathParts.length > 0 && !roles.includes(pathParts[0])) {
//     return NextResponse.redirect(new URL(`/admin${url.pathname}`, request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
