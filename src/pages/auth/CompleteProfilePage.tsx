// src/pages/auth/CompleteProfilePage.tsx - WITH PROTECTION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, MapPin, Phone, Mail, Globe, 
  FileText, CreditCard, CheckCircle, ArrowLeft, ArrowRight 
} from 'lucide-react';
import { Card } from '../../shared/components/ui/Card';
import { Input } from '../../shared/components/ui/Input';
import { MagneticButton } from '../../shared/components/animated/MagneticButton';
import { ProgressWizard, WizardStep } from '../../shared/components/wizard/ProgressWizard';
import { DocumentUpload } from '../../shared/components/upload/DocumentUpload';
import { fadeInUp, staggerContainer } from '../../shared/utils/animations';
import api from '../../shared/utils/api';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  // Business Address
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  
  // Business Contact
  businessPhone: z.string().min(10, 'Business phone is required'),
  businessEmail: z.string().email('Invalid business email'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  
  // Bank Details
  bankName: z.string().min(2, 'Bank name is required'),
  accountNumber: z.string().min(5, 'Account number is required'),
  accountHolderName: z.string().min(2, 'Account holder name is required'),
  ifscCode: z.string().optional(),
  swiftCode: z.string().optional(),
  
  // Optional fields
  businessRegistrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  businessType: z.string().optional(),
  businessCategory: z.string().optional(),
  description: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const wizardSteps: WizardStep[] = [
  { id: 1, title: 'Business Details', description: 'Address & Contact' },
  { id: 2, title: 'Bank Information', description: 'Payment Details' },
  { id: 3, title: 'Documents', description: 'Verification Files' },
];

export const CompleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Document states
  const [identityDoc, setIdentityDoc] = useState<File | null>(null);
  const [registrationDoc, setRegistrationDoc] = useState<File | null>(null);
  const [taxDoc, setTaxDoc] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Check if profile is already submitted
  useEffect(() => {
    checkProfileStatus();
  }, []);

  const checkProfileStatus = async () => {
    try {
      const response = await api.get('/auth/merchant/profile-status');
      const { status } = response.data;
      
      // If profile is already pending or approved, redirect
      if (status === 'pending') {
        toast.info('Your profile is already under review');
        navigate('/merchant/pending-verification');
        return;
      }
      
      if (status === 'approved') {
        toast.success('Your profile is already verified!');
        navigate('/merchant/dashboard');
        return;
      }
      
      // Only allow if status is 'incomplete' or 'rejected'
      setIsCheckingStatus(false);
      
    } catch (error) {
      console.error('Error checking status:', error);
      // If error, allow them to proceed (fail-safe)
      setIsCheckingStatus(false);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof ProfileFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['address', 'city', 'country', 'businessPhone', 'businessEmail'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['bankName', 'accountNumber', 'accountHolderName'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: ProfileFormData) => {
    // Validate documents
    if (!identityDoc) {
      toast.error('Identity document is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Append files
      if (identityDoc) formData.append('identityDocument', identityDoc);
      if (registrationDoc) formData.append('registrationDocument', registrationDoc);
      if (taxDoc) formData.append('taxDocument', taxDoc);

      await api.post('/auth/merchant/complete-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Profile submitted for verification!');
      navigate('/merchant/pending-verification');
    } catch (error: any) {
      console.error('Profile completion error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking status
  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Wizard */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <ProgressWizard steps={wizardSteps} currentStep={currentStep} />
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <Card className="backdrop-blur-sm bg-white/90 border-2 border-gray-200/50 shadow-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* STEP 1: Business Details */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Building className="w-6 h-6 text-blue-600" />
                        Business Details
                      </h2>
                      <p className="text-gray-600">Tell us about your business location and contact information</p>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        Business Address
                      </h3>

                      <Input
                        label="Street Address"
                        placeholder="123 Main Street"
                        error={errors.address?.message}
                        {...register('address')}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="City"
                          placeholder="Mumbai"
                          error={errors.city?.message}
                          {...register('city')}
                        />
                        <Input
                          label="State/Province"
                          placeholder="Maharashtra"
                          error={errors.state?.message}
                          {...register('state')}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="ZIP/Postal Code"
                          placeholder="400001"
                          error={errors.zipCode?.message}
                          {...register('zipCode')}
                        />
                        <Input
                          label="Country"
                          placeholder="India"
                          error={errors.country?.message}
                          {...register('country')}
                        />
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-green-600" />
                        Contact Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Business Phone"
                          placeholder="+919876543210"
                          error={errors.businessPhone?.message}
                          {...register('businessPhone')}
                        />
                        <Input
                          label="Business Email"
                          type="email"
                          placeholder="business@example.com"
                          error={errors.businessEmail?.message}
                          {...register('businessEmail')}
                        />
                      </div>

                      <Input
                        label="Website (Optional)"
                        placeholder="https://yourbusiness.com"
                        error={errors.website?.message}
                        {...register('website')}
                      />
                    </div>

                    {/* Optional Fields */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Additional Information (Optional)</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Business Registration Number"
                          placeholder="REG123456"
                          {...register('businessRegistrationNumber')}
                        />
                        <Input
                          label="Tax ID"
                          placeholder="TAX123456"
                          {...register('taxId')}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Business Type"
                          placeholder="E-commerce, Restaurant, etc."
                          {...register('businessType')}
                        />
                        <Input
                          label="Business Category"
                          placeholder="Retail, Services, etc."
                          {...register('businessCategory')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Brief description of your business..."
                          {...register('description')}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Bank Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        Bank Information
                      </h2>
                      <p className="text-gray-600">Enter your bank details for receiving payments</p>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Bank Name"
                        placeholder="HDFC Bank"
                        error={errors.bankName?.message}
                        {...register('bankName')}
                      />

                      <Input
                        label="Account Number"
                        placeholder="1234567890"
                        error={errors.accountNumber?.message}
                        {...register('accountNumber')}
                      />

                      <Input
                        label="Account Holder Name"
                        placeholder="As per bank records"
                        error={errors.accountHolderName?.message}
                        {...register('accountHolderName')}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="IFSC Code (India)"
                          placeholder="HDFC0000123"
                          {...register('ifscCode')}
                        />
                        <Input
                          label="SWIFT Code (International)"
                          placeholder="HDFCINBB"
                          {...register('swiftCode')}
                        />
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Your bank details will be kept secure and used only for processing payments when customers redeem gift cards at your store.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Documents */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        Verification Documents
                      </h2>
                      <p className="text-gray-600">Upload documents to verify your business</p>
                    </div>

                    <div className="space-y-6">
                      <DocumentUpload
                        label="Identity Document (Required)"
                        required
                        value={identityDoc}
                        onChange={setIdentityDoc}
                        helperText="Upload Aadhaar, PAN, Passport, or Driver's License"
                      />

                      <DocumentUpload
                        label="Business Registration Document (Optional)"
                        value={registrationDoc}
                        onChange={setRegistrationDoc}
                        helperText="GST Certificate, Shop Act License, or Incorporation Certificate"
                      />

                      <DocumentUpload
                        label="Tax Document (Optional)"
                        value={taxDoc}
                        onChange={setTaxDoc}
                        helperText="GST Registration or Tax Registration Document"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            What happens next?
                          </p>
                          <p className="text-sm text-blue-700">
                            Our team will review your documents within 24-48 hours. You'll receive an email notification once your account is verified and you can start creating gift cards!
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 ? (
                  <MagneticButton
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </MagneticButton>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <MagneticButton
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </MagneticButton>
                ) : (
                  <MagneticButton
                    type="submit"
                    variant="primary"
                    onClick={handleSubmit(onSubmit)}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit for Verification
                        <CheckCircle className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </MagneticButton>
                )}
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};