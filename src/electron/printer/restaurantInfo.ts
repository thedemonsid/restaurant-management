import fs from "fs";
import { getRestaurantInfoPath } from "../pathResolver.js";

// File path to save restaurant info in dist-electron folder
const filePath = getRestaurantInfoPath();

// Save restaurant info to JSON file
function saveRestaurantInfo(restaurantInfo: {
  name: string;
  address: string;
  phone: string[];
}) {
  fs.writeFileSync(filePath, JSON.stringify(restaurantInfo, null, 2), "utf-8");
}

export function getRestaurantInfo() {
  const data = fs.readFileSync(filePath, "utf-8");
  const restaurantInfo: {
    name: string;
    address: string;
    phone: string[];
  } = JSON.parse(data);
  return restaurantInfo;
}

// Function to change the restaurant name, address, and phone from the settings page
export async function updateRestaurantInfo(
  name: string,
  address: string,
  phone: string[]
) {
  let restaurantInfo = { name: "", address: "", phone: [""] };
  restaurantInfo.name = name;
  restaurantInfo.address = address;
  restaurantInfo.phone = phone;
  try {
    saveRestaurantInfo(restaurantInfo);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
