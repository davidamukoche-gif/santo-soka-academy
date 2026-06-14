import { Check, Crown } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    features: [
      "Limited movie catalog",
      "Ads during streaming",
      "Standard quality (480p)",
      "3 downloads/month",
      "1 device",
    ],
    notIncluded: ["HD streaming", "Ad-free experience", "Unlimited downloads"],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    name: "Basic",
    price: "$2.99",
    period: "/month",
    features: [
      "Full movie catalog",
      "Remove all ads",
      "HD streaming (720p)",
      "10 downloads/month",
      "2 devices",
    ],
    notIncluded: ["4K streaming", "Unlimited downloads"],
    cta: "Subscribe",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$5.99",
    period: "/month",
    features: [
      "Full movie catalog",
      "Remove all ads",
      "Full HD streaming (1080p)",
      "Unlimited downloads",
      "4 devices",
      "Offline mode",
    ],
    notIncluded: [],
    cta: "Subscribe",
    highlighted: true,
  },
  {
    name: "Family",
    price: "$9.99",
    period: "/month",
    features: [
      "Full movie catalog",
      "Remove all ads",
      "4K streaming",
      "Unlimited downloads",
      "6 devices",
      "5 user profiles",
      "Kids mode",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Subscribe",
    highlighted: false,
  },
];

export default function PlansPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-[var(--muted)] max-w-md mx-auto">
          Upgrade to premium for the best entertainment experience. Cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl p-6 border transition-colors ${
              plan.highlighted
                ? "bg-[var(--primary)]/10 border-[var(--primary)] ring-1 ring-[var(--primary)]"
                : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/50"
            }`}
          >
            {plan.highlighted && (
              <span className="text-xs bg-[var(--primary)] text-white px-3 py-1 rounded-full font-medium">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-bold mt-3">{plan.name}</h3>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-sm text-[var(--muted)]">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                plan.highlighted
                  ? "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
                  : plan.name === "Free"
                  ? "bg-[var(--card-hover)] text-[var(--muted)] cursor-default"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="mt-12 text-center">
        <p className="text-sm text-[var(--muted)] mb-3">Payment methods supported</p>
        <div className="flex items-center justify-center gap-6">
          <span className="bg-[var(--card)] px-4 py-2 rounded-lg text-sm border border-[var(--border)]">
            Stripe (Card)
          </span>
          <span className="bg-[var(--card)] px-4 py-2 rounded-lg text-sm border border-[var(--border)]">
            M-Pesa
          </span>
        </div>
      </div>
    </div>
  );
}
