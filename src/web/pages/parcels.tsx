import { useEffect, useState } from "react";
import { Parcel } from "@/types/index";
import ParcelCard from "@/components/parcels/ParcelCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialParcels: Parcel[] = [];

export default function Parcels() {
  const [parcels, setParcels] = useState<Parcel[]>(() => {
    const savedParcels = localStorage.getItem("parcels");
    return savedParcels ? JSON.parse(savedParcels) : initialParcels;
  });
  const [newReceipient, setNewRecipient] = useState("");
  useEffect(() => {
    localStorage.setItem("parcels", JSON.stringify(parcels));
  }, [parcels]);

  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  console.log(selectedParcel);
  
  const handleAddParcel = () => {
    if (newReceipient) {
      setParcels([
        ...parcels,
        {
          id: parcels.length + 1,
          recipient: newReceipient,
          order: [],
        },
      ]);
      setNewRecipient("");
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Parcels</h1>
        <p className="text-muted-foreground">Manage your parcels</p>
      </div>
      <div>
        {/* Create a parcel for recepent with empty order array */}
        <form
          className="flex max-w-3xl mr-auto gap-3"
          onSubmit={handleAddParcel}
        >
          <Input
            type="text"
            placeholder="Customer Name"
            className="w-full"
            value={newReceipient}
            onChange={(e) => setNewRecipient(e.target.value)}
          />
          <Button type="submit">Add Parcel</Button>
        </form>
        <div className="grid gap-4 md:grid-cols-4 p-2">
          {parcels.map((parcel) => (
            <ParcelCard
              key={parcel.id}
              parcel={parcel}
              parcels={parcels}
              setSelectedParcel={setSelectedParcel}
              setParcels={setParcels}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
