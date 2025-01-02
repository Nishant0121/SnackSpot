import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

const favorites = [
  { id: 1, name: 'Cheeseburger' },
  { id: 2, name: 'Pepperoni Pizza' },
  { id: 3, name: 'Caesar Salad' },
]

export default function Favorites() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
      <ul className="space-y-2">
        {favorites.map((item) => (
          <li key={item.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span>{item.name}</span>
            <Button variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

