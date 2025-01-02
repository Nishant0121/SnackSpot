import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function CartModal({ isOpen, onClose, onAddToCart, item }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const handleSubmit = () => {
    const customizations = {
      spiceLevel: selectedSpiceLevel,
      addOns: selectedAddOns,
    };
    onAddToCart(item, quantity, customizations);
    onClose();
  };

  const handleAddOnToggle = (addOn) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOn)
        ? prev.filter((item) => item !== addOn)
        : [...prev, addOn]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Cart - {item?.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {/* Quantity Selection */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Select Quantity:</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full"
            />
          </div>

          {/* Spice Level Selection */}
          <div className="space-y-2">
            <Label>Spice Level:</Label>
            <Select
              value={selectedSpiceLevel}
              onValueChange={setSelectedSpiceLevel}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select spice level" />
              </SelectTrigger>
              <SelectContent>
                {item?.customizations?.spiceLevel.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add-ons Selection */}
          <div className="space-y-2">
            <Label>Add-ons:</Label>
            <div className="grid grid-cols-2 gap-4">
              {item?.customizations?.addOns.map((addOn) => (
                <div key={addOn} className="flex items-center space-x-2">
                  <Checkbox
                    id={addOn}
                    checked={selectedAddOns.includes(addOn)}
                    onCheckedChange={() => handleAddOnToggle(addOn)}
                  />
                  <Label htmlFor={addOn}>{addOn}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
