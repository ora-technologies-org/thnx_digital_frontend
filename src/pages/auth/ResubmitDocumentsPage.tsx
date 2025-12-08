// src/pages/auth/ResubmitDocumentsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import { Card } from '../../shared/components/ui/Card';
import { MagneticButton } from '../../shared/components/animated/MagneticButton';
import { DocumentUpload } from '../../shared/components/upload/DocumentUpload';
import { fadeInUp, staggerContainer } from '../../shared/utils/animations';
import api from '../../shared/utils/api';
import toast from 'react-hot-toast';


export const ResubmitDocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  
  // Document states
  const [identityDoc, setIdentityDoc] = useState<File | null>(null);
  const [registrationDoc, setRegistrationDoc] = useState<File | null>(null);
  const [taxDoc, setTaxDoc] = useState<File | null>(null);

  useEffect(() => {
    fetchRejectionDetails();
  }, []);

  const fetchRejectionDetails = async () => {
    try {
      const response = await api.get('/auth/merchant/rejection-details');
      setRejectionReason(response.data.rejectionReason);
    } catch (error) {
      console.error('Error fetching rejection details:', error);
    }
  };

  const handleResubmit = async () => {
    if (!identityDoc) {
      toast.error('Identity document is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append files
      if (identityDoc) formData.append('identityDocument', identityDoc);
      if (registrationDoc) formData.append('registrationDocument', registrationDoc);
      if (taxDoc) formData.append('taxDocument', taxDoc);

      await api.post('/auth/merchant/resubmit-documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Documents resubmitted successfully!');
      navigate('/merchant/pending-verification');
    } catch (error: any) {
      console.error('Resubmission error:', error);
      toast.error(error.response?.data?.message || 'Failed to resubmit documents');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl mb-4 shadow-xl"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <RefreshCw className="h-8 w-8 text-white" />
            </motion.div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Resubmit Documents
            </h1>
            <p className="text-gray-600 text-lg">
              Upload corrected documents for verification
            </p>
          </motion.div>

          {/* Rejection Reason Card */}
          {rejectionReason && (
            <motion.div variants={fadeInUp} className="mb-8">
              <Card className="bg-red-50 border-2 border-red-200">
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 mb-2">
                        Previous Rejection Reason:
                      </h3>
                      <p className="text-red-700">{rejectionReason}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Main Form Card */}
          <motion.div variants={fadeInUp}>
            <Card className="backdrop-blur-sm bg-white/90 border-2 border-gray-200/50 shadow-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Upload New Documents
                  </h2>
                  <p className="text-gray-600">
                    Please ensure all documents are clear, valid, and match the information in your profile
                  </p>
                </div>

                <div className="space-y-6">
                  <DocumentUpload
                    label="Identity Document (Required)"
                    required
                    value={identityDoc}
                    onChange={setIdentityDoc}
                    helperText="Upload clear copy of Aadhaar, PAN, Passport, or Driver's License"
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

                {/* Checklist */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    Document Checklist:
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      Documents are clear and readable
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      All information is visible and not cut off
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      Documents are valid and not expired
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      Names match across all documents
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleResubmit}
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
                      Resubmit for Verification
                      <CheckCircle className="ml-2 h-5 w-5" />
                    </>
                  )}
                </MagneticButton>

                <p className="text-center text-sm text-gray-600">
                  By resubmitting, you agree that all information provided is accurate and truthful
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Help Card */}
          <motion.div variants={fadeInUp} className="mt-6">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
              <div className="p-6 text-center">
                <p className="text-gray-700 mb-2">
                  <strong>Need help?</strong>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  If you're unsure about the required documents, contact our support team
                </p>
                <a
                  href="mailto:support@thnxdigital.com"
                  className="text-blue-600 hover:underline font-medium"
                >
                  support@thnxdigital.com
                </a>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};