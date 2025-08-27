import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Package } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const paymentRef = searchParams.get('payment_ref');

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment has been processed successfully.
          </p>
          
          {orderId && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">Order ID</p>
              <p className="text-lg font-mono">{orderId}</p>
            </div>
          )}
          
          {paymentRef && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">Payment Reference</p>
              <p className="text-sm font-mono">{paymentRef}</p>
            </div>
          )}
          
          <div className="space-y-2 pt-4">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                <Package className="h-4 w-4 mr-2" />
                View My Orders
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};