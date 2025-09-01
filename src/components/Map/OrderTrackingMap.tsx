import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OrderTrackingMapProps {
  pickupAddress: string;
  dropoffAddress: string;
  riderLocation?: { lat: number; lng: number };
  orderStatus: string;
}

export const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({
  pickupAddress,
  dropoffAddress,
  riderLocation,
  orderStatus
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);

  // Simple fallback map without external dependencies
  const openInMaps = (address: string, label: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  const getStatusColor = () => {
    switch (orderStatus) {
      case 'pending': return 'text-yellow-600';
      case 'assigned': return 'text-blue-600';
      case 'picked_up': return 'text-purple-600';
      case 'in_transit': return 'text-orange-600';
      case 'delivered': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusMessage = () => {
    switch (orderStatus) {
      case 'pending': return 'Order is being processed';
      case 'assigned': return 'Rider assigned to your order';
      case 'picked_up': return 'Package has been picked up';
      case 'in_transit': return 'Package is on the way';
      case 'delivered': return 'Package has been delivered';
      default: return 'Tracking your package';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg bg-muted ${getStatusColor()}`}>
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              <span className="font-medium">{getStatusMessage()}</span>
            </div>
          </div>

          {/* Dummy Map Interface */}
          <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
            {/* Grid pattern to simulate map */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-muted-foreground/20"></div>
                ))}
              </div>
            </div>
            
            {/* Route line simulation */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 50 200 Q 150 100 250 150"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
            
            {/* Location markers */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
              <MapPin className="h-3 w-3" />
              Pickup
            </div>
            
            <div className="absolute top-6 right-4 flex items-center gap-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              <MapPin className="h-3 w-3" />
              Delivery
            </div>
            
            {/* Rider marker (if available) */}
            {riderLocation && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs animate-bounce">
                <Navigation className="h-3 w-3" />
                Rider
              </div>
            )}
            
            {/* Map controls overlay */}
            <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openInMaps(pickupAddress, 'Pickup Location')}
                className="bg-background/80 backdrop-blur-sm flex items-center gap-2"
              >
                <MapPin className="h-3 w-3" />
                View Pickup
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openInMaps(dropoffAddress, 'Delivery Location')}
                className="bg-background/80 backdrop-blur-sm flex items-center gap-2"
              >
                <MapPin className="h-3 w-3" />
                View Delivery
              </Button>
            </div>
            
            {/* Zoom controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
                +
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
                -
              </Button>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Pickup Location</p>
                <p className="text-sm text-green-700">{pickupAddress}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Delivery Location</p>
                <p className="text-sm text-red-700">{dropoffAddress}</p>
              </div>
            </div>

            {riderLocation && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Navigation className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Rider Location</p>
                  <p className="text-sm text-blue-700">
                    Lat: {riderLocation.lat.toFixed(6)}, Lng: {riderLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};