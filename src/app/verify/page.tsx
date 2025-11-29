'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Search,
  Calendar,
  User,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CertificateData {
  code: string;
  issued_at: string;
  holder_name: string;
  activity_title: string;
  activity_date: string | null;
}

interface VerificationResult {
  valid: boolean;
  message: string;
  certificate?: CertificateData;
  error?: string;
}

function CertificateVerifyContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [code, setCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-verify if code is provided in URL
  useEffect(() => {
    if (initialCode && !hasSearched) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  const handleVerify = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/certificates/verify?code=${encodeURIComponent(code.trim())}`
      );
      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        valid: false,
        message: 'Eroare la verificarea certificatului',
        error: 'Eroare de conexiune',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Search Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Cod Certificat</CardTitle>
          <CardDescription>Codul se găsește pe certificat în format CC-XXXXXXXX</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="CC-XXXXXXXX"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="font-mono text-lg tracking-wider"
              maxLength={11}
            />
            <Button onClick={handleVerify} disabled={isLoading || !code.trim()}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="ml-2">Verifică</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {hasSearched && !isLoading && result && (
        <Card
          className={result.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}
        >
          <CardContent className="pt-6">
            {result.valid && result.certificate ? (
              <div className="space-y-4">
                {/* Valid Header */}
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle2 className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-lg">Certificat Valid</h3>
                    <p className="text-sm text-green-600">{result.message}</p>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="bg-white rounded-lg p-4 space-y-3 border border-green-200">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Titular</p>
                      <p className="font-medium text-gray-900">{result.certificate.holder_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Activitate</p>
                      <p className="font-medium text-gray-900">
                        {result.certificate.activity_title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Data emiterii</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(result.certificate.issued_at)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 font-mono">
                      Cod: {result.certificate.code}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-red-700">
                <XCircle className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg">Certificat Invalid</h3>
                  <p className="text-sm text-red-600">
                    {result.error ||
                      result.message ||
                      'Certificatul nu a fost găsit în baza de date'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}

function LoadingFallback() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Cod Certificat</CardTitle>
        <CardDescription>Codul se găsește pe certificat în format CC-XXXXXXXX</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="CC-XXXXXXXX"
            disabled
            className="font-mono text-lg tracking-wider"
          />
          <Button disabled>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="ml-2">Se încarcă...</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CertificateVerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificare Certificat</h1>
          <p className="text-gray-600">
            Introdu codul certificatului pentru a verifica autenticitatea
          </p>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <CertificateVerifyContent />
        </Suspense>

        {/* Info Section */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-2">
            Această pagină permite verificarea autenticității certificatelor emise de platforma
            Campus Connect.
          </p>
          <p>
            Pentru întrebări, contactați{' '}
            <a
              href="mailto:support@campusconnect-scs.work"
              className="text-blue-600 hover:underline"
            >
              support@campusconnect-scs.work
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
