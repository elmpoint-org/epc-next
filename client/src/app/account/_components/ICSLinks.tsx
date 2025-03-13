import { getUser } from '@/app/_ctx/user/provider';
import { graphql } from '@/query/graphql';
import { graphAuthServer } from '@/query/graphql.server';
import { apiDomain } from '@@/util/dev';

import IncompleteWarning from '@/app/_components/_base/IncompleteWarning';

export default async function ICSLinks() {
  const user = (await getUser()) || null;

  const { errors, data } = await graphAuthServer(
    graphql(`
      query StayTokensFromUser($userId: ID!) {
        stayTokensFromUser(userId: $userId) {
          id
          token
          timestamp {
            created
          }
        }
      }
    `),
    {
      userId: user?.id ?? '',
    },
  );
  const tokens = data?.stayTokensFromUser;

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg">Calendar Integrations</h3>
        </div>
        <div className="p-2 pb-0 text-slate-600">
          <p>These are your calendar integration links.</p>
        </div>

        <div className="p-4">
          {tokens?.map(({ token }, i) => (
            <li key={token} className="t">
              <a
                href={apiDomain + '/ics/' + token}
                className="font-bold text-emerald-700 hover:underline"
              >
                ICS Link {i + 1}
              </a>
            </li>
          ))}

          <div className="hidden text-sm italic text-slate-600 first:block">
            none found
          </div>
        </div>

        <IncompleteWarning />
      </div>
    </>
  );
}
