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
  const handleCancelParcel = () => {
    const updatedParcels = parcels.filter(
      (t) => t.recipient !== parcel.recipient
    );
    setParcels(updatedParcels);
  };
  return (
    <Card
      key={parcel.id as React.Key}
      className="border max-w-80 min-w-72 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
    >
      <CardHeader>
        <div className="flex items-center justify-between space-y-0 pb-2 gap-3">
          <CardTitle className="text-xl">{parcel.recipient}</CardTitle>
          <Button onClick={handleCancelParcel} variant={"destructive"}>
            Cancel
          </Button>
        </div>
      </CardHeader>
      <hr></hr>
      <CardContent>
        <p className="text-sm text-center">Order : </p>
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
