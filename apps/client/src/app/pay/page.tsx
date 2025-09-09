import { Metadata } from 'next';
import ColorText from '../_components/_base/ColorText';
import {
  IconCodeVariablePlus,
  IconHomeDollar,
  IconPigMoney,
} from '@tabler/icons-react';

export const metadata: Metadata = {
  title: 'Payment Portal',
};

export default function Page() {
  return (
    <>
      <div className="page-full-width flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
          Payment Portal
        </h1>
        <div className="flex-1 rounded-lg bg-dwhite">
          <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
            {/* instructions */}
            <div className="my-4 gap-4">
              <p className="mt-0.5 flex-1">
                Calculate and pay your <ColorText>daily residence</ColorText>{' '}
                and <ColorText>annual dues</ColorText>, plus any other camp
                expenses.
              </p>
            </div>

            <div className="relative flex flex-col gap-2 rounded-lg border border-slate-200 p-4 text-sm shadow-sm">
              {/* new payment options */}

              <p className="pb-2 text-base">Select payment type:</p>
              <div className="flex flex-row gap-4 rounded-sm">
                <button className="flex flex-1 cursor-pointer flex-col rounded-md border border-slate-300 p-3.5 text-left text-slate-700 shadow-sm shadow-slate-600/10 transition hover:border-slate-400">
                  <div className="mb-2 flex flex-row items-center gap-2">
                    <IconHomeDollar
                      stroke={1.5}
                      className="size-5 text-slate-600"
                    />
                    <h4 className="font-bold">Daily Residence</h4>
                  </div>
                  <p className="t">Calculate and pay your daily head tax</p>
                </button>
                <button className="flex flex-1 cursor-pointer flex-col rounded-md border border-slate-300 p-3.5 text-left text-slate-700 shadow-sm shadow-slate-600/10 transition hover:border-slate-400">
                  <div className="mb-2 flex flex-row items-center gap-2">
                    <IconPigMoney
                      stroke={1.5}
                      className="size-5 text-slate-600"
                    />
                    <h4 className="font-bold">Annual Dues</h4>
                  </div>
                  <p className="t">Pay dues per share of ownership</p>
                </button>
                <button className="flex flex-1 cursor-pointer flex-col rounded-md border border-slate-300 p-3.5 text-left text-slate-700 shadow-sm shadow-slate-600/10 transition hover:border-slate-400">
                  <div className="mb-2 flex flex-row items-center gap-2">
                    <IconCodeVariablePlus
                      stroke={1.5}
                      className="size-5 text-slate-600"
                    />
                    <h4 className="font-bold">Other Payments&hellip;</h4>
                  </div>
                  <p className="t">Fundraisers, custom payments, etc.</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
