import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Parcel } from "@/types/index";
import ParcelManager from "@/components/parcels/ParcelManager";

interface ParcelCardProps {
  parcel: Parcel;
  setSelectedParcel: (parcel: Parcel) => void;
  setParcels: (parcels: Parcel[]) => void;
  parcels: Parcel[];
}

const ParcelCard: React.FC<ParcelCardProps> = ({
  parcel,
  setSelectedParcel,
  setParcels,
  parcels,
}) => {
  return (
    <Card
      key={parcel.id as React.Key}
      className="p-4 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <span className="text-red-600 shadow-sm text-md ml-3 bg-green-300 p-2 rounded-lg">
            {parcel.recipient}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="mt-2">
          {parcel.order.map((item, index) => (
            <li key={index} className="text-sm">
              {item.menuItem.name} (x{item.quantity})
            </li>
          ))}
        </ul>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="w-full mt-4"
              onClick={() => setSelectedParcel(parcel)}
            >
              Manage Parcel
            </Button>
          </SheetTrigger>
          <ParcelManager
            parcel={parcel}
            parcels={parcels}
            setParcels={setParcels}
          />
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default ParcelCard;
