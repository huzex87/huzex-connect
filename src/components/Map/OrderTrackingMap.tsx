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

          {/* Map Placeholder */}
          <div className="relative h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-muted-foreground mb-4">
                Interactive map view coming soon
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openInMaps(pickupAddress, 'Pickup Location')}
                >
                  View Pickup on Maps
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openInMaps(dropoffAddress, 'Delivery Location')}
                >
                  View Delivery on Maps
                </Button>
              </div>
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