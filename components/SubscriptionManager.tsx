
import React, { useState } from 'react';
import { SubscriptionTier, CompanySubscription } from '../types';

interface SubscriptionManagerProps {
  currentSubscription: CompanySubscription;
  onUpgrade: (tier: SubscriptionTier) => void;
}

const PLANS = [
  {
    tier: SubscriptionTier.FREE,
    name: 'Solo Designer',
    price: '0',
    features: ['1 Active Project', 'Basic Workflow', 'Public Portfolio', 'Community AI'],
    recommended: false
  },
  {
    tier: SubscriptionTier.PRO,
    name: 'Pro Interiorist',
    price: '4,500',
    features: ['Unlimited Projects', 'Private Notes', 'AI Advanced Consultant', 'Custom Branding', 'Export BOQs'],
    recommended: true
  },
  {
    tier: SubscriptionTier.STUDIO,
    name: 'Design Studio',
    price: '12,000',
    features: ['Everything in Pro', 'Multi-user Team Access', 'Advanced Analytics', 'Client Portal Customization', 'Priority Support'],
    recommended: false
  }
];

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ currentSubscription, onUpgrade }) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'plans' | 'payment' | 'success'>('plans');

  const handleSelectPlan = (tier: SubscriptionTier) => {
    if (tier === currentSubscription.tier) return;
    setSelectedTier(tier);
    setStep('payment');
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    // Simulate M-Pesa STK Push delay
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      if (selectedTier) onUpgrade(selectedTier);
    }, 3000);
  };

  if (step === 'success') {
    return (
      <div className="text-center py-12 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <i className="fas fa-check-circle"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-500 mb-8">Your workspace has been upgraded to the {PLANS.find(p => p.tier === selectedTier)?.name} plan.</p>
        <button 
          onClick={() => setStep('plans')}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="max-w-md mx-auto py-8 animate-in slide-in-from-right-4 duration-300">
        <button onClick={() => setStep('plans')} className="mb-6 text-sm font-bold text-gray-500 hover:text-gray-700">
          <i className="fas fa-arrow-left mr-2"></i> Back to Plans
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Your Subscription</h3>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex gap-4">
            <button 
              onClick={() => setPaymentMethod('mpesa')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                paymentMethod === 'mpesa' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl">
                <i className="fas fa-mobile-screen"></i>
              </div>
              <span className="text-xs font-bold text-gray-700">M-PESA</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                <i className="fas fa-credit-card"></i>
              </div>
              <span className="text-xs font-bold text-gray-700">Card</span>
            </button>
          </div>

          {paymentMethod === 'mpesa' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">M-Pesa Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">+254</span>
                  <input 
                    type="tel"
                    className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm font-medium"
                    placeholder="712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 italic">
                * An STK Push will be sent to your phone. Enter your PIN to authorize KES {PLANS.find(p => p.tier === selectedTier)?.price}.
              </p>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Details</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm" placeholder="MM/YY" />
                <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm" placeholder="CVC" />
              </div>
            </div>
          )}

          <button 
            onClick={handleProcessPayment}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
              paymentMethod === 'mpesa' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
            } disabled:opacity-50`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {paymentMethod === 'mpesa' ? 'Prompting Phone...' : 'Processing...'}
              </span>
            ) : (
              `Pay KES ${PLANS.find(p => p.tier === selectedTier)?.price}`
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Choose Your Workspace Power</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">Scale your Kenyan design business with tools that actually work for local professionals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div 
            key={plan.tier}
            className={`relative p-6 rounded-3xl border transition-all flex flex-col h-full ${
              plan.recommended 
                ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/10' 
                : 'border-gray-100 bg-white'
            }`}
          >
            {plan.recommended && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                Recommended
              </span>
            )}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-900">KES {plan.price}</span>
                <span className="text-xs text-gray-400">/mo</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-gray-600">
                  <i className="fas fa-check-circle text-amber-500 mt-1 mr-2 text-xs"></i>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSelectPlan(plan.tier)}
              disabled={plan.tier === currentSubscription.tier}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                plan.tier === currentSubscription.tier
                  ? 'bg-gray-100 text-gray-400 cursor-default'
                  : plan.recommended
                    ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-600/20'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {plan.tier === currentSubscription.tier ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center items-center gap-8 opacity-40 grayscale pt-4">
        <i className="fab fa-cc-visa text-3xl"></i>
        <i className="fab fa-cc-mastercard text-3xl"></i>
        <span className="font-black text-xl italic">M-PESA</span>
      </div>
    </div>
  );
};

export default SubscriptionManager;
