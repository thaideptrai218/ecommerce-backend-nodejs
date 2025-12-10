import { AccessControl } from "accesscontrol";

// const grantList = [
//     {
//         role: "admin",
//         resource: "profile",
//         action: "read:any",
//         attributes: "*, !views",
//     },
//     {
//         role: "admin",
//         resource: "profile",
//         action: "create:any",
//         attributes: "*",
//     },
//     {
//         role: "admin",
//         resource: "profile",
//         action: "update:any",
//         attributes: "*",
//     },
//     {
//         role: "admin",
//         resource: "profile",
//         action: "delete:any",
//         attributes: "*",
//     },
//     { role: "shop", resource: "profile", action: "read:own", attributes: "*" },
//     {
//         role: "admin",
//         resource: "balance",
//         action: "read:any",
//         attributes: "*",
//     },
//     {
//         role: "shop",
//         resource: "balance",
//         action: "read:own",
//         attributes: "*",
//     },
// ];




export default new AccessControl();
