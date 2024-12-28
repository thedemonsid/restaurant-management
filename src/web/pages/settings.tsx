// Setting page to change restaurant name, address, and phone

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export default function Settings() {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "समृद्धी रेस्टॉरंट - शुद्ध शाकाहारी",
    address: "कोंढेज चौक, जेऊर (413202) नगर टेंभुर्णी महामार्ग",
    phone: ["9765688151", "8208210374"],
  });

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      const info = await window.restaurant.restaurant.getRestaurantInfo();
      setRestaurantInfo(info);
    };
    fetchRestaurantInfo();
  }, []);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Restaurant name
          </Label>
          <Input
            id="name"
            value={restaurantInfo.name}
            className="col-span-3"
            onChange={(e) => {
              setRestaurantInfo((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="address" className="text-right">
            Address
          </Label>
          <Input
            id="address"
            value={restaurantInfo.address}
            className="col-span-3"
            onChange={(e) => {
              setRestaurantInfo((prev) => ({
                ...prev,
                address: e.target.value,
              }));
            }}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">
            Phone
          </Label>
          <Input
            id="phone"
            value={restaurantInfo.phone.join(",")}
            className="col-span-3"
            onChange={(e) => {
              setRestaurantInfo((prev) => {
                return {
                  ...prev,
                  phone: e.target.value.split(","),
                };
              });
            }}
          />
        </div>
      </div>
      <div className="mt-4">
        <Button
          onClick={async () => {
            // first check for changes

            const response =
              await window.restaurant.restaurant.updateRestaurantInfo(
                restaurantInfo
              );
            if (response) {
              alert("Restaurant info updated successfully");
            } else {
              alert("Failed to update restaurant info");
            }
          }}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
