import { Badge } from "@/components/ui/badge"
import { Shield, Award, Zap, Users, CheckCircle, Star } from "lucide-react"

interface TrustBadgeProps {
  type: 'security' | 'award' | 'speed' | 'users' | 'verified' | 'rating'
  text: string
  className?: string
}

export const TrustBadge = ({ type, text, className }: TrustBadgeProps) => {
  const configs = {
    security: {
      icon: Shield,
      className: "bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20"
    },
    award: {
      icon: Award,
      className: "bg-yellow-500/10 text-yellow-700 border-yellow-200 hover:bg-yellow-500/20"
    },
    speed: {
      icon: Zap,
      className: "bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20"
    },
    users: {
      icon: Users,
      className: "bg-purple-500/10 text-purple-700 border-purple-200 hover:bg-purple-500/20"
    },
    verified: {
      icon: CheckCircle,
      className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
    },
    rating: {
      icon: Star,
      className: "bg-orange-500/10 text-orange-700 border-orange-200 hover:bg-orange-500/20"
    }
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${className} transition-all duration-300 hover-lift cursor-pointer`}
    >
      <Icon className="h-3 w-3 mr-1" />
      {text}
    </Badge>
  )
}

export const TrustSignals = () => (
  <div className="flex flex-wrap gap-2 justify-center">
    <TrustBadge type="verified" text="LASRRA Licensed" />
    <TrustBadge type="security" text="SSL Secured" />
    <TrustBadge type="users" text="150+ Active Riders" />
    <TrustBadge type="rating" text="4.8★ Rating" />
    <TrustBadge type="speed" text="Same Day Delivery" />
    <TrustBadge type="award" text="Best Logistics 2024" />
  </div>
)