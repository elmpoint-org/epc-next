import { Metadata } from 'next';
import ColorText from '../_components/_base/ColorText';
import {
  IconChevronRight,
  IconCodeVariablePlus,
  IconHomeDollar,
  IconPigMoney,
} from '@tabler/icons-react';
import { Button, Checkbox } from '@mantine/core';

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

            <div className="relative flex flex-col gap-2 rounded-lg border border-slate-200 p-6 text-sm shadow-sm">
              {/* new payment options */}
              <h3 className="pb-2 text-base">Make a new payment&hellip;</h3>
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

              <hr className="my-4 border-slate-300" />

              {/* ready payments table */}

              <h3 className="text-base">Ready to pay</h3>

              <table
                className="grid grid-flow-col gap-x-4 text-left"
                style={{
                  gridTemplateColumns:
                    'min-content min-content 1fr min-content min-content',
                }}
              >
                <thead className="col-span-full grid grid-cols-subgrid border-b border-slate-300 px-2 py-2">
                  <tr className="col-span-full grid grid-cols-subgrid items-center text-nowrap">
                    <th>
                      <Checkbox size="xs" />
                    </th>
                    <th>Type</th>
                    <th>Description</th>
                    <th className="text-center sm:w-20">Amount</th>
                    <th className="">
                      <Button size="compact-sm" className="px-3">
                        Pay all
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody className="col-span-full grid grid-cols-subgrid divide-y divide-slate-200 *:p-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <tr
                      key={i}
                      className="col-span-full grid grid-cols-subgrid items-center"
                    >
                      <td>
                        <Checkbox size="xs" />
                      </td>
                      <td className="text-nowrap">Head Tax</td>
                      <td>Dec 20-27, 2024 (7 nights, 3 members)</td>
                      <td className="text-center font-bold">$300</td>
                      <td>
                        <Button
                          size="compact-sm"
                          variant="subtle"
                          className="group w-full"
                        >
                          <span className="mx-0 transition-all group-hover:mx-0.5">
                            Pay
                          </span>{' '}
                          <IconChevronRight className="-mb-0.5 inline size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
