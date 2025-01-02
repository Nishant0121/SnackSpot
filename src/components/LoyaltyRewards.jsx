import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const badges = [
  { id: 1, name: 'First Order', description: 'Placed your first order' },
  { id: 2, name: 'Frequent Snacker', description: 'Placed 10 orders' },
  { id: 3, name: 'Veggie Lover', description: 'Ordered 5 vegetarian meals' },
]

export default function LoyaltyRewards() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4">Loyalty Rewards</h2>
      <div className="mb-4">
        <p className="text-lg font-medium">Total Points: <span className="text-green-600">500</span></p>
        <Button className="mt-2">Redeem Points</Button>
      </div>
      <div>
        <h3 className="text-xl font-medium mb-2">Badges</h3>
        <div className="space-y-2">
          {badges.map((badge) => (
            <div key={badge.id} className="flex items-center space-x-2">
              <Badge variant="secondary">{badge.name}</Badge>
              <span className="text-sm text-gray-600">{badge.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

