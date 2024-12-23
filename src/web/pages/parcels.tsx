import { useEffect, useState } from "react";
import { Parcel } from "@/types/index";
import ParcelCard from "@/components/parcels/ParcelCard";

const initialParcels: Parcel[] = [
  {
    id: 1,
    recipient: "Jane Smith",
    order: [],
  },
  // Add more initial parcels as needed
];

export default function Parcels() {
  const [parcels, setParcels] = useState<Parcel[]>(() => {
    const savedParcels = localStorage.getItem("parcels");
    return savedParcels ? JSON.parse(savedParcels) : initialParcels;
  });

  useEffect(() => {
    localStorage.setItem("parcels", JSON.stringify(parcels));
  }, [parcels]);

  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Parcels</h1>
        <p className="text-muted-foreground">Manage your parcels</p>
      </div>
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
  );
}
