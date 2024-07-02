'use client';

import { Table } from '@mantine/core';

import { useGraphQuery } from '@/query/query';
import { graphql } from '@/query/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';
import A from '@/app/_components/_base/A';

const GET_PAGES_QUERY = graphql(`
  query CmsPages {
    cmsPages {
      id
      slug
      title
      secure
      publish
      contributors {
        id
      }
      timestamp {
        created
        updated
      }
    }
  }
`);
export type PagesType = ResultOf<typeof GET_PAGES_QUERY>['cmsPages'];

export default function PagesList() {
  const pagesQuery = useGraphQuery(GET_PAGES_QUERY);
  const pages = pagesQuery.data?.cmsPages ?? null;
  return (
    <>
      <div>Pages</div>
      {pages?.length && (
        <div className="t">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Link</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Published</Table.Th>
                <Table.Th>Secure</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pages
                .filter((it) => it?.slug?.length)
                .sort((a, b) => b!.timestamp.created - a!.timestamp.created)
                .map((p) => {
                  const page = p!;
                  return (
                    <Table.Tr key={page.id}>
                      <Table.Td>/pages/{page.slug}</Table.Td>
                      <Table.Td>
                        <A href={`/cms/pages/edit/${page.id}`}>{page.title}</A>
                      </Table.Td>
                      <Table.Td>{'' + page.publish}</Table.Td>
                      <Table.Td>{'' + page.secure}</Table.Td>
                    </Table.Tr>
                  );
                })}
            </Table.Tbody>
          </Table>
        </div>
      )}
    </>
  );
}
