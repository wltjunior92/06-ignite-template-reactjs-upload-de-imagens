import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

// import PagesManifestPlugin from 'next/dist/build/webpack/plugins/pages-manifest-plugin';
import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    ({ pageParam }) =>
      api.get('/api/images', {
        params: {
          after: pageParam,
        },
      }),
    {
      getNextPageParam: result => result.data.after,
    }
  );

  const formattedData = useMemo(() => {
    return data?.pages.map(page => page.data.data).flat();
  }, [data]);

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <Error />
      </>
    );
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button mt="3rem" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
