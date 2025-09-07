import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, Package } from 'lucide-react';
import { usePaystackPayment } from '@/hooks/usePaystackPayment';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment, loading } = usePaystackPayment();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [transactionData, setTransactionData] = useState<any>(null);

  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  useEffect(() => {
    const paymentReference = reference || trxref;
    
    if (paymentReference) {
      verifyPaymentStatus(paymentReference);
    } else {
      setVerificationStatus('failed');
    }
  }, [reference, trxref]);

  const verifyPaymentStatus = async (ref: string) => {
    const result = await verifyPayment(ref);
    
    if (result.success) {
      setVerificationStatus('success');
      setTransactionData(result.transaction);
    } else {
      setVerificationStatus('failed');
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Clock className="h-16 w-16 text-yellow-500 animate-pulse" />;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      default:
        return 'Verifying Payment...';
    }
  };

  const getStatusDescription = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Your payment has been confirmed and your order is being processed.';
      case 'failed':
        return 'We could not verify your payment. Please contact support if you were charged.';
      default:
        return 'Please wait while we verify your payment status.';
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-xl">{getStatusTitle()}</CardTitle>
          <CardDescription>{getStatusDescription()}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}

          {transactionData && verificationStatus === 'success' && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Transaction Details</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <span className="font-mono">{transactionData.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>₦{(transactionData.amount / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Channel:</span>
                  <span className="capitalize">{transactionData.channel}</span>
                </div>
                {transactionData.paid_at && (
                  <div className="flex justify-between">
                    <span>Paid At:</span>
                    <span>{new Date(transactionData.paid_at).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {verificationStatus === 'success' && (
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                <Package className="h-4 w-4 mr-2" />
                View Orders
              </Button>
            )}
            
            <Button
              variant={verificationStatus === 'success' ? 'outline' : 'default'}
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Back to Home
            </Button>

            {verificationStatus === 'failed' && (
              <Button
                variant="outline"
                onClick={() => navigate('/help')}
                className="flex-1"
              >
                Get Help
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};