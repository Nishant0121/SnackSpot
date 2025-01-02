import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getMenuItems, addToCart } from "../../hooks/menu.jsx";
import { useAuth } from "../../context/auth.context.jsx";
import CartModal from "@/components/CartModal";

function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onSelectCategory(null)}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}

export default function MenuDisplay() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menu = await getMenuItems(); // Fetch menu items from Firestore
        setMenuItems(menu);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenu();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(menuItems.map((item) => item.category)));
  }, [menuItems]); // Update categories when menuItems change

  const filteredMenuItems = useMemo(() => {
    return selectedCategory
      ? menuItems.filter((item) => item.category === selectedCategory)
      : menuItems;
  }, [menuItems, selectedCategory]); // Update when menuItems or selectedCategory changes

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMenuItems.map((item) => (
          <MenuItem key={item.itemID} item={item} />
        ))}
      </div>
    </div>
  );
}

function MenuItem({ item }) {
  const [showCustomizations, setShowCustomizations] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { currentUser } = useAuth();

  const handleAddToCart = async (item, quantity, customizations) => {
    await addToCart(currentUser?.uid, item, quantity, customizations);
    console.log(
      "Added to cart:",
      item,
      "Quantity:",
      quantity,
      "Customizations:",
      customizations
    );
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    console.log("Buy now:", item);
  };

  return (
    <Card className="w-full flex flex-col">
      <img
        src={item.image}
        alt={item.name}
        width={300}
        height={200}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold">₹{item.price}</p>
          <Badge variant={item.available ? "default" : "secondary"}>
            {item.available ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Category: {item.category}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start w-full">
        <div className="flex gap-2 w-full mb-4">
          <Button
            className="flex-1"
            onClick={handleBuyNow}
            disabled={!item.available}
          >
            Buy Now
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsCartModalOpen(true)}
            disabled={!item.available}
          >
            Add to Cart
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowCustomizations(!showCustomizations)}
          className="mb-2"
        >
          Customizations{" "}
          {showCustomizations ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>

        {showCustomizations && (
          <div className="w-full">
            <h4 className="font-semibold mb-1">Spice Level:</h4>
            <div className="flex gap-2 mb-2">
              {item.customizations.spiceLevel.map((level) => (
                <Badge key={level} variant="outline">
                  {level}
                </Badge>
              ))}
            </div>
            <h4 className="font-semibold mb-1">Add-ons:</h4>
            <div className="flex gap-2">
              {item.customizations.addOns.map((addOn) => (
                <Badge key={addOn} variant="outline">
                  {addOn}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <CartModal
          isOpen={isCartModalOpen}
          onClose={() => setIsCartModalOpen(false)}
          onAddToCart={handleAddToCart}
          item={item}
        />
      </CardFooter>
    </Card>
  );
}
