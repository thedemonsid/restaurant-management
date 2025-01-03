// Setting page to change restaurant name, address, and phone

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
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
    <div className="p-4 flex flex-col gap-4 justify-between h-full">
      <div>
        {" "}
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <form
          onSubmit={async () => {
            // first check for changes

            const response =
              await window.restaurant.restaurant.updateRestaurantInfo(
                restaurantInfo
              );
            console.log(response);

            if (response) {
              console.log("Restaurant info updated successfully");
            } else {
              console.log("Failed to update restaurant info");
            }
          }}
        >
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
                  setRestaurantInfo((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
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
              type="submit"
              onClick={() => {
                toast({
                  title: "Settings saved",
                  description: `New restaurant name: ${
                    restaurantInfo.name
                  }, address: ${
                    restaurantInfo.address
                  }, phone: ${restaurantInfo.phone.join(", ")}`,
                  className: "bg-green-100",
                });
              }}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
      <Dialog>
        <DialogTrigger>
          <Button variant={"secondary"}>Clear All Data</Button>
        </DialogTrigger>
        <DialogContent>
          <div className="p-4">
            <h2 className="text-2xl font-bold">Delete All Data</h2>
            <p className="text-red-500">
              This will delete all data including menu items, orders, and
              expenses
            </p>
            <div className="mt-4">
              <Button
                onClick={async () => {
                  const response = await window.restaurant.db.clearData();
                  if (response) {
                    toast({
                      title: "Data cleared",
                      description: "All data has been deleted",
                      className: "bg-red-100",
                    });
                  } else {
                    toast({
                      title: "Failed to clear data",
                      description: "Please try again",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Clear Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
