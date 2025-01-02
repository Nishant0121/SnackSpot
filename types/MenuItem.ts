export type MenuItem = {
  itemID: number;
  name: string;
  price: number;
  description: string;
  image: string;
  available: boolean;
  category: string;
  customizations: {
    spiceLevel: string[];
    addOns: string[];
  };
};

