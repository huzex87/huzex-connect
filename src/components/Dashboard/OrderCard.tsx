import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Phone, Truck, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  order: any;
  variant?: 'default' | 'compact';
  showActions?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  variant = 'default',
  showActions = true 
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'assigned': return 'bg-blue-500';
      case 'picked_up': return 'bg-purple-500';
      case 'in_transit': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`} />
              <div>
                <p className="font-semibold text-sm">{order.order_id}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className={`${getStatusColor(order.status)} text-white text-xs`}
            >
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {order.order_id}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
            </p>
          </div>
          <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
            <div className="flex items-center gap-1">
              {getStatusIcon(order.status)}
              {order.status.replace('_', ' ').toUpperCase()}
            </div>
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-medium text-muted-foreground">Pickup:</span>
                <p className="text-foreground break-words">{order.pickup_address}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-medium text-muted-foreground">Delivery:</span>
                <p className="text-foreground break-words">{order.dropoff_address}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {order.riders && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {order.riders.name?.charAt(0) || 'R'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{order.riders.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>⭐ {order.riders.rating || 5.0}</span>
                    <span>•</span>
                    <span>{order.riders.phone}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Item:</span>
                <p className="text-foreground truncate">{order.item_description}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Weight:</span>
                <p className="text-foreground">{order.weight_kg}kg</p>
              </div>
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {order.speed && (
                <span className="capitalize">{order.speed.replace('_', ' ')} delivery</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/track?order_id=${order.order_id}`)}
                className="group-hover:border-primary group-hover:text-primary transition-colors"
              >
                <Truck className="h-4 w-4 mr-2" />
                Track Package
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};