'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/loading-spinner';
import {
  getEmailServiceStatus,
  testEmailConnectivity,
  sendTestWelcomeEmail,
  sendTestPasswordResetEmail,
  sendTestOrderConfirmationEmail,
  sendTestOrderConfirmationWithInvoice,
  downloadSampleInvoice,
  downloadOrderInvoice,
  downloadBlob,
  validateEmailRequest,
  isEmailServiceHealthy,
  getServiceStatusColor,
  getServiceStatusText,
  type EmailServiceStatus,
  type EmailTestRequest,
  type EmailTestResponse,
  type ConnectivityTestResponse
} from '@/lib/api/admin-email';

export function EmailTestingDashboard() {
  const [serviceStatus, setServiceStatus] = useState<EmailServiceStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isTestingConnectivity, setIsTestingConnectivity] = useState(false);
  const [connectivityResult, setConnectivityResult] = useState<ConnectivityTestResponse | null>(null);
  
  const { toast } = useToast();

  // Test email forms
  const [welcomeForm, setWelcomeForm] = useState<EmailTestRequest>({
    email: '',
    name: ''
  });

  const [passwordResetForm, setPasswordResetForm] = useState<EmailTestRequest>({
    email: ''
  });

  const [orderConfirmationForm, setOrderConfirmationForm] = useState<EmailTestRequest>({
    email: '',
    orderNumber: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<{
    welcome: boolean;
    passwordReset: boolean;
    orderConfirmation: boolean;
    orderWithInvoice: boolean;
    sampleInvoice: boolean;
    orderInvoice: boolean;
  }>({
    welcome: false,
    passwordReset: false,
    orderConfirmation: false,
    orderWithInvoice: false,
    sampleInvoice: false,
    orderInvoice: false
  });

  const [testResults, setTestResults] = useState<{
    welcome?: EmailTestResponse;
    passwordReset?: EmailTestResponse;
    orderConfirmation?: EmailTestResponse;
    orderWithInvoice?: EmailTestResponse;
  }>({});

  // Load service status on mount
  useEffect(() => {
    loadServiceStatus();
  }, []);

  const loadServiceStatus = async () => {
    try {
      setIsLoadingStatus(true);
      const status = await getEmailServiceStatus();
      setServiceStatus(status);
    } catch (error) {
      console.error('Failed to load email service status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email service status.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleTestConnectivity = async () => {
    try {
      setIsTestingConnectivity(true);
      const result = await testEmailConnectivity();
      setConnectivityResult(result);
      
      toast({
        title: result.success ? 'Success' : 'Connection Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Failed to test connectivity:', error);
      toast({
        title: 'Error',
        description: 'Failed to test email connectivity.',
        variant: 'destructive',
      });
    } finally {
      setIsTestingConnectivity(false);
    }
  };

  const handleSendTestWelcomeEmail = async () => {
    const errors = validateEmailRequest(welcomeForm, 'welcome');
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(prev => ({ ...prev, welcome: true }));
      const result = await sendTestWelcomeEmail(welcomeForm);
      setTestResults(prev => ({ ...prev, welcome: result }));
      
      toast({
        title: result.success ? 'Email Sent' : 'Send Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });

      if (result.success) {
        setWelcomeForm({ email: '', name: '' });
      }
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test welcome email.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(prev => ({ ...prev, welcome: false }));
    }
  };

  const handleSendTestPasswordResetEmail = async () => {
    const errors = validateEmailRequest(passwordResetForm, 'password-reset');
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(prev => ({ ...prev, passwordReset: true }));
      const result = await sendTestPasswordResetEmail(passwordResetForm);
      setTestResults(prev => ({ ...prev, passwordReset: result }));
      
      toast({
        title: result.success ? 'Email Sent' : 'Send Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });

      if (result.success) {
        setPasswordResetForm({ email: '' });
      }
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test password reset email.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(prev => ({ ...prev, passwordReset: false }));
    }
  };

  const handleSendTestOrderConfirmationEmail = async () => {
    const errors = validateEmailRequest(orderConfirmationForm, 'order-confirmation');
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(prev => ({ ...prev, orderConfirmation: true }));
      const result = await sendTestOrderConfirmationEmail(orderConfirmationForm);
      setTestResults(prev => ({ ...prev, orderConfirmation: result }));
      
      toast({
        title: result.success ? 'Email Sent' : 'Send Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });

      if (result.success) {
        setOrderConfirmationForm({ email: '', orderNumber: '' });
      }
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test order confirmation email.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(prev => ({ ...prev, orderConfirmation: false }));
    }
  };

  const handleSendTestOrderConfirmationWithInvoice = async () => {
    const errors = validateEmailRequest(orderConfirmationForm, 'order-confirmation');
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(prev => ({ ...prev, orderWithInvoice: true }));
      const result = await sendTestOrderConfirmationWithInvoice(orderConfirmationForm);
      setTestResults(prev => ({ ...prev, orderWithInvoice: result }));
      
      toast({
        title: result.success ? 'Email with Invoice Sent' : 'Send Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Failed to send order confirmation with invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test email with invoice.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(prev => ({ ...prev, orderWithInvoice: false }));
    }
  };

  const handleDownloadSampleInvoice = async () => {
    try {
      setIsSubmitting(prev => ({ ...prev, sampleInvoice: true }));
      const blob = await downloadSampleInvoice();
      downloadBlob(blob, 'sample-invoice.pdf');
      
      toast({
        title: 'Success',
        description: 'Sample invoice downloaded successfully.',
      });
    } catch (error) {
      console.error('Failed to download sample invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to download sample invoice.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(prev => ({ ...prev, sampleInvoice: false }));
    }
  };

  const handleDownloadOrderInvoice = async () => {
    if (!orderConfirmationForm.orderNumber?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Order number is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(prev => ({ ...prev, orderInvoice: true }));
      const blob = await downloadOrderInvoice(orderConfirmationForm.orderNumber);
      downloadBlob(blob, `invoice-${orderConfirmationForm.orderNumber}.pdf`);
      
      toast({
        title: 'Success',
        description: 'Order invoice downloaded successfully.',
      });
    } catch (error) {
      console.error('Failed to download order invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to download order invoice.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(prev => ({ ...prev, orderInvoice: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Testing Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor email service health and test email functionality.
          </p>
        </div>
        
        <Button onClick={loadServiceStatus} disabled={isLoadingStatus}>
          {isLoadingStatus ? (
            <>
              <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <Icons.repeatIcon className="w-4 h-4 mr-2" />
              Refresh Status
            </>
          )}
        </Button>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Email Service Status</CardTitle>
          <CardDescription>
            Current health and configuration of the email service
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingStatus ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : serviceStatus ? (
            <div className="space-y-6">
              {/* Overall Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Overall Service Health</h3>
                  <p className="text-sm text-muted-foreground">
                    Email service operational status
                  </p>
                </div>
                <Badge variant={getServiceStatusColor(isEmailServiceHealthy(serviceStatus)) as any}>
                  {getServiceStatusText(isEmailServiceHealthy(serviceStatus))}
                </Badge>
              </div>

              {/* Detailed Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icons.mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email Service</span>
                  </div>
                  <Badge variant={serviceStatus.emailServiceAvailable ? 'default' : 'destructive'}>
                    {serviceStatus.emailServiceAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icons.shield className="w-4 h-4" />
                    <span className="text-sm font-medium">SMTP Connection</span>
                  </div>
                  <Badge variant={serviceStatus.smtpConnected ? 'default' : 'destructive'}>
                    {serviceStatus.smtpConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icons.star className="w-4 h-4" />
                    <span className="text-sm font-medium">Mail Sender</span>
                  </div>
                  <Badge variant={serviceStatus.mailSenderConfigured ? 'default' : 'destructive'}>
                    {serviceStatus.mailSenderConfigured ? 'Configured' : 'Not Configured'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icons.star className="w-4 h-4" />
                    <span className="text-sm font-medium">Invoice Service</span>
                  </div>
                  <Badge variant={serviceStatus.invoiceServiceAvailable ? 'default' : 'destructive'}>
                    {serviceStatus.invoiceServiceAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icons.star className="w-4 h-4" />
                    <span className="text-sm font-medium">Templates</span>
                  </div>
                  <Badge variant={serviceStatus.templatesLoaded ? 'default' : 'destructive'}>
                    {serviceStatus.templatesLoaded ? 'Loaded' : 'Not Loaded'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icons.clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Last Checked</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(serviceStatus.lastChecked)}
                  </span>
                </div>
              </div>

              {/* Connectivity Test */}
              <div className="space-y-4">
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMTP Connectivity Test</h3>
                    <p className="text-sm text-muted-foreground">
                      Test actual connection to the SMTP server
                    </p>
                  </div>
                  <Button 
                    onClick={handleTestConnectivity}
                    disabled={isTestingConnectivity}
                    variant="outline"
                  >
                    {isTestingConnectivity ? (
                      <>
                        <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Icons.shield className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>

                {connectivityResult && (
                  <div className={`p-4 border rounded-lg ${connectivityResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {connectivityResult.success ? (
                        <Icons.badgeCheck className="w-5 h-5 text-green-600" />
                      ) : (
                        <Icons.x className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {connectivityResult.success ? 'Connection Successful' : 'Connection Failed'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {connectivityResult.message}
                    </p>
                    {connectivityResult.details && (
                      <div className="text-xs space-y-1">
                        {connectivityResult.smtpHost && (
                          <div>Host: {connectivityResult.smtpHost}:{connectivityResult.smtpPort}</div>
                        )}
                        {connectivityResult.connectionTime && (
                          <div>Connection Time: {connectivityResult.connectionTime}ms</div>
                        )}
                        {connectivityResult.tlsEnabled !== undefined && (
                          <div>TLS: {connectivityResult.tlsEnabled ? 'Enabled' : 'Disabled'}</div>
                        )}
                        {connectivityResult.authenticationMethod && (
                          <div>Auth: {connectivityResult.authenticationMethod}</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Failed to load service status</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Testing Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Welcome Email Test */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome Email Test</CardTitle>
            <CardDescription>
              Send a test welcome email to verify template and functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="welcome-email">Email Address</Label>
              <Input
                id="welcome-email"
                type="email"
                value={welcomeForm.email}
                onChange={(e) => setWelcomeForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="test@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="welcome-name">Name</Label>
              <Input
                id="welcome-name"
                value={welcomeForm.name || ''}
                onChange={(e) => setWelcomeForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <Button 
              onClick={handleSendTestWelcomeEmail}
              disabled={isSubmitting.welcome}
              className="w-full"
            >
              {isSubmitting.welcome ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Icons.mail className="w-4 h-4 mr-2" />
                  Send Welcome Email
                </>
              )}
            </Button>
            {testResults.welcome && (
              <div className={`p-3 rounded-lg text-sm ${testResults.welcome.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="font-medium">
                  {testResults.welcome.success ? 'Email Sent Successfully' : 'Failed to Send Email'}
                </div>
                <div className="text-muted-foreground">{testResults.welcome.message}</div>
                {testResults.welcome.sentAt && (
                  <div className="text-xs mt-1">Sent: {formatDate(testResults.welcome.sentAt)}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Password Reset Email Test */}
        <Card>
          <CardHeader>
            <CardTitle>Password Reset Email Test</CardTitle>
            <CardDescription>
              Send a test password reset email to verify security template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                value={passwordResetForm.email}
                onChange={(e) => setPasswordResetForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="test@example.com"
              />
            </div>
            <Button 
              onClick={handleSendTestPasswordResetEmail}
              disabled={isSubmitting.passwordReset}
              className="w-full"
            >
              {isSubmitting.passwordReset ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Icons.shield className="w-4 h-4 mr-2" />
                  Send Password Reset
                </>
              )}
            </Button>
            {testResults.passwordReset && (
              <div className={`p-3 rounded-lg text-sm ${testResults.passwordReset.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="font-medium">
                  {testResults.passwordReset.success ? 'Email Sent Successfully' : 'Failed to Send Email'}
                </div>
                <div className="text-muted-foreground">{testResults.passwordReset.message}</div>
                {testResults.passwordReset.sentAt && (
                  <div className="text-xs mt-1">Sent: {formatDate(testResults.passwordReset.sentAt)}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Confirmation Email Test */}
        <Card>
          <CardHeader>
            <CardTitle>Order Confirmation Email Test</CardTitle>
            <CardDescription>
              Send test order confirmation emails and download invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order-email">Email Address</Label>
              <Input
                id="order-email"
                type="email"
                value={orderConfirmationForm.email}
                onChange={(e) => setOrderConfirmationForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="test@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-number">Order Number</Label>
              <Input
                id="order-number"
                value={orderConfirmationForm.orderNumber || ''}
                onChange={(e) => setOrderConfirmationForm(prev => ({ ...prev, orderNumber: e.target.value }))}
                placeholder="ORD-20240101-001"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleSendTestOrderConfirmationEmail}
                disabled={isSubmitting.orderConfirmation}
                variant="outline"
              >
                {isSubmitting.orderConfirmation ? (
                  <Icons.spinner className="w-4 h-4 animate-spin" />
                ) : (
                  'Send Email'
                )}
              </Button>
              <Button 
                onClick={handleSendTestOrderConfirmationWithInvoice}
                disabled={isSubmitting.orderWithInvoice}
              >
                {isSubmitting.orderWithInvoice ? (
                  <Icons.spinner className="w-4 h-4 animate-spin" />
                ) : (
                  'Send with Invoice'
                )}
              </Button>
            </div>
            {(testResults.orderConfirmation || testResults.orderWithInvoice) && (
              <div className="space-y-2">
                {testResults.orderConfirmation && (
                  <div className={`p-3 rounded-lg text-sm ${testResults.orderConfirmation.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="font-medium">Order Email: {testResults.orderConfirmation.success ? 'Sent' : 'Failed'}</div>
                    <div className="text-muted-foreground">{testResults.orderConfirmation.message}</div>
                  </div>
                )}
                {testResults.orderWithInvoice && (
                  <div className={`p-3 rounded-lg text-sm ${testResults.orderWithInvoice.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="font-medium">Email with Invoice: {testResults.orderWithInvoice.success ? 'Sent' : 'Failed'}</div>
                    <div className="text-muted-foreground">{testResults.orderWithInvoice.message}</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice PDF Testing</CardTitle>
            <CardDescription>
              Download and test PDF invoice generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleDownloadSampleInvoice}
              disabled={isSubmitting.sampleInvoice}
              className="w-full"
              variant="outline"
            >
              {isSubmitting.sampleInvoice ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Icons.star className="w-4 h-4 mr-2" />
                  Download Sample Invoice
                </>
              )}
            </Button>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Download Order Invoice</Label>
              <p className="text-sm text-muted-foreground">
                Use the order number from the form above
              </p>
            </div>
            <Button 
              onClick={handleDownloadOrderInvoice}
              disabled={isSubmitting.orderInvoice || !orderConfirmationForm.orderNumber}
              className="w-full"
            >
              {isSubmitting.orderInvoice ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Icons.star className="w-4 h-4 mr-2" />
                  Download Order Invoice
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
