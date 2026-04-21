import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
} from "@/app/_components/legal/LegalPageLayout";
import { LEGAL_CONFIG } from "@/app/_lib/legal/config";

export const metadata: Metadata = {
  title: "Billing + Refund Policy · Vedge",
  description:
    "How Vedge charges, bills, and handles refunds + chargebacks across card and mobile-money rails.",
};

const TOC = [
  { id: "cycle", label: "1. Billing cycle + currency" },
  { id: "pro-rata", label: "2. Pro-ration + mid-cycle changes" },
  { id: "failed", label: "3. Failed payments + grace" },
  { id: "refunds", label: "4. Refunds" },
  { id: "chargebacks", label: "5. Chargebacks" },
  { id: "taxes", label: "6. Taxes" },
];

export default function RefundPage() {
  return (
    <LegalPageLayout
      kicker="Billing"
      title="Billing + Refund Policy"
      toc={TOC}
      intro={<>
        This policy governs how Vedge charges tenants and how we handle
        refunds, failed payments, and chargebacks. It sits alongside
        §6 of the <Link href="/legal/terms">Terms of Service</Link>.
      </>}
    >
      <LegalSection id="cycle" title="1. Billing cycle + currency">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Billing is <strong>monthly in advance</strong>. Annual
            commitments are available on request at a discount.
          </li>
          <li>
            Default currency is <strong>GHS</strong> for Ghanaian
            tenants, <strong>NGN</strong> for Nigerian tenants (on
            launch), and <strong>USD</strong> for tenants billed
            internationally.
          </li>
          <li>
            Payment rails — Paystack (GH / NG), Flutterwave (pan-African),
            Stripe (international). Mobile money is supported through
            Paystack and Flutterwave; cards through all three.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="pro-rata" title="2. Pro-ration + mid-cycle changes">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Upgrading a plan or enabling a paid add-on mid-cycle:
            charged at sign-up for the remainder of the cycle, pro-rated
            to the day.
          </li>
          <li>
            Downgrading a plan: the new price applies from the next
            cycle. No partial refund of the current cycle.
          </li>
          <li>
            Cancelling an add-on: stays active until the end of the
            current cycle. No partial refund.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="failed" title="3. Failed payments + grace">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            We retry a failed recurring charge up to 3 times over 7
            days.
          </li>
          <li>
            Day 1 of failure: email reminder + dashboard banner to the
            tenant admin.
          </li>
          <li>
            Day 8 of failure (grace ended): Service is suspended. Tenant
            and Authorised Users can log in to export data and update
            payment; clinical workflows are paused.
          </li>
          <li>
            Day 38 (30 days suspended): Service is fully suspended and
            the tenant enters the data-export window; after that
            window, data is deleted per the DPA.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="refunds" title="4. Refunds">
        <p>
          SaaS fees are non-refundable except where:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Termination follows a material breach by Vedge — pro-rata
            refund of the unused portion of the current cycle.
          </li>
          <li>
            A sub-processor change under the DPA is reasonably objected
            to and cannot be resolved — pro-rata refund of prepaid
            fees.
          </li>
          <li>
            Duplicate charges or obviously erroneous billing — full
            refund within 5 business days of verification.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="chargebacks" title="5. Chargebacks">
        <p>
          If a tenant initiates a chargeback on a card or mobile-money
          transaction without first contacting{" "}
          <a href={`mailto:${LEGAL_CONFIG.billingEmail}`}>
            {LEGAL_CONFIG.billingEmail}
          </a>
          , the Service may be suspended pending resolution. A repeated
          pattern of chargebacks is a material breach of the{" "}
          <Link href="/legal/terms">Terms of Service</Link> §6.
        </p>
      </LegalSection>

      <LegalSection id="taxes" title="6. Taxes">
        <p>
          Prices quoted exclude VAT, NHIL, GETFund, and the COVID-19
          Health Recovery Levy; we add them at the rate applicable on
          the invoice date. Ghanaian tenants with a tax-exemption
          certificate may submit it to{" "}
          <a href={`mailto:${LEGAL_CONFIG.billingEmail}`}>
            {LEGAL_CONFIG.billingEmail}
          </a>{" "}
          for verification.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
