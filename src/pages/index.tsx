import { useState } from 'react';
import Card from '@mui/material/Card';
import DeleteIcon from '@mui/icons-material/Delete';
import type { inferProcedureInput } from '@trpc/server';
import { trpc } from '../utils/trpc';
import type { NextPageWithLayout } from './_app';
import type { AppRouter } from '~/server/routers/_app';
import { Grid, IconButton, Pagination } from '@mui/material';

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useUtils();
  const [page, setPage] = useState(0);
  const monkeyQuery = trpc.monkey.list.useQuery(
    {
      limitSize: 3,
      pageIndex: page,
    },
  );

  const addMonkey = trpc.monkey.create.useMutation({
    async onSuccess() {
      // refetches monkeys after a monkey is added
      await utils.monkey.list.invalidate();
    },
  });

  const deleteMonkey = trpc.monkey.delete.useMutation({
    async onSuccess() {
      // refetches monkeys after a monkey is added
      await utils.monkey.list.invalidate();
    },
  });

  return (
    <div className="flex flex-col bg-gray-800 py-8">
      <div>
        <h1 style={{ marginBottom: 10, fontSize: 24 }}>Monkey Pictures</h1>
        <Grid container spacing={2}>
          {monkeyQuery && monkeyQuery.data && monkeyQuery.data.pictures.map((monkey) => (
            <Grid item xs={4}>
              <Card key={monkey.id}>
                <img src={monkey.url} alt={monkey.url} />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginLeft: 10,
                    marginRight: 10
                  }}
                >
                  <p style={{ textAlign: 'center' }}>{monkey.description}</p>
                  <IconButton onClick={async () => {
                    await deleteMonkey.mutate({ id: monkey.id });
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
        {monkeyQuery && monkeyQuery.data && monkeyQuery.data.total && (
          <Pagination
            count={Math.ceil(monkeyQuery?.data?.total / 3)}
            color="primary"
            style={{
              display: 'flex',
              marginTop: 20,
              justifyContent: 'center',
              marginBottom: 20
            }}
            onChange={(e, value) => setPage(value - 1)}
            defaultValue={page}
          />
        )}
      </div>
      <hr />

      <div className="flex flex-col py-8 items-center">
        <h2 className="text-3xl font-semibold pb-2">Add a Monkey</h2>

        <form
          className="py-2 w-4/6"
          onSubmit={async (e) => {
            /**
             * In a real app you probably don't want to use this manually
             * Checkout React Hook Form - it works great with tRPC
             * @link https://react-hook-form.com/
             * @link https://kitchen-sink.trpc.io/react-hook-form
             */
            e.preventDefault();
            const $form = e.currentTarget;
            const values = Object.fromEntries(new FormData($form));
            type Input = inferProcedureInput<AppRouter['monkey']['create']>;
            const input: Input = {
              url: values.url as string,
              description: values.description as string,
            };

            try {
              await addMonkey.mutateAsync(input);

              $form.reset();
            } catch (cause) {
              console.error({ cause }, 'Failed to add monkey');
            }
          }}
        >
          <div className="flex flex-col gap-y-4 font-semibold">
            <input
              className="focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
              id="url"
              name="url"
              type="text"
              placeholder="URL"
              disabled={addMonkey.isPending}
            />
            <textarea
              className="resize-none focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
              id="description"
              name="description"
              placeholder="Description"
              disabled={addMonkey.isPending}
              rows={6}
            />

            <div className="flex justify-center">
              <input
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="submit"
                disabled={addMonkey.isPending}
              />
              {addMonkey.error && (
                <p style={{ color: 'red' }}>{addMonkey.error.message}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndexPage;
